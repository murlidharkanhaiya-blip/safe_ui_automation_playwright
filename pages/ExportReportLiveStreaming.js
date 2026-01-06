class ExportReportLiveStreaming {
    constructor(page) {
        this.page = page;

        // Locators
       this.livestreamingCard = this.page.locator("div.block-container.deleted-images-block").filter({ hasText: "Live Streaming" });
      
        this.exporticon = "(//button[@type='button'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async waitForLiveStreamingToLoad() {
        await this.livestreamingCard.waitFor({ state: 'visible', timeout: 20000 });

        const cardHandle = await this.livestreamingCard.elementHandle();

        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                const match = text.match(/Live Streaming\s*(\d+)/);
                return match && parseInt(match[1], 10) > 0;
            },
            cardHandle,
            { timeout: 20000 }
        );
    }

    async verifyexportreportonlivestreamingpage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1:✅ Select card Live streaming card 
       await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        await this.waitForLiveStreamingToLoad();
        await this.livestreamingCard.scrollIntoViewIfNeeded();
        await this.livestreamingCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.livestreamingCard.click();
        
        
        // Step 2: Click   Export > CSV
        
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

module.exports = { ExportReportLiveStreaming };