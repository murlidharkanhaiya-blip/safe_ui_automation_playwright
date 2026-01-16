
class ExportReportConsolidatedRetainImage {
    constructor(page) {
        this.page = page;

        // Locators
        this.retainEntityCard = page.locator('.dashboard-box:has-text("Retained Entities")');
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportoncosolidatedretainimagepage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card retain employee
        await this.retainEntityCard.waitFor({ state: 'visible', timeout: 30000 });
        await this.retainEntityCard.click();

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

module.exports = { ExportReportConsolidatedRetainImage };