const { expect } = require('@playwright/test');

class FilterChipDeleteEntity {
    constructor(page) {
        this.page = page;

        // Locators
        this.DeleteEntityNavViewLocator = "(//div[@class='dashboard-box'])[3]";
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
         this.selectrange = this.page.locator("(//input[@placeholder='Select Range'])[1]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");

        // Optional overlay locator
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async verifydeletetityfilterchip() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to delete image
        await this.page.locator(this.DeleteEntityNavViewLocator).click();
        await this.page.waitForTimeout(2000);

       // Open filter chip
            await this.filterchip.click();
            await this.page.waitForTimeout(1000);

            // Open date range 
            await this.selectrange.click();
            await this.page.waitForTimeout(1000);


        

            // Select the given yesterday value
            const selectlast90days = this.page.locator("(//li[@data-range-key='Last 90 Days'])[1]");
            await selectlast90days.waitFor({ state: 'visible', timeout: 8000 });
            await selectlast90days.click({ force: true });
            await this.page.waitForTimeout(1000);

            // Click Apply button
            await this.applybtn.waitFor({ state: 'visible', timeout: 8000 });
            await this.applybtn.scrollIntoViewIfNeeded();
            await this.applybtn.click({ force: true });
            console.log(`✅ Filter "Last 90 days" applied successfully.`);
            await this.page.waitForTimeout(2000);
        };

    }


module.exports = { FilterChipDeleteEntity };