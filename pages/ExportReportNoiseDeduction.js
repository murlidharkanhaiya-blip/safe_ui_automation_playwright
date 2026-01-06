class ExportReportNoiseDeduction {
    constructor(page) {
        this.page = page;

        // Locators
        this.noisededuction = "(//div[@class='block hand box-shadow'])[4]";
        this.individualnoise="(//img[@title='View'])[1]";
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonnoisedeductionpage() {
        await this.page.waitForLoadState('networkidle');

       //Click on noise deduction   nav icon
       await this.page.locator(this.noisededuction).click();
       
             //Click on individual noise deduction    icon
              await this.page.locator(this.individualnoise).click();

        // Step 1: Export CSV
        await this.page.locator(this.exporticon).click();
        await this.page.locator(this.csvbutton).click();

        // Step 2: Wait for success toast and screenshot
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportNoiseDeduction };