const { expect } = require('@playwright/test');

class ActivityLogs {
    constructor(page) {
        this.page = page;

        // Locators
        this.FilterchipactivitylogsNavViewLocator = "(//a[@data-testid='nav-link'])[18]";
        this.activitylogsview = this.page.locator("(//img[@title='View'])[1]");
        this.nbrofscreenshotcapture = this.page.locator("(//a[normalize-space()='115'])[1]");
      //  this.selectyesterday = this.page.locator("(//li[@data-range-key='Yesterday'])[1]");
        this.downloadall = this.page.locator("(//button[normalize-space()='Download All'])[1]");
        
    }

    async verifyactivitylogsview() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to Batch Scheduling page
        await this.page.locator(this.FilterchipactivitylogsNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        

            // Open view 
            await this.activitylogsview.click();
            await this.page.waitForTimeout(1000);

            // Open nbr of screenshotcapture  
            await this.nbrofscreenshotcapture.click();
            await this.page.waitForTimeout(1000);


            // Click download button
            await this.downloadall.waitFor({ state: 'visible', timeout: 8000 });
            await this.downloadall.scrollIntoViewIfNeeded();
            await this.downloadall.click({ force: true });
            console.log(`✅  "A Zip File has been sent to your email.`);
            await this.page.waitForTimeout(2000);
        };

        
        
    }


module.exports = { ActivityLogs };