const { expect } = require('@playwright/test');

class FilterChipActivityLogs {
    constructor(page) {
        this.page = page;

        // Locators
        this.FilterchipactivitylogsNavViewLocator = "(//a[@data-testid='nav-link'])[18]";
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectrange = this.page.locator("(//input[@placeholder='Select Range'])[1]");
      //  this.selectyesterday = this.page.locator("(//li[@data-range-key='Yesterday'])[1]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async verifyactivitylogsfilterchip() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to activity log  page
        await this.page.locator(this.FilterchipactivitylogsNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        

            // Open filter chip
            await this.filterchip.click();
            await this.page.waitForTimeout(1000);

            // Open date range 
            await this.selectrange.click();
            await this.page.waitForTimeout(1000);


            // Select the given yesterday value
            const selectyesterday = this.page.locator("(//li[@data-range-key='Yesterday'])[1]");
            await selectyesterday.waitFor({ state: 'visible', timeout: 8000 });
            await selectyesterday.click({ force: true });
            await this.page.waitForTimeout(1000);

            // Click Apply button
            await this.applybtn.waitFor({ state: 'visible', timeout: 8000 });
            await this.applybtn.scrollIntoViewIfNeeded();
            await this.applybtn.click({ force: true });
            console.log(`✅ Filter "Yesterday" applied successfully.`);
            await this.page.waitForTimeout(2000);
        };


    }


module.exports = { FilterChipActivityLogs };