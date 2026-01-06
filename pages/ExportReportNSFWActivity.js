class ExportReportNSFWActivity {
    constructor(page) {
        this.page = page;

        // Locators
        this.NSFWnav = "(//span[normalize-space()='NSFW Activity(s)'])[1]";
        this.exporticon = "//button[@class='btn download-icon btn-spacing export-as  ']";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonnsfwactivitypage() {
        await this.page.waitForLoadState('networkidle');

       //Click on suspicious activity  nav icon
       await this.page.locator(this.NSFWnav).click();
       
      
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

module.exports = { ExportReportNSFWActivity };