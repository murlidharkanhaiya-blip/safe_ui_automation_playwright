class ExportReportTotalUniqueLoginIndiSuccess {
    constructor(page) {
        this.page = page;

        // Locators
        this.totaluniquecardLocator = "div.recharts-wrapper";
        this.vieweye="(//img[@title='View Employee Details'])[1]";
        this.successtab="(//div[@class='success-captures btn btn-outline-success'])[1]";
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportontotaluniqueloginindisuccesspage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card uniquely using visible text
        const card = this.page.locator('div.recharts-wrapper').filter({ hasText: 'Total Unique Login' });
        await card.first().scrollIntoViewIfNeeded();
        await card.first().click();

        // Step 2: Click  action icon and Export > CSV
        await  this.page.locator(this.vieweye).click();
        await  this.page.locator(this.successtab).click();
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

module.exports = { ExportReportTotalUniqueLoginIndiSuccess };