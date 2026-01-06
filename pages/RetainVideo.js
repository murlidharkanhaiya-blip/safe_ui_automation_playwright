const { expect } = require('@playwright/test');

class RetainVideo {
    constructor(page) {
        this.page = page;

        // Generic card locator by text
        this.cardTitleText = 'On Demand Media';

        // Updated Completed tab selector
        this.completedCardSelector = 'div.status:has-text("Completed")';

        //action icon locator
        this.actionicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
        //retain all video
        this.retainall = this.page.locator("(//img[@title='Retain All Videos'])[1]");
        //retain confirmation
         this.retainallconfirmation = this.page.locator("(//button[normalize-space()='RETAIN ALL'])[1]");

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

    async verifyretainonvideoondemandPage() {
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
        console.log("✅ Clicked on 'Completed' tab.");

        // ✅ Wait for loader if it appears
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });

        }

        // ✅ Wait for action button to appear and click
        await this.actionicon.waitFor({ state: 'visible', timeout: 15000 });
        await this.actionicon.click();

        // ✅ Wait for retain all icon to appear and click
        await this.retainall.waitFor({ state: 'visible', timeout: 10000 });
        await this.retainall.click();

        // ✅ Wait for retain all confirm button 
        await this.retainallconfirmation.waitFor({ state: 'visible', timeout: 15000 });
         await this.retainallconfirmation.click();
        
    }
}

module.exports = { RetainVideo };