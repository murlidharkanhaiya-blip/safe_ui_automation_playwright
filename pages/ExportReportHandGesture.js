const { expect } = require('@playwright/test');

class ExportReportHandGesture {
    constructor(page) {
        this.page = page;

        this.handgestureCard = this.page.locator("div.block-container:has-text('Hand gesture')");

        // 👇 Flexible export icon locator
        this.exporticon = this.page.locator("//button[normalize-space()='Export' or contains(@class, 'export')]");
        this.csvbutton = this.page.locator("//a[normalize-space()='CSV']");
        this.successToast = this.page.locator("//div[contains(text(),'Report has been sent to your email.')]");
    }

    async waitForHandGestureToLoad() {
        const maxScrollAttempts = 10;
        let found = false;

        for (let i = 0; i < maxScrollAttempts; i++) {
            const visible = await this.handgestureCard.first().isVisible().catch(() => false);
            if (visible) {
                found = true;
                break;
            }

            await this.page.mouse.wheel(0, 500);
            await this.page.waitForTimeout(800);
        }

        if (!found) {
            throw new Error("❌ Hand Gesture card not found even after scrolling.");
        }

        this.handgestureCard = this.handgestureCard.first();

        const cardHandle = await this.handgestureCard.elementHandle();
        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                return /Hand gesture\s*\d+/i.test(text);
            },
            cardHandle,
            { timeout: 15000 }
        );
    }

    async verifyexportreportonhandgesturepage() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        await this.waitForHandGestureToLoad();

        // ✅ Click on the Hand Gesture card
        await this.handgestureCard.scrollIntoViewIfNeeded();
        await this.handgestureCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.handgestureCard.hover();
        await this.page.waitForTimeout(300);
        await this.handgestureCard.click({ force: true });

        // ✅ Wait for export button to appear
        await this.exporticon.waitFor({ state: 'visible', timeout: 15000 });
        await this.exporticon.click();

        // ✅ Wait for CSV option to appear and click
        await this.csvbutton.waitFor({ state: 'visible', timeout: 10000 });
        await this.csvbutton.click();

        // ✅ Wait for success toast
        await this.successToast.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.screenshot({ path: 'export_success_toast.png', fullPage: true });
        console.log("✅ Export success message appeared and screenshot taken.");
    }
}

module.exports = { ExportReportHandGesture };
