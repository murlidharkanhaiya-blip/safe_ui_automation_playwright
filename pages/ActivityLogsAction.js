const { expect } = require('@playwright/test');

class ActivityLogsAction {
    constructor(page) {
        this.page = page;

        // Locators
        this.ctivitylogsNavViewLocator = "(//a[@data-testid='nav-link'])[18]";
        this.activitylogsview = this.page.locator("(//img[@title='View'])[1]");
        this.viewlogs = this.page.locator("(//img[@title='View Logs'])[1]");
      //  this.selectyesterday = this.page.locator("(//li[@data-range-key='Yesterday'])[1]");
        this.viewscreenshot = this.page.locator("(//img[@title='View Logs'])[1]");
        this.downloadlogs = this.page.locator("(//img[@title='Download Logs'])[1]");
        this.webhistory = this.page.locator("(//img[@title='Web History'])[1]");

        
    }

    async verifyactivitylogsactionview() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to Batch Scheduling page
        await this.page.locator(this.ctivitylogsNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        

            // Open view 
            await this.activitylogsview.click();
            await this.page.waitForTimeout(1000);

            // Open view logs 
            await this.viewlogs.click();
            await this.page.waitForTimeout(1000);

            //open view screenshot
            
            await this.viewscreenshot.click();
            await this.page.waitForTimeout(1000);

            // Click download logs
            await this.downloadlogs.waitFor({ state: 'visible', timeout: 8000 });
            await this.downloadlogs.scrollIntoViewIfNeeded();
            await this.downloadlogs.click({ force: true });

            //open web history

             await this.webhistory.click();
            await this.page.waitForTimeout(1000);
           
        };

        
        
    }


module.exports = { ActivityLogsAction };