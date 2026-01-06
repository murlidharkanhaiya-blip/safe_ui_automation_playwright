class ExportReportExmptedEmployee {
    constructor(page) {
        this.page = page;

        // Locators
       this.exemptedemployeecardLocator = "(//div[@class='dashboard-box'])[1]";
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonexmptedemployeepage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card exmpted employee
        await this,this.page.locator(this.exemptedemployeecardLocator).click();

        // Step 2: Click  action icon and Export > CSV
        
        await this.page.locator(this.exporticon).click();
        await this.page.locator(this.csvbutton).click();

        // Step 3: Wait for success toast
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        // Step 4: Screenshot
        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportExmptedEmployee };