const { expect } = require('@playwright/test');

class FilterChipBatchScheduling {
    constructor(page) {
        this.page = page;

        // Locators
        this.FilterchipbatchschedulingNavViewLocator = "(//a[@data-testid='nav-link'])[16]";
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectstatus = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[1]");
        this.selectresult = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[2]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async verifybatchschedulingfilterchip() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to Batch Scheduling page
        await this.page.locator(this.FilterchipbatchschedulingNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        // Helper function to apply filter dynamically (for both Status & Result)
        const selectAndApplyFilter = async (dropdownLocator, filterValue) => {
            console.log(`🎯 Applying filter: ${filterValue}`);

            // Open filter chip
            await this.filterchip.click();
            await this.page.waitForTimeout(1000);

            // Open specific dropdown (Status or Result)
            await dropdownLocator.click();
            await this.page.waitForTimeout(1000);

            // Select the given dropdown value
            const optionLocator = this.page.locator(`//a[normalize-space(text())='${filterValue}']`);
            await optionLocator.waitFor({ state: 'visible', timeout: 8000 });
            await optionLocator.click({ force: true });
            await this.page.waitForTimeout(1000);

            // Click Apply button
            await this.applybtn.waitFor({ state: 'visible', timeout: 8000 });
            await this.applybtn.scrollIntoViewIfNeeded();
            await this.applybtn.click({ force: true });
            console.log(`✅ Filter "${filterValue}" applied successfully.`);
            await this.page.waitForTimeout(2000);
        };

        // Step 2: Apply Status filters sequentially
        const statusFilters = ["New", "Active", "Completed", "Stopped"];
        for (const status of statusFilters) {
            await selectAndApplyFilter(this.selectstatus, status);
        }

        // Step 3: Apply Result filters sequentially
        const resultFilters = ["Scheduled", "Failed", "Successful", "In Progress", "Not Run"];
        for (const result of resultFilters) {
            await selectAndApplyFilter(this.selectresult, result);
        }
    }
}

module.exports = { FilterChipBatchScheduling };