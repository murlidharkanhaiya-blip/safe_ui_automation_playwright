const { expect } = require('@playwright/test');

class EditBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        this.batchschedulingnavbar = this.page.locator("(//*[name()='svg'])[16]");
       this.monthalymailbutton = this.page.locator("(//div[contains(text(),'Monthly Mail')])[1]");
        this.editscheduler = this.page.locator("(//img[@title='Edit Schedule'])[1]");
    
        this.selectrange = this.page.locator("//input[@placeholder='Select Range']");
        this.nextsevendays = this.page.locator("(//li[normalize-space()='Next 7 Days'])[1]");

        this.savebutton = this.page.locator("(//button[normalize-space()='Save'])[1]");
    }

    async EditBatchschedulingjob() {
        await this.batchschedulingnavbar.click();
        await this.page.waitForTimeout(2000);

        await this.monthalymailbutton.click();
        await this.page.waitForTimeout(2000);

        await this.editscheduler.click();
        await this.page.waitForTimeout(1000);

        // Select range → next seven days
        await this.selectrange.click();
        await this.page.waitForTimeout(1000);
        await this.page.mouse.wheel(0, 400);
        await this.page.waitForTimeout(1000);
        await this.nextsevendays.waitFor({ state: 'visible', timeout: 5000 });
        await this.nextsevendays.click();
        console.log("✅ Date range 'next 7 days' selected");

        // Scroll page to bottom first
await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await this.page.waitForTimeout(1000);


// Scroll to Save button
const saveButton = this.page.locator("(//button[normalize-space()='Save'])[1]");
await saveButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(500);

// Wait until Save is enabled
await expect(saveButton).toBeVisible({ timeout: 10000 });
await expect(saveButton).toBeEnabled({ timeout: 10000 });

// Click Save
await saveButton.click();
console.log("✅ Save button clicked");


// Optionally, wait for navigation or success message
await this.page.waitForTimeout(2000);
    }
}

module.exports = { EditBatchSchedulingJob };