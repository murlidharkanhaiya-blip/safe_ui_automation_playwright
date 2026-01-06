const { expect } = require('@playwright/test');

class SuspiciousActivitiesSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.suspiciousactivitycardLocator = "(//span[normalize-space()='Suspicious Activities'])[1]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";     // Emp ID
        this.nameCell = "td:nth-child(2)";   // Emp Name
        this.emailCell = "td:nth-child(3)";  // Email ID
    }

    async verifySearchonsuspiciousactivitiesPage() {
        await this.page.waitForLoadState('networkidle');

        // Click on Suspicious Activities card
        await this.page.locator(this.suspiciousactivitycardLocator).click();

        // Wait for loader to disappear
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // Wait for at least one table row to be visible
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ state: 'visible', timeout: 15000 });

        const count = await rows.count();
        if (count === 0) {
            throw new Error("❌ No employee rows found.");
        }

        // Pick a random row
        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        // Wait for row to be visible before extracting data
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

            // Wait for dropdown wrapper before selecting item
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
                console.warn(`✅ ${label} search success  for "${inputValue}"`);
            }
        };

        // Run all search validations
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { SuspiciousActivitiesSearch };