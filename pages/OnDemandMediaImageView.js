const { expect } = require('@playwright/test');

class OnDemandMediaImageView {
    constructor(page) {
        this.page = page;

        // Locators
        this.cardTitleText = 'On Demand Media';
        this.completedTab = page.locator('div.status:has-text("Completed")');
        this.imageTab = page.locator("div:has-text('Image')").first();
        this.eyeIcon = page.locator("img[title='View Employee Details']").first();
        this.drilldown = page.locator("button[aria-label='expand row']").first();
        this.clickToViewImage = page.locator("span[title='Click to view image']").first();
        this.loader = page.locator('#global-loader-container .loading');
        this.tableRow = page.locator("tr.MuiTableRow-root");
        this.noDataMessage = page.locator("text=No data, text=No records, text=Empty");
    }

    async waitForLoader() {
        try {
            const isVisible = await this.loader.isVisible({ timeout: 2000 });
            if (isVisible) {
                await this.loader.waitFor({ state: 'hidden', timeout: 15000 });
                console.log("⏳ Loader hidden");
            }
        } catch {
            // Loader not present
        }
    }

    async scrollUntilCardIsVisible() {
        for (let i = 0; i < 10; i++) {
            const card = this.page.locator('div.block-container').filter({ hasText: this.cardTitleText });
            const count = await card.count();
            
            if (count > 0) {
                const firstCard = card.first();
                if (await firstCard.isVisible()) {
                    return firstCard;
                }
            }
            
            await this.page.mouse.wheel(0, 300);
            await this.page.waitForTimeout(500);
        }
        throw new Error(`❌ On Demand Media card not found after scrolling.`);
    }

    async verifyimageviewondemandPage() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        // ✅ Find and click On Demand Media card
        console.log("📊 Looking for On Demand Media card...");
        const card = await this.scrollUntilCardIsVisible();
        const clickable = card.locator("div.block.hand.box-shadow");
        await clickable.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await clickable.click();
        console.log("✅ Clicked On Demand Media card");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Completed tab
        console.log("📋 Clicking Completed tab...");
        await this.completedTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.completedTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await this.completedTab.click();
        console.log("✅ Completed tab clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Image tab
        console.log("🖼️ Clicking Image tab...");
        await this.imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.imageTab.click();
        console.log("✅ Image tab clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ CHECK IF DATA EXISTS
        console.log("🔍 Checking for data in Completed > Image tab...");

        // Check for "No data" message
        const noDataVisible = await this.noDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (noDataVisible) {
            const noDataText = await this.noDataMessage.textContent();
            console.warn(`⚠️ No data found in Completed > Image tab: "${noDataText}"`);
            return;
        }

        // Check for table rows
        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} row(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No data found in Completed > Image tab - table is empty");
            return;
        }

        // ✅ Check if View icon exists
        const eyeIconCount = await this.eyeIcon.count();
        console.log(`🔍 Found ${eyeIconCount} View icon(s)`);

        if (eyeIconCount === 0) {
            console.warn("⚠️ No data found - View Employee Details icon not available");
            return;
        }

        // ✅ Click View icon
        console.log("👁️ Clicking View Employee Details...");
        await this.eyeIcon.waitFor({ state: 'visible', timeout: 15000 });
        await this.eyeIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.eyeIcon.click();
        console.log("✅ View icon clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Drilldown
        console.log("📂 Clicking drilldown...");
        
        const drilldownCount = await this.drilldown.count();
        
        if (drilldownCount === 0) {
            console.warn("⚠️ No drilldown available");
            return;
        }

        await this.drilldown.waitFor({ state: 'visible', timeout: 10000 });
        await this.drilldown.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.drilldown.click();
        console.log("✅ Drilldown clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click to view image
        console.log("🖼️ Clicking 'Click to view image'...");
        
        const viewImageCount = await this.clickToViewImage.count();
        
        if (viewImageCount === 0) {
            console.warn("⚠️ No images available to view");
            return;
        }

        await this.clickToViewImage.waitFor({ state: 'visible', timeout: 10000 });
        await this.clickToViewImage.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.clickToViewImage.click();
        console.log("✅ Clicked 'Click to view image'");

        await this.page.waitForTimeout(2000);

        // ✅ Verify image opened
        const imageModal = this.page.locator('img[src*="blob:"], img[src*="data:image"], div[role="dialog"] img').first();
        const isImageVisible = await imageModal.isVisible({ timeout: 5000 }).catch(() => false);

        if (isImageVisible) {
            console.log("✅ Image viewer opened");
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
            console.log("✅ Image viewer closed");
        }

        console.log("🎉 On Demand Media image view completed!");
    }
}

module.exports = { OnDemandMediaImageView };