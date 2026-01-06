class ExportReportAutoSyncUtility {
    constructor(page) {
        this.page = page;

        // Locators
        this.utilitystats = "(//span[normalize-space()='Utility Stats'])[1]";
        this.exporticon = "//button[@class='btn download-icon btn-spacing export-as  ']";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.autosyncwatcherTablocator="(//div[normalize-space()='Auto Sync Tool/Watcher'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonfdutilitypage() {
        await this.page.waitForLoadState('networkidle');

       //Click on urility stats nav icon
       await this.page.locator(this.utilitystats).click();
       //Click on autosync watcher tab
    await this.page.locator(this.autosyncwatcherTablocator).click();

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

module.exports = { ExportReportAutoSyncUtility };