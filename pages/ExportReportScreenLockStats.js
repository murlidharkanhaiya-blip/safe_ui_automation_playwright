class ExportReportScreenLockStats {
    constructor(page) {
        this.page = page;
        this.screenlockNavViewLocator = "(//*[name()='svg'])[15]";
        this.exporticon = "//button[@class='btn download-icon btn-spacing export-as  ']";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";

       
    }

    async verifyexportreportonscreenlockstatspage() {
        await this.page.waitForLoadState('networkidle');

        

        // Step 1: Click screenlock stats card
        await this.page.locator(this.screenlockNavViewLocator).click();
        await this.page.waitForTimeout(2000);

        // Step 2: Export CSV
        await this.page.locator(this.exporticon).click();
        await this.page.locator(this.csvbutton).click();

        // Step 3: Wait for success toast and screenshot
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportScreenLockStats };