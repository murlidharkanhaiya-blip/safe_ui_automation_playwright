const { expect } = require('@playwright/test');

class OnDemandMediaImageView
 {
    constructor(page) {
        this.page = page;

        // Generic card locator by text
        this.cardTitleText = 'On Demand Media';

        

        // Updated Completed tab selector
        this.completedCardSelector = 'div.status:has-text("Completed")';
        // image tab locator
        this.imagetab=this.page.locator("(//div[normalize-space()='Image'])[1]");

        // ✅ action icon locator
        this.eyeicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
        this.drilldown = this.page.locator("(//button[@aria-label='expand row'])[1]");
        this.clicktoviewimage = this.page.locator("(//span[@title='Click to view image'])[1]");
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

    async verifyimageviewondemandPage() {
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
        await this.imagetab.click();

        // ✅ Wait for loader if it appears
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // ✅ Wait for eyeicon button to appear and click
        await this.eyeicon.waitFor({ state: 'visible', timeout: 15000 });
        await this.eyeicon.click();

        // ✅ Wait for drill down option to appear and click
        await this.drilldown.waitFor({ state: 'visible', timeout: 10000 });
        await this.drilldown.click();

       // view image

         await this.clicktoviewimage.waitFor({ state: 'visible', timeout: 10000 });
        await this.clicktoviewimage.click();

    }
}

module.exports = { OnDemandMediaImageView };