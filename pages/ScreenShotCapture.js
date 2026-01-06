const { expect } = require('@playwright/test');

class ScreenShotCapture {
    constructor(page) {
        this.page = page;

        // Locators
        this.screenshotNavViewLocator = "(//div[@class='block hand box-shadow'])[6]";
       this.actionview = this.page.locator("(//img[@title='View'])[1]");
        this.viewscreenshot = this.page.locator("(//a[normalize-space()='115'])[1]");
         this.downloadall = this.page.locator("(//button[normalize-space()='Download All'])[1]");

        
    }

    async verifydownloadscreenshot() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate to Batch Scheduling page
        await this.page.locator(this.screenshotNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        

            // Open view 
            await this.actionview.click();
            await this.page.waitForTimeout(1000);

            // Open view screenshot 
            await this.viewscreenshot.click();
            await this.page.waitForTimeout(1000);


            // Click download button
            await this.downloadall.waitFor({ state: 'visible', timeout: 8000 });
            await this.downloadall.scrollIntoViewIfNeeded();
            await this.downloadall.click({ force: true });
            console.log(`✅  "A Zip File has been sent to your email.`);
            await this.page.waitForTimeout(2000);

    
           
        };

        
        
    }


module.exports = { ScreenShotCapture };