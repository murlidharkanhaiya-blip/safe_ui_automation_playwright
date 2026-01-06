const { expect } = require('@playwright/test');

class ExportReportOnDemandMediaAudio {
    constructor(page) {
        this.page = page;

        // Generic card locator by text
        this.cardTitleText = 'On Demand Media';

        

        // Updated Completed tab selector
        this.completedCardSelector = 'div.status:has-text("Completed")';
        // image tab locator
        this.audiotab=this.page.locator("(//div[normalize-space()='Audio'])[1]");

        // ✅ Define missing locators
        this.exporticon = this.page.locator("(//button[@data-testid='export-report'])[1]");
        this.csvbutton = this.page.locator("(//a[normalize-space()='CSV'])[1]");
        this.successToast = this.page.locator("//div[contains(text(),'Report has been sent to your email.')]");
    }

    async scrollUntilCardIsVisible() {
        for (let i = 0; i < 10; i++) {
            const card = this.page.locator('div.block-container').filter({ hasText: this.cardTitleText });
            if (await card.count() > 0 && await card.first().isVisible()) {
                return card.first();
            }
            await this.page.mouse.wheel(0, 300); // scroll down
            await this.page.waitForTimeout(500);
        }
        throw new Error(`❌ On Demand Media card not found even after scrolling.`);
    }

    async verifyexportonaudioeondemandPage() {
        await this.page.waitForLoadState('networkidle');

        // ✅ Click the On Demand Media card
        const card = await this.scrollUntilCardIsVisible();
        const clickable = card.locator("div.block.hand.box-shadow");
        await clickable.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await clickable.click({ timeout: 5000 });

        // ✅ Click the Completed tab
        const completedTab = this.page.locator(this.completedCardSelector);
        console.log("⏳ Waiting for 'Completed' tab to appear...");
        await completedTab.waitFor({ state: 'attached', timeout: 10000 });
        await completedTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await completedTab.click();
        await this.audiotab.click();

        // ✅ Wait for loader if it appears
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // ✅ Wait for export button to appear and click
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

module.exports = { ExportReportOnDemandMediaAudio };