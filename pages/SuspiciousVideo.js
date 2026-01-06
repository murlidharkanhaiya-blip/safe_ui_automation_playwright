const { expect } = require('@playwright/test');

class SuspiciousVideo {
    constructor(page) {
        this.page = page;

        // Locators
        this.suspiciousCard = this.page.locator("(//span[normalize-space()='Suspicious Activities'])[1]");
        this.videotab=this.page.locator("(//div[@class='videos failed-captures btn btn-outline-success '])[1]");
        this.eyeicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
        this.drilldown=this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");
        this.markasunsuspicious=this.page.locator("(//img[contains(@title,'Mark as unsuspicious')])[1]");
        this.selectthereasonfromdropdown=this.page.locator("(//div[contains(@data-testid,'inputBoxDiv-ellipsis')])[1]");
        this.confirmbtn=this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");

        
    }

    // ✅ Wait for loader to disappear
   async suspiciousactivitycard() {
        
       await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await this.suspiciousCard.scrollIntoViewIfNeeded();
        await this.suspiciousCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.suspiciousCard.click();
        const loader = this.page.locator('#global-loader-container >> .loading');
        
        // Step2 click on Video tab 
        await this.videotab.waitFor({ state: 'visible', timeout: 5000 });
        await this.videotab.click();

         // Step2 click on eye icon 
        await this.eyeicon.waitFor({ state: 'visible', timeout: 5000 });
        await this.eyeicon.click();
        //Click on drilldown icon
        await this.drilldown.waitFor({ state: 'visible', timeout: 5000 });
        await this.drilldown.click();

       //Click on mark as unsuspicious icon
        await this.markasunsuspicious.waitFor({ state: 'visible', timeout: 5000 });
        await this.markasunsuspicious.click();

        //select the value from dropdown
        
await this.selectthereasonfromdropdown.click();
await this.page.getByText('Excusable Object Detected', { exact: true }).click();
await this.confirmbtn.click();

       
    }
}

module.exports = { SuspiciousVideo };