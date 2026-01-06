const { expect } = require('@playwright/test');
const path = require('path');

class ManageUser {
    constructor(page) {
        this.page = page;

        // ✅ Existing locators
        this.manageusernavbar = "(//*[name()='svg'])[13]";
        this.inviteButton = "(//button[contains(@type,'button')])[2]";
        this.empEmailInput = page.locator("(//input[contains(@placeholder,'Enter')])[1]");
        this.radiobutton = page.locator("(//span[@class='custom-radio-btn'])[1]");
        this.inviteuserbutton = page.locator("(//button[normalize-space()='INVITE USER'])[1]");

        
    }

    async Inviteuser() {
    await this.page.locator(this.manageusernavbar).click();
    await this.page.waitForTimeout(2000);

    await this.page.locator(this.inviteButton).click();
    await this.page.waitForTimeout(2000);

    // enter invitee email 
    await this.empEmailInput.fill("shivam.lnu05+1@telusinternational.com");
    await this.page.waitForTimeout(2000);

    // ✅ Select radio button 
    await this.radiobutton.waitFor({ state: 'visible', timeout: 10000 });
    await this.radiobutton.click();  

    // ✅ Final send invite
    await this.inviteuserbutton.waitFor({ state: 'visible', timeout: 10000 });
    await this.inviteuserbutton.click();

    // ⏳ Wait for and verify success message
    const successMessage = this.page.locator("//div[contains(text(),'If the entered email id was correct an invitation email has been sent to the user')]");
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    }
}

module.exports = { ManageUser };