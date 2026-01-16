const { expect } = require('@playwright/test');

class ManageEmployeeSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.manageemployeenavbar ="//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Employees']//a[@data-testid='nav-link']";
        this.chiptexticonclose = "(//img[@class='chip-icon'])[1]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
        this.managerCell = "td:nth-child(5)";
        this.seniorManagerCell = "td:nth-child(6)";
    }

    async verifySearchOnmanageemployeePage() {
        await this.page.waitForLoadState('networkidle');

        // Navigate to Manage Employee page
       const managempnav = this.page.locator(this.manageemployeenavbar);
        await managempnav.waitFor({ state: 'visible', timeout: 15000 });
        await managempnav.click();

        // Wait for potential loader to disappear
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 10000 });
        }

        // Remove chip filter
        //const chipClose = this.page.locator(this.chiptexticonclose);
        //if (await chipClose.isVisible().catch(() => false)) {
            //await chipClose.click();
           // await this.page.waitForTimeout(500);
       // }

        // Wait for employee table
        const rows = this.page.locator(this.tableRow);
        await rows.first().waitFor({ timeout: 10000 });

        const count = await rows.count();
        if (count === 0) {
            throw new Error("❌ No Employee rows found.");
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        const employeeId = (await randomRow.locator(this.idCell).innerText()).trim();
        const employeeName = (await randomRow.locator(this.nameCell).innerText()).trim();
        const employeeEmail = (await randomRow.locator(this.emailCell).innerText()).trim();
        const managerName = (await randomRow.locator(this.managerCell).innerText()).trim();
        const seniorManagerName = (await randomRow.locator(this.seniorManagerCell).innerText()).trim();

        console.log(`🔍 Picked Random Employee:
        ID: ${employeeId}
        Name: ${employeeName}
        Email: ${employeeEmail}
        Manager: ${managerName}
        Senior Manager: ${seniorManagerName}`);

        const searchInput = this.page.locator(this.searchInput);

        // Reusable search function
        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            // Click the dropdown trigger
            const trigger = this.page.locator('[data-testid="searchBy"]');
            await trigger.click();

            // Wait for the dropdown options to show
            const option = this.page.locator(`.search__option--item >> text="${criteriaText}"`);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();

            // Perform search
            await searchInput.fill(inputValue);
            await this.page.locator(this.searchButton).click();
            await this.page.waitForTimeout(2000);

            // Validate
            const resultText = (await this.page.locator(cellSelector).first().innerText()).trim();
            expect(resultText).toContain(inputValue);
            console.log(`✅ ${label} Search Verified: ${resultText}`);
        };

        // Run all search criteria
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
        await performSearchAndAssert("Manager", managerName, this.managerCell, "Manager");
        await performSearchAndAssert("Senior Manager", seniorManagerName, this.seniorManagerCell, "Senior Manager");
    }
}

module.exports = { ManageEmployeeSearch };
