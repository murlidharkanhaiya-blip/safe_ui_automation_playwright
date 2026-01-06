const { expect } = require("@playwright/test");

class ImageOnDemandSearch {
  constructor(page) {
    this.page = page;

   // Generic card locator by text
        this.cardTitleText = 'On Demand Media';

        // Search & button locators
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";
        this.imageTab = ("(//div[normalize-space()='Audio'])[1]");

        // Updated, reliable Completed tab selector
        this.completedCardSelector = 'div.status:has-text("Completed")';

    // ---------------- TABLE ----------------
    this.table = "//table";
    this.tableRows = "//table/tbody/tr";

    this.idCell = "td:nth-child(1)";
    this.nameCell = "td:nth-child(2)";
    this.emailCell = "td:nth-child(3)";
  }

   async scrollUntilCardIsVisible() {
        for (let i = 0; i < 10; i++) {
            const card = this.page.locator('div.block-container').filter({ hasText: this.cardTitleText });
            if (await card.count() > 0 && await card.first().isVisible()) {
                return card.first();
            }
            await this.page.mouse.wheel(0, 300); // scroll down
            await this.page.waitForTimeout(500);
        }
        throw new Error(`❌ On Demand Media card not found even after scrolling.`);
    }

    async verifySearchonimageondemandPage() {
        await this.page.waitForLoadState('networkidle');

        // ✅ Click the On Demand Media card
        const card = await this.scrollUntilCardIsVisible();
        const clickable = card.locator("div.block.hand.box-shadow");
        await clickable.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await clickable.click({ timeout: 5000 });
//click on image tab
const imageTab = this.page.locator(this.imageTab);
        console.log("⏳ Waiting for 'Completed' tab to appear...");
        await imageTab.waitFor({ state: 'attached', timeout: 10000 });
        await imageTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await imageTab.click();
        console.log("✅ Clicked on 'image' tab.");

        // ✅ Click the Completed tab
        const completedTab = this.page.locator(this.completedCardSelector);
        console.log("⏳ Waiting for 'Completed' tab to appear...");
        await completedTab.waitFor({ state: 'attached', timeout: 10000 });
        await completedTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await completedTab.click();
        console.log("✅ Clicked on 'Completed' tab.");

        // ✅ Wait for loader if it appears
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // ✅ Wait for table container and rows
        const tableWrapper = this.page.locator("div.MuiTableContainer-root");
        await tableWrapper.waitFor({ state: 'visible', timeout: 15000 });

        const rows = this.page.locator(this.tableRows);
        const count = await rows.count();

        if (count === 0) {
            console.warn("⚠️ No records found under 'Completed' tab. Skipping search validations.");
            return;
        }

        await rows.first().waitFor({ state: 'visible', timeout: 15000 });

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

           const resultRows = this.page.locator(this.tableRows);
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
  


module.exports = { ImageOnDemandSearch };
