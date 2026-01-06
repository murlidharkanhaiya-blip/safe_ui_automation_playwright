class ExportReportTopFiveFailed {
    constructor(page) {
        this.page = page;

        // Locators
        this.topFailureCard = "div.block-container.face-detection-box";
        this.failureList = "div.top-unsuccessful-list div"; // all list items inside
        this.exporticon = "(//button[@data-testid='export-report'])[1]";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportontopfivefailedpage() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Scroll to "Top Face Detection Failures" section
        const card = this.page.locator(this.topFailureCard);
        await card.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000); // wait for any animation

        // Step 2: Collect list items
        const failureItems = this.page.locator(this.failureList);
        const count = await failureItems.count();

        if (count === 0) {
            throw new Error("❌ No top face detection failure entries found.");
        }

        // Step 3: Pick a random one
        const randomIndex = Math.floor(Math.random() * count);
        const selectedItem = failureItems.nth(randomIndex);
        const name = await selectedItem.innerText();
        console.log(`ℹ️ Clicking on random failure item: ${name}`);
        await selectedItem.click();

        // Step 4: Click Export > CSV
        await this.page.locator(this.exporticon).click();
        await this.page.locator(this.csvbutton).click();

        // Step 5: Wait for success toast
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        // Step 6: Screenshot
        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportTopFiveFailed };