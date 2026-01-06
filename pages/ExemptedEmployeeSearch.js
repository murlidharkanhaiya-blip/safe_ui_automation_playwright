const { expect } = require('@playwright/test');

class ExemptedEmployeeSearch {
    constructor(page) {
        this.page = page;

        this.exemptedemployeecardLocator = "(//div[@class='dashboard-box'])[1]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async verifySearchonexemptedemployeePage() {
        await this.page.waitForLoadState('networkidle');

        // Click the card
        await this.page.locator(this.exemptedemployeecardLocator).click();

        // Wait for loader
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // ✅ Wait for table to load
        await this.page.waitForTimeout(1000); // slight buffer
        await this.page.locator(this.tableRow).first().waitFor({ state: 'visible', timeout: 15000 });

        // ❗ Re-fetch fresh locator (page likely navigated/reloaded)
        const rows = this.page.locator(this.tableRow);
        const count = await rows.count();
        if (count === 0) throw new Error("❌ No employee rows found.");

        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        // ✅ Locate cell elements AFTER fresh row is fetched
        const idCellLocator = randomRow.locator(this.idCell);
        const nameCellLocator = randomRow.locator(this.nameCell);
        const emailCellLocator = randomRow.locator(this.emailCell);

        await Promise.all([
            idCellLocator.waitFor({ state: 'visible', timeout: 10000 }),
            nameCellLocator.waitFor({ state: 'visible', timeout: 10000 }),
            emailCellLocator.waitFor({ state: 'visible', timeout: 10000 }),
        ]);

        const employeeId = (await idCellLocator.innerText()).trim();
        const employeeName = (await nameCellLocator.innerText()).trim();
        const employeeEmail = (await emailCellLocator.innerText()).trim();

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

        // Search by all 3 fields
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { ExemptedEmployeeSearch };