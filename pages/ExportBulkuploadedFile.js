class ExportBulkUploadedFile {
    constructor(page) {
        this.page = page;
        this.bulkuploadNavViewLocator = "(//*[name()='svg'])[12]";
        this.downloadedfile="(//img[@title='Download File'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";

       
    }

    async verifyexportreportonbulkdownloadedfile() {
        await this.page.waitForLoadState('networkidle');

        

        // Step 1: Click bulkupload card
        await this.page.locator(this.bulkuploadNavViewLocator).click();
        await this.page.waitForTimeout(2000);
        

        // Step 2: Click download file 
        await this.page.locator(this.downloadedfile).click();
        await this.page.waitForTimeout(2000);
        // Step 3: Wait for success toast and screenshot
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportBulkUploadedFile };