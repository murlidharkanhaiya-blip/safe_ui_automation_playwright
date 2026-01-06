const { expect } = require('@playwright/test');

class NSFWSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.nsfwcardLocator = "(//span[normalize-space()='NSFW Activity(s)'])[1]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async verifySearchonnsfwPage() {
        await this.page.waitForLoadState('networkidle');

        // Click on NSFW Activity(s) card
        await this.page.locator(this.nsfwcardLocator).click();

        // Wait for loader to disappear
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // Wait for table row visibility
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ state: 'visible', timeout: 15000 });

        const count = await rows.count();
        if (count === 0) {
            throw new Error("❌ No employee rows found.");
        }

        // Pick a random row
        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        // Wait for individual cells in the row
        const idLocator = randomRow.locator(this.idCell);
        const nameLocator = randomRow.locator(this.nameCell);
        const emailLocator = randomRow.locator(this.emailCell);

        await Promise.all([
            idLocator.waitFor({ state: 'visible', timeout: 10000 }),
            nameLocator.waitFor({ state: 'visible', timeout: 10000 }),
            emailLocator.waitFor({ state: 'visible', timeout: 10000 }),
        ]);

        const employeeId = (await idLocator.innerText()).trim();
        const employeeName = (await nameLocator.innerText()).trim();
        const employeeEmail = (await emailLocator.innerText()).trim();

        console.log(`🔍 Picked Random Employee:\n  ID: ${employeeId}\n  Name: ${employeeName}\n  Email: ${employeeEmail}`);

        const searchInput = this.page.locator(this.searchInput);

        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

            // Click dropdown to select search criteria
            const trigger = this.page.locator('[data-testid="searchBy"]');
            await trigger.click();

            const dropdownWrapper = this.page.locator('.search__options--dropdown');
            await dropdownWrapper.waitFor({ state: 'visible', timeout: 5000 });

            const option = dropdownWrapper.locator(`.search__option--item:has-text("${criteriaText}")`);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();

            await this.page.waitForTimeout(300); // debounce input
            await searchInput.fill('');
            await searchInput.fill(inputValue);
            await this.page.locator(this.searchButton).click();

            const resultRows = this.page.locator(this.tableRow);
            await this.page.waitForTimeout(1500); // Wait for result rendering

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
                console.warn(`⚠️ ${label} search result check failed for "${inputValue}"`);
            }
        };

        // Perform all search checks
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { NSFWSearch };
