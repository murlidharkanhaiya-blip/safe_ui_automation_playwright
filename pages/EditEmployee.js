const { expect } = require('@playwright/test');
const path = require('path');

class EditEmployee {
    constructor(page) {
        this.page = page;

        // ✅ Existing locators
        this.manageemployeenavbar = "(//*[name()='svg'])[11]";
        this.editbtn = "(//img[@title='Edit'])[1]";
        this.nexttButton = page.locator("//button[normalize-space()='Next']");
        this.viewimage=page.locator("(//img[@class='emp-image'])[1]");
    
    }

    async editupdateEmployee() {
        await this.page.locator(this.manageemployeenavbar).click();
        await this.page.waitForTimeout(2000);

        await this.page.locator(this.editbtn).click();
        await this.page.waitForTimeout(2000);
        

// ✅ Click NEXT
this.nexttButton = this.page.getByRole('button', { name: /next/i });
await this.nexttButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(this.nexttButton).toBeEnabled();
await this.nexttButton.click();
        
        // ✅ view image image
await this.viewimage.click

        
    }
}

module.exports = { EditEmployee };