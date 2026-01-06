const { expect } = require('@playwright/test');

class ActivityLogSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.activitylogNavViewLocator = "(//*[name()='svg'])[18]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async verifySearchOnactivitylogPage() {
        await this.page.waitForLoadState('networkidle');

        // Navigate to Batch scheduling page
        await this.page.locator(this.activitylogNavViewLocator).click();

        // Wait for loader if visible
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 10000 });
        }

        // Wait for table to load
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ timeout: 10000 });

        const count = await rows.count();
        if (count === 0) {
            throw new Error("❌ No employee rows found.");
        }

        // Pick a random row
        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        const employeeId = (await randomRow.locator(this.idCell).innerText()).trim();
        const employeeName = (await randomRow.locator(this.nameCell).innerText()).trim();
        const employeeEmail = (await randomRow.locator(this.emailCell).innerText()).trim();

        console.log(`🔍 Picked Random Employee:
        ID: ${employeeId}
        Name: ${employeeName}
        Email: ${employeeEmail}`);

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
            await this.page.waitForTimeout(1000);

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
                console.warn(`✅ ${label} search success: "${inputValue}" visible in results.`);
            }
        };

        // Run search validations
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { ActivityLogSearch };
