class ExportReporEmotionDeduction {
    constructor(page) {
        this.page = page;

        // Locators
        this.emotiondeductioncard = "//div[@class='block hand box-shadow']"; 
        this.exporticon = "//button[@class='btn download-icon btn-spacing export-as  ']";
        this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
        this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
    }

    async verifyexportreportonemotiondeductionpage() {
        await this.page.waitForLoadState('networkidle');

        // Wait for all cards to load and ensure visibility
        const allCards = this.page.locator(this.emotiondeductioncard);
        const count = await allCards.count();

        let clicked = false;

        for (let i = 0; i < count; i++) {
            const card = allCards.nth(i);
            const textContent = await card.textContent();

            if (textContent && textContent.includes("Emotion Detection")) {
                await card.scrollIntoViewIfNeeded();  // Scroll the card into view
                await card.click();
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            throw new Error("❌ Emotion Detection card not found or not clickable.");
        }

        await this.page.waitForTimeout(2000); // Wait for export options to appear

        // Step 2: Export CSV
        await this.page.locator(this.exporticon).click();
        await this.page.locator(this.csvbutton).click();

        // Step 3: Wait for success toast and screenshot
        const toast = this.page.locator(this.successToast);
        await toast.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReporEmotionDeduction };