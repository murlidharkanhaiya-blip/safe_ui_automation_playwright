class ExportReportIndiExcusedImage {
    constructor(page) {
        this.page = page;

        // Locators
      this.excusedEntityCard = this.page.locator("div.block-container.deleted-images-block").filter({ hasText: "Excused Entities" });
      this.actionicon=this.page.locator("(//img[@title='View'])[1]");
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async waitForExcusedEntitiesToLoad() {
        await this.excusedEntityCard.waitFor({ state: 'visible', timeout: 20000 });

        const cardHandle = await this.excusedEntityCard.elementHandle();

        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                const match = text.match(/Excused Entities\s*(\d+)/);
                return match && parseInt(match[1], 10) > 0;
            },
            cardHandle,
            { timeout: 20000 }
        );
    }

    async verifyexportreportonexcusedindiimagepage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card excused image card 
       await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        await this.waitForExcusedEntitiesToLoad();
        await this.excusedEntityCard.scrollIntoViewIfNeeded();
        await this.excusedEntityCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.excusedEntityCard.click();

        // click on action icon 
        await this.actionicon.waitFor({ state: 'visible', timeout: 5000 });
        await this.actionicon.click();

       

        

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

module.exports = { ExportReportIndiExcusedImage };