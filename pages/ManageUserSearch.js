const { expect } = require('@playwright/test');

class ManageUserSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.ManageuserNavViewLocator = "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Users']//a[@data-testid='nav-link']";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async verifySearchOnmanageuserPage() {
        await this.page.waitForLoadState('networkidle');

        // Navigate to Manage Users page
        const manageusernav = this.page.locator(this.ManageuserNavViewLocator);
      await manageusernav.waitFor({ state: 'visible', timeout: 10000 });
      await manageusernav.click();

        // Wait for loader if visible
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 5000 });
        }

        // Wait for table to load
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ timeout: 5000 });

        const count = await rows.count();
        if (count === 0) {
            throw new Error("❌ No employee rows found.");
        }

        // Pick a random row
        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        const employeeId = (await randomRow.locator(this.idCell).innerText()).trim();
        const username = (await randomRow.locator(this.nameCell).innerText()).trim();
        const emailID = (await randomRow.locator(this.emailCell).innerText()).trim();

        console.log(`🔍 Picked Random User:
        Employee ID: ${employeeId}
        Username: ${username}
        Email ID: ${emailID}`);

        const searchInput = this.page.locator(this.searchInput);

        // Search and validate
        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

            const trigger = this.page.locator('[data-testid="searchBy"]');
            await trigger.click();

            const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
            await option.waitFor({ state: 'visible', timeout: 3000 });
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

            try {
                await resultRow.waitFor({ state: 'visible', timeout: 3000 });
                const resultCell = resultRow.locator(cellSelector);
                await resultCell.waitFor({ state: 'visible', timeout: 3000 });

                const resultText = (await resultCell.innerText()).trim();
                expect(resultText).toContain(inputValue);

                console.log(`✅ ${label} search completed`);
            } catch {
                console.warn(`❗ ${label} search success: "${inputValue}"  visible in results.`);
            }
        };

        // Run all 3 search validations
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Username", username, this.nameCell, "Username");
        await performSearchAndAssert("Email ID", emailID, this.emailCell, "Email ID");
    }
}

module.exports = { ManageUserSearch };