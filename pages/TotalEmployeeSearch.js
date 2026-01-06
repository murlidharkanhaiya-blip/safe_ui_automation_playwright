const { expect } = require('@playwright/test');

class TotalEmployeeSearch {
    constructor(page) {
        this.page = page;

        // ✅ Stable locator using card's unique class
        this.totalemployeeNavViewLocator = "(//div[contains(@class,'count-card__common')])[1]";

        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";
        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
        this.managerCell = "td:nth-child(5)";
        this.seniorManagerCell = "td:nth-child(6)";
        this.pageHeader = "//h1[contains(., 'Manage Employees')]";
    }

    async waitForVisibleRows(rows, retries = 5, delay = 2000) {
        for (let i = 0; i < retries; i++) {
            const count = await rows.count();
            if (count > 0) return count;
            await this.page.waitForTimeout(delay);
        }
        return 0;
    }

    async verifySearchOntotalemployeePage() {
        await this.page.waitForLoadState('domcontentloaded');

        // Ensure the Total Employees card is visible and clickable
        const card = this.page.locator(this.totalemployeeNavViewLocator);
        await card.waitFor({ state: 'visible', timeout: 10000 });
        await card.click();

        // Wait for navigation confirmation
        try {
            await this.page.waitForSelector(this.searchInput, { timeout: 10000 });
        } catch {
            throw new Error("❌ Navigation to Manage Employees page failed after clicking Total Employee card.");
        }

        // Wait for loader if present
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 10000 });
        }

        // Wait for the first Employee ID cell to appear
        const firstCell = this.page.locator(`${this.tableRow} >> ${this.idCell}`).first();
        await firstCell.waitFor({ state: 'visible', timeout: 10000 });

        // Confirm row presence
        const rows = this.page.locator(this.tableRow);
        const count = await this.waitForVisibleRows(rows);
        if (count === 0) {
            throw new Error("❌ No employee rows found after retries.");
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomRow = rows.nth(randomIndex);

        // Wait for full row to render
        await randomRow.locator(this.idCell).waitFor({ state: 'visible', timeout: 5000 });

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

        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            if (!inputValue || inputValue === '-') {
                console.warn(`⚠️ Skipping ${label} search due to missing value.`);
                return;
            }

            const trigger = this.page.locator('[data-testid="searchBy"]');
            await trigger.click();

            const option = this.page.locator(`.search__option--item >> text="${criteriaText}"`);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();

            await searchInput.fill(inputValue);
            await this.page.locator(this.searchButton).click();

            const resultCell = this.page.locator(cellSelector).first();
            await resultCell.waitFor({ state: 'visible', timeout: 10000 });

            const resultText = (await resultCell.innerText()).trim();
            expect(resultText).toContain(inputValue);
            console.log(`✅ ${label} Search Verified: ${resultText}`);
        };

        // Perform search assertions
        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
        await performSearchAndAssert("Manager", managerName, this.managerCell, "Manager");
        await performSearchAndAssert("Senior Manager", seniorManagerName, this.seniorManagerCell, "Senior Manager");
    }
}

module.exports = { TotalEmployeeSearch };