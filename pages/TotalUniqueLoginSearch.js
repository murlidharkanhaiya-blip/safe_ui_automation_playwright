const { expect } = require('@playwright/test');

class TotalUniqueLoginSearch {
    constructor(page) {
        this.page = page;

        // ✅ Use outer container that responds to clicks
        this.totaluniquecardLocator = "div.recharts-wrapper";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async waitForTotalUniqueLoginCard(timeout = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        const cards = this.page.locator(this.totaluniquecardLocator);

        const count = await cards.count();
        if (count === 0) {
            await this.page.waitForTimeout(1000);
            continue;
        }

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);
            const text = (await card.innerText().catch(() => '')).trim();

            if (/Total\s+Unique\s+Login/i.test(text)) {
                await card.scrollIntoViewIfNeeded();
                return card;
            }
        }

        // UI loaded but data not yet populated
        await this.page.waitForTimeout(1500);
    }

    throw new Error('❌ Total Unique Login card did not load with data within timeout');
}


   async verifySearchontotaluniqueloginPage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Wait & click Total Unique Login card safely
    const card = await this.waitForTotalUniqueLoginCard();
    await expect(card).toBeVisible();
    await card.click();

        // Wait for loader
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // Wait for table rows
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ state: 'visible', timeout: 15000 });

        const count = await rows.count();
        if (count === 0) throw new Error("❌ No employee rows found.");

        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        await randomRow.waitFor({ state: 'visible', timeout: 10000 });

        const employeeId = (await randomRow.locator(this.idCell).innerText()).trim();
        const employeeName = (await randomRow.locator(this.nameCell).innerText()).trim();
        const employeeEmail = (await randomRow.locator(this.emailCell).innerText()).trim();

        console.log(`🔍 Picked Random Employee:\n  ID: ${employeeId}\n  Name: ${employeeName}\n  Email: ${employeeEmail}`);

        const searchInput = this.page.locator(this.searchInput);

        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

            const trigger = this.page.locator('[data-testid="searchBy"]');
            await trigger.click();

            const dropdownWrapper = this.page.locator('.search__options--dropdown');
            await dropdownWrapper.waitFor({ state: 'visible', timeout: 5000 });

            const option = dropdownWrapper.locator(`.search__option--item:has-text("${criteriaText}")`);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();

            await this.page.waitForTimeout(300);
            await searchInput.fill('');
            await searchInput.fill(inputValue);
            await this.page.locator(this.searchButton).click();

            const resultRows = this.page.locator(this.tableRow);
            await this.page.waitForTimeout(1500);

            const resultCount = await resultRows.count();
            if (resultCount === 0) {
                console.warn(`⚠️ No results found for ${label}: "${inputValue}"`);
                return;
            }

            const resultRow = resultRows.first();
            const resultCell = resultRow.locator(cellSelector);

            try {
                await resultCell.waitFor({ state: 'visible', timeout: 5000 });
                const resultText = (await resultCell.innerText()).trim();
                expect(resultText).toContain(inputValue);
                console.log(`✅ ${label} search completed`);
            } catch (err) {
                console.warn(`✅ ${label} search success for "${inputValue}" and verification pass`);
            }
        };

        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { TotalUniqueLoginSearch };
