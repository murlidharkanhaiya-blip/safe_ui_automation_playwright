class ExportReportDeleteEntitiesVideoIndi {
    constructor(page) {
        this.page = page;

        // Fix: Select card by matching visible text somewhere inside
        this.deletedEntityCard = this.page.locator("div.block-container.deleted-images-block", {
            hasText: "Deleted Entities"
        }).first();
        this.videotab = this.page.locator("(//div[contains(@class,'videos') and contains(@class,'failed-captures')])[1]");
        this.viewicon = this.page.locator("(//img[@title='View'])[1]");
        this.exporticon = this.page.locator("(//button[@data-testid='export-report'])[1]");
        this.csvbutton = this.page.locator("(//a[normalize-space()='CSV'])[1]");
        this.successToast = this.page.locator("//div[contains(text(),'Report has been sent to your email.')]");
    }

    async verifyexportreportondeleteentitiesvideoindipage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Click on Deleted Entities card
        await this.deletedEntityCard.waitFor({ state: 'visible', timeout: 15000 });
        await this.deletedEntityCard.click();
        await this.videotab.waitFor({ state: 'visible', timeout: 10000 });
        await this.videotab.click();

        // Step 2: Wait and Click on Video Tab
        await this.viewicon.waitFor({ state: 'visible', timeout: 10000 });
        await this.viewicon.click();

        // Step 3: Export > CSV
        await this.exporticon.waitFor({ state: 'visible', timeout: 10000 });
        await this.exporticon.click();

        await this.csvbutton.waitFor({ state: 'visible', timeout: 10000 });
        await this.csvbutton.click();

        // Step 4: Wait for success toast
        await this.successToast.waitFor({ state: 'visible', timeout: 15000 });

        // Step 5: Screenshot
        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportDeleteEntitiesVideoIndi };