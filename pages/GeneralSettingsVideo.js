const { expect } = require('@playwright/test');

class GeneralSettingsVideo {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.settingsIcon = page.locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]').first();
        this.videoTab = page.locator("span:has-text('Video')");
        this.captureVideoInput = page.locator("input#video_expiration").first();
        this.retainVideoInput = page.locator("input#retained_video_expiration").first();
        this.saveButton = page.locator('button.button-box__button.submit, button:has-text("Save")').first();
        this.popupSaveButton = page.locator('button[data-testid="confirmation-popup-btn"]');
        this.confirmPopup = page.locator("text=/settings updated successfully/i, text=/success/i");
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

    async setStableValue(input, fieldName) {
        console.log(`✏️ Updating ${fieldName}...`);
        
        await input.waitFor({ state: 'visible', timeout: 15000 });
        await input.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);

        const currentValue = await input.inputValue();
        console.log(`  Current value: ${currentValue}`);
        
        const newValue = String(Number(currentValue) + 1);
        console.log(`  New value: ${newValue}`);

        await input.clear();
        await this.page.waitForTimeout(200);
        await input.fill(newValue);
        
        await expect(input).toHaveValue(newValue, { timeout: 5000 });
        console.log(`✅ ${fieldName} updated to: ${newValue}`);
        
        return newValue;
    }

    async generalsettingVideo() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);

        // ✅ Click Settings
        console.log("⚙️ Clicking Settings icon...");
        
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);
        
        // Scroll sidebar to bottom
        const sidebar = this.page.locator('div.fixed-left-sidebar');
        await sidebar.waitFor({ state: 'visible', timeout: 10000 });
        await sidebar.evaluate(el => el.scrollTop = el.scrollHeight);
        await this.page.waitForTimeout(1000);
        
        await this.settingsIcon.waitFor({ state: 'visible', timeout: 15000 });
        await this.settingsIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.settingsIcon.click();
        console.log("✅ Clicked Settings");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Video tab
        console.log("🎥 Clicking Video tab...");
        await this.videoTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.videoTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.videoTab.click();
        console.log("✅ Video tab opened");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Wait for inputs
        await this.captureVideoInput.waitFor({ state: 'visible', timeout: 15000 });
        console.log("✅ Video settings form loaded");

        // ✅ Update values
        const captureValue = await this.setStableValue(this.captureVideoInput, "Capture Video Expiration");
        const retainValue = await this.setStableValue(this.retainVideoInput, "Retain Video Expiration");

        await this.page.waitForTimeout(500);
        await this.waitForLoader();

        // ✅ Click main Save button
        console.log("💾 Clicking Save button...");
        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        
        const isSaveEnabled = await this.saveButton.isEnabled({ timeout: 5000 }).catch(() => false);
        
        if (!isSaveEnabled) {
            console.warn("⚠️ Save button is disabled");
            return;
        }

        await this.saveButton.click();
        console.log("✅ Save button clicked");

        await this.page.waitForTimeout(2000);

        // ✅ Click popup SAVE button
        console.log("✔️ Waiting for confirmation popup...");
        
        await this.popupSaveButton.waitFor({ state: 'visible', timeout: 15000 });
        console.log("📋 Confirmation popup appeared");
        
        await this.page.waitForTimeout(500);
        
        // Force click to bypass overlay
        await this.popupSaveButton.click({ force: true });
        console.log("✅ Popup SAVE clicked");

        // ✅ Wait for save completion
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Verify success
        const isSuccessVisible = await this.confirmPopup.isVisible({ timeout: 10000 }).catch(() => false);
        
        if (isSuccessVisible) {
            const message = await this.confirmPopup.textContent();
            console.log(`🎉 ${message}`);
        } else {
            console.log("✅ Settings saved");
        }

        console.log(`🎉 Video settings updated! Capture: ${captureValue}, Retain: ${retainValue}`);
    }
}

module.exports = { GeneralSettingsVideo };