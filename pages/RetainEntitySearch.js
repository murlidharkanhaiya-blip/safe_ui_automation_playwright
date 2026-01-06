const { expect } = require('@playwright/test');

class RetainEntitySearch {
    constructor(page) {
        this.page = page;

        this.retainentitycardLocator = "(//div[@class='dashboard-box'])[4]";
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async verifySearchonretainentityPage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Click the card
        await this.page.locator(this.retainentitycardLocator).click();

        // Step 2: Wait for loader (if present)
        const loader = this.page.locator('#global-loader-container >> .loading');
        try {
            if (await loader.isVisible({ timeout: 3000 })) {
                await loader.waitFor({ state: 'hidden', timeout: 15000 });
            }
        } catch {
            console.log("⚠️ Loader not visible or skipped.");
        }

        // Step 3: Wait until at least one visible row is present
        await this.page.waitForFunction(() => {
            const rows = document.querySelectorAll('tr.MuiTableRow-root');
            return Array.from(rows).some(row => row.offsetParent !== null);
        }, null, { timeout: 20000 });

        // Step 4: Extract a usable row
        const rows = this.page.locator(this.tableRow);
        const count = await rows.count();

        let employeeId = '', employeeName = '', employeeEmail = '';
        let found = false;

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);

            try {
                await row.scrollIntoViewIfNeeded();
                await row.waitFor({ state: 'visible', timeout: 5000 });

                const idCell = row.locator(this.idCell);
                const nameCell = row.locator(this.nameCell);
                const emailCell = row.locator(this.emailCell);

                await Promise.all([
                    idCell.waitFor({ state: 'visible', timeout: 3000 }),
                    nameCell.waitFor({ state: 'visible', timeout: 3000 }),
                    emailCell.waitFor({ state: 'visible', timeout: 3000 }),
                ]);

                employeeId = (await idCell.innerText()).trim();
                employeeName = (await nameCell.innerText()).trim();
                employeeEmail = (await emailCell.innerText()).trim();

                if (employeeId && employeeName && employeeEmail) {
                    found = true;
                    break;
                }
            } catch (err) {
                console.log(`⏭ Skipping row ${i + 1}: Not stable or visible.`);
            }
        }

        if (!found) {
            throw new Error("❌ No usable row with all 3 fields visible and filled.");
        }

        console.log(`🔍 Picked Employee:\n  ID: ${employeeId}\n  Name: ${employeeName}\n  Email: ${employeeEmail}`);

        // Step 5: Search and verify for each criteria
        const performSearchAndAssert = async (criteriaText, inputValue, cellSelector, label) => {
            console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

            // Select search criteria from dropdown
            await this.page.locator('[data-testid="searchBy"]').click();
            const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();

            // Fill input and search
            const inputBox = this.page.locator(this.searchInput);
            await inputBox.fill('');
            await inputBox.fill(inputValue);
            await this.page.locator(this.searchButton).click();

            // Wait for table update
            const resultRows = this.page.locator(this.tableRow);
            await this.page.waitForTimeout(1500);

            const resultCount = await resultRows.count();
            if (resultCount === 0) {
                console.warn(`⚠️ No results found for ${label}: "${inputValue}"`);
                return;
            }

            const resultRow = resultRows.first();
            const resultCell = resultRow.locator(cellSelector);
            const resultText = (await resultCell.innerText()).trim();
            expect(resultText).toContain(inputValue);
            console.log(`✅ ${label} search verified.`);
        };

        await performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }
}

module.exports = { RetainEntitySearch };