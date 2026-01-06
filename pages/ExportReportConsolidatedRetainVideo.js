class ExportReportConsolidatedRetainVideo {
    constructor(page) {
        this.page = page;

        // Locators
       this.retainentitycardLocator = "(//div[@class='dashboard-box'])[2]";
       this.videotab="(//div[@class='videos failed-captures btn btn-outline-success '])[1]";
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportoncosolidatedretainvideopage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card retain employee
        await this.page.locator(this.retainentitycardLocator).click();
         await this.page.locator(this.videotab).click();

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

module.exports = { ExportReportConsolidatedRetainVideo };