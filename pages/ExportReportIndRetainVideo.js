class ExportReportIndRetainVideo {
    constructor(page) {
        this.page = page;
        this.retainentitycardLocator = "(//div[@class='dashboard-box'])[2]";

        // Locators
       this.videotab = ("//div[contains(@class,'videos') and normalize-space()='Videos']");

    this.eyeicon =
      "//div[contains(@class,'action-container')]//img | //div[contains(@class,'action-container')]//button";

    this.exporticon = "button[data-testid='export-report']";
    this.csvbutton = "a:has-text('CSV')";
    this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonexportreportindretainvideopage() {
        await this.page.waitForLoadState('networkidle');

       // Step 1: Click retain entity card
    await this.page.locator(this.retainentitycardLocator).click();

    // Step 2: Wait & click video tab
    const videotab = this.page.locator(this.videotab);
    await videotab.waitFor({ state: "visible", timeout: 15000 });
    await videotab.click();

    // Step 3: Click eye icon
    const eyeIcon = this.page.locator(this.eyeicon).first();
    await eyeIcon.waitFor({ state: "visible", timeout: 10000 });
    await eyeIcon.click();

    // Step 4: Export → CSV
    await this.page.locator(this.exporticon).click();
    await this.page.locator(this.csvbutton).click();

    // Step 5: Success toast
    const toast = this.page.locator(this.successToast);
    await toast.waitFor({ state: "visible", timeout: 15000 });

    await this.page.screenshot({ path: "export_success_toast.png", fullPage: true });
    console.log("✅ Export success message appeared and screenshot taken.");
 
    }
}

module.exports = { ExportReportIndRetainVideo };