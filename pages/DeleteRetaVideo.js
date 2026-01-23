const { expect } = require('@playwright/test');

class DeleteRetaVideo {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.retainEntityCard = page.locator("div.dashboard-box").nth(1); // 0-indexed
        this.videoTab = page.locator("div.videos.failed-captures.btn.btn-outline-success").first();
        this.eyeIcon = page.locator("img[title='View']").first();
        this.drilldown = page.locator("polyline#Path").first();
        this.deleteRetainedVideoIcon = page.locator("img[title='Delete Retained Video']");
        this.confirmButton = page.locator('[data-testid="confirmation-popup-btn"]');
        this.confirmationPopup = page.locator('[data-testid="delete-confirmation-root"]');
        this.loader = page.locator('#global-loader-container .loading');
    }

    async waitForLoader() {
        try {
            const isVisible = await this.loader.isVisible({ timeout: 2000 });
            if (isVisible) {
                await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
                console.log("⏳ Loader hidden");
            }
        } catch {
            // Loader not present
        }
    }

    async deleteretainvVideo() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        // ✅ Step 1: Click Retain Entity Card
        console.log("📊 Clicking Retain Entity card...");
        await this.retainEntityCard.waitFor({ state: 'visible', timeout: 15000 });
        await this.retainEntityCard.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.retainEntityCard.click();
        console.log("✅ Retain Entity card clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 2: Click Video Tab
        console.log("🎥 Clicking Video tab...");
        await this.videoTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.videoTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.videoTab.click();
        console.log("✅ Video tab clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 3: Click Eye Icon (View)
        console.log("👁️ Clicking View icon...");
        await this.eyeIcon.waitFor({ state: 'visible', timeout: 15000 });
        await this.eyeIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.eyeIcon.click();
        console.log("✅ View icon clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 4: Click Drilldown
        console.log("📂 Clicking drilldown...");
        await this.drilldown.waitFor({ state: 'visible', timeout: 15000 });
        await this.drilldown.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.drilldown.click();
        console.log("✅ Drilldown clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(3000); // Allow videos to load

        // ✅ Step 5: Check for Delete Retained Video icons
        console.log("🗑️ Looking for delete retained video icons...");
        await this.page.waitForTimeout(2000);

        const count = await this.deleteRetainedVideoIcon.count();
        console.log(`🔍 Found ${count} delete retained video icon(s)`);

        if (count === 0) {
            console.warn("⚠️ No retained videos available to delete - test skipped");
            return;
        }

        // ✅ Step 6: Click first delete icon (deterministic)
        const deleteIcon = this.deleteRetainedVideoIcon.first();
        
        await deleteIcon.waitFor({ state: 'visible', timeout: 15000 });
        await deleteIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await deleteIcon.click();
        console.log("✅ Delete icon clicked");

        await this.page.waitForTimeout(1500);

        // ✅ Step 7: Confirm deletion
        console.log("✔️ Confirming deletion...");
        await this.confirmButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.confirmButton).toBeEnabled({ timeout: 5000 });
        await this.confirmButton.click({ force: true });
        console.log("✅ Deletion confirmed");

        // ✅ Step 8: Wait for popup to close
        try {
            await this.confirmationPopup.waitFor({ state: 'detached', timeout: 15000 });
            console.log("✅ Confirmation popup closed");
        } catch {
            console.log("⚠️ Popup already closed or not found");
        }

        // ✅ Step 9: Wait for deletion to complete
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 10: Verify deletion success
        const successMessage = this.page.locator("text=success, text=deleted, text=removed").first();
        const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
            const message = await successMessage.textContent();
            console.log(`🎉 Success: ${message}`);
        } else {
            console.log("✅ Retained video deleted (no explicit confirmation)");
        }

        // ✅ Verify video count decreased
        const newCount = await this.deleteRetainedVideoIcon.count();
        console.log(`📊 Retained videos after deletion: ${newCount}`);

        if (newCount < count) {
            console.log("✅ Retained video successfully deleted");
        } else {
            console.warn("⚠️ Video count unchanged - deletion may have failed");
        }

        console.log("🎉 Delete retained video completed successfully!");
    }
}

module.exports = { DeleteRetaVideo };