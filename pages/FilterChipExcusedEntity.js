const { expect } = require('@playwright/test');

class FilterChipExcusedEntity {
    constructor(page) {
        this.page = page;

        // Locators
        this.excusedentityCard = page.locator('.dashboard-box:has-text("Excused Entities")');
        this.loader = page.locator('#global-loader-container');  
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectstatus = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[2]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");

        // Optional overlay locator
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async waitForLoader() {
    if (await this.loader.isVisible().catch(() => false)) {
      await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

    async verifyexcusedentityfilterchip() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to excused entity
        await this.excusedentityCard.waitFor({ state: 'visible', timeout: 30000 });
        await this.excusedentityCard.click();
         await this.waitForLoader();

        // Function to select and apply a given filter
        const selectAndApplyFilter = async (filterName) => {
            console.log(`🎯 Applying filter: ${filterName}`);

            // Open filter chip
            await this.filterchip.click();
            await this.page.waitForTimeout(1000);

            // Open status dropdown
            await this.selectstatus.click();
            await this.page.waitForTimeout(1000);

            // Select filter value
            const filterOption = this.page.locator(`//a[@data-testid='search-dropdown' and @title='${filterName}']`);
            await filterOption.waitFor({ state: 'visible', timeout: 10000 });
            await filterOption.click({ force: true });
            await this.page.waitForTimeout(1000);

            // Click Apply
            await this.applybtn.waitFor({ state: 'attached', timeout: 15000 });
            await this.applybtn.scrollIntoViewIfNeeded();
            await expect(this.applybtn).toBeVisible({ timeout: 10000 });

            try {
                await this.applybtn.click({ timeout: 5000 });
            } catch {
                await this.page.evaluate((btn) => btn.click(), await this.applybtn.elementHandle());
            }

            console.log(`✅ Filter "${filterName}" applied successfully.`);
            await this.page.waitForTimeout(3000);
        };

        // Step 2: Apply both filters sequentially
        await selectAndApplyFilter("Android");
        await selectAndApplyFilter("Chrome-Book");
         await selectAndApplyFilter("windows");
         await selectAndApplyFilter("Macos");

    }
}

module.exports = { FilterChipExcusedEntity };