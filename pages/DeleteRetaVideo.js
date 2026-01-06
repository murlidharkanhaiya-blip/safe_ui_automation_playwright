const { expect } = require('@playwright/test');

class DeleteRetaVideo {
    constructor(page) {
        this.page = page;

        // Locators
        this.retainentitycardLocator = this.page.locator("(//div[@class='dashboard-box'])[2]");
        this.videotablocator = this.page.locator("(//div[@class='videos failed-captures btn btn-outline-success '])[1]");
        this.eyeicon = this.page.locator("(//img[@title='View'])[1]");
        this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");

        // Delete confirmation button
        this.deleteBtnconfm = this.page.locator("//button[@data-testid='confirmation-popup-btn']");

        // Loader
        this.loader = this.page.locator('#global-loader-container >> .loading');
    }

    // ✅ Wait for loader to disappear
    async waitForLoader() {
        if (await this.loader.isVisible().catch(() => false)) {
            await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
        }
    }

    // ✅ Retry logic for page load
   /*
    // 🔄 Retry logic (currently commented out, not functional)
    async retryUntilPageLoaded(maxRetries = 3) {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                attempt++;
                console.log(`🔄 Attempt ${attempt} to load page...`);

                await this.page.waitForLoadState('networkidle', { timeout: 20000 });

                // Check loader
                if (await this.loader.isVisible().catch(() => false)) {
                    await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
                }

                console.log("✅ Page loaded successfully");
                return; // success
            } catch (error) {
                console.warn(`⚠️ Page load failed (attempt ${attempt}): ${error.message}`);
                if (attempt >= maxRetries) {
                    throw new Error("❌ Page did not load after multiple retries!");
                }
                await this.page.waitForTimeout(2000); // wait before retry
            }
        }
    }
    */

    // ✅ Main delete retained video flow
    async deleteretainvVideo() {
        // Step 0: Retry until page fully loads
        //await this.retryUntilPageLoaded(3);

        // Step 1: Select card + drill down
        await this.retainentitycardLocator.click();
        await this.videotablocator.click();
        await this.eyeicon.click();
        await this.drilldown.click();

        // Step 2: Pick random delete retained video
        const deleteretainvideo = this.page.locator("//img[@title='Delete Retained Video']");
        const count = await deleteretainvideo.count();
        if (count === 0) throw new Error("❌ No delete icon found!");

        const randomIndex = Math.floor(Math.random() * count);
        const randomdeleteretainvideo = deleteretainvideo.nth(randomIndex);
        await randomdeleteretainvideo.click();

        // Step 3: Wait for popup
        await this.page.waitForTimeout(1000);

        // Step 1: Wait for confirm button to be visible
    const confirmBtn = this.page.locator('[data-testid="confirmation-popup-btn"]');
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });

    // Step 2: Click on CONFIRM button
    await confirmBtn.click({ force: true });

    // Step 3: Wait for confirmation popup to disappear
    await this.page.locator('[data-testid="delete-confirmation-root"]').waitFor({ state: 'detached', timeout: 15000 });

    // Step 4: Wait for loader (if any)
    await this.waitForLoader();
       // await this.waitForLoader();

        console.log("✅ Retained video deleted successfully");
    }
}

module.exports = { DeleteRetaVideo };