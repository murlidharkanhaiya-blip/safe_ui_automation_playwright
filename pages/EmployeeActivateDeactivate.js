class EmployeeActivateDeactivate
 {
    constructor(page) {
        this.page = page;

        // Locators
         this.ManageemployeeNavViewLocator = "(//a[@data-testid='nav-link'])[11]";
         // ✅ action icon locator
        this.deactivateemployee = this.page.locator("(//img[@title='Deactivate Employee'])[1]");
        this.cnfbtn = this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");
        this.closeverifiedchip = this.page.locator("(//img[@class='chip-icon'])[1]");
        this.reactivateemployee=this.page.locator("(//img[@title='Reactivate Employee'])[1]");
       // this.rectivatecnfbtn=this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");
    }

    async verifyempactivatedeactivate() {
        await this.page.waitForLoadState('networkidle');

        //Step 1:click on manage employee

         await this.page.locator(this.ManageemployeeNavViewLocator).click();
         await this.page.waitForTimeout(2000);

        // Step 2: action icon

        await this.deactivateemployee.waitFor({ state: 'visible', timeout: 15000 });
        await this.deactivateemployee.click();

        // step 3:deactivate button confirmation

        await this.cnfbtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.cnfbtn.click();

        // Step 4: verifiled filter chip close 
       await this.closeverifiedchip.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeverifiedchip.click();

        //Step 5: rectivate employee

        await this.reactivateemployee.waitFor({ state: 'visible', timeout: 15000 });
        await this.reactivateemployee.click();
        await this.cnfbtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.cnfbtn.click();

    }
}

module.exports = { EmployeeActivateDeactivate };