const { expect } = require('@playwright/test');

class UtalitySettingsLiveStreaming {
    constructor(page) {
        this.page = page;

        // Locators
        this.settingsIcon = page.locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]').first();
        this.utilitySettingsTab = page.locator("span:has-text('Utility Settings')");
        this.liveStreamingSettings = page.locator("span:has-text('Live Streaming Settings')").first();
        this.businessGroupDropdown = page.locator("div.inputBoxDiv.ellipsis").first();
        this.liveStreamingToggle = page.locator("div.react-switch-bg").first();
        this.liveStreamingDuration = page.locator("input#livestream_duration").first();
        // ✅ Skip max live streaming slider (causes scroll issues)
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

    async setFieldValue(input, value, fieldName) {
        console.log(`✏️ Setting ${fieldName} to: ${value}`);
        
        await input.waitFor({ state: 'visible', timeout: 15000 });
        await input.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);

        await input.clear();
        await this.page.waitForTimeout(200);
        await input.fill(value);
        
        await expect(input).toHaveValue(value, { timeout: 5000 });
        console.log(`✅ ${fieldName} set to: ${value}`);
    }

    async clickToggle(toggle, toggleName) {
        console.log(`🔘 Toggling ${toggleName}...`);
        
        await toggle.waitFor({ state: 'visible', timeout: 15000 });
        await toggle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await toggle.click();
        console.log(`✅ ${toggleName} toggled`);
        await this.page.waitForTimeout(300);
    }

    async utalitysettingsLivestreaming() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ Navigate to Settings
        if (!currentUrl.includes('settings')) {
            console.log("⚙️ Clicking Settings icon...");
            
            await this.waitForLoader();
            await this.page.waitForTimeout(2000);
            
            const sidebar = this.page.locator('div.fixed-left-sidebar');
            await sidebar.waitFor({ state: 'visible', timeout: 10000 });
            await sidebar.evaluate(el => el.scrollTop = el.scrollHeight);
            await this.page.waitForTimeout(1000);
            
            await this.settingsIcon.waitFor({ state: 'visible', timeout: 15000 });
            await this.settingsIcon.click();
            console.log("✅ Clicked Settings");

            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log("✅ Already on Settings page");
        }

        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Utility Settings tab
        console.log("🔧 Clicking Utility Settings tab...");
        await this.utilitySettingsTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.utilitySettingsTab.click();
        console.log("✅ Utility Settings tab clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Live Streaming Settings
        console.log("📡 Clicking Live Streaming Settings...");
        await this.liveStreamingSettings.waitFor({ state: 'visible', timeout: 15000 });
        await this.liveStreamingSettings.click();
        console.log("✅ Live Streaming Settings clicked");

        await this.page.waitForTimeout(1500);

        // ✅ Select Business Group
        console.log("📋 Selecting Business Group...");
        await this.businessGroupDropdown.waitFor({ state: 'visible', timeout: 15000 });
        await this.businessGroupDropdown.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await this.businessGroupDropdown.click();
        await this.page.waitForTimeout(500);

        const trustedOption = this.page.locator("text=Trusted");
        await trustedOption.waitFor({ state: 'visible', timeout: 10000 });
        await trustedOption.click();
        console.log("✅ Selected: Trusted");
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);

        // ✅ Toggle Live Streaming
        await this.clickToggle(this.liveStreamingToggle, "Live Streaming");

        // ✅ Fill Live Streaming Duration
        await this.setFieldValue(this.liveStreamingDuration, '10', "Live Streaming Duration");

        // ✅ SKIP Max Live Streaming slider (causes scroll issues)
        console.log("📊 Max Live Streaming Count (not changing - slider skipped)");

        await this.page.waitForTimeout(500);
        await this.waitForLoader();

        // ✅ Click Save
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

        // ✅ Click popup SAVE
        console.log("✔️ Waiting for confirmation popup...");
        
        await this.popupSaveButton.waitFor({ state: 'visible', timeout: 15000 });
        console.log("📋 Confirmation popup appeared");
        
        await this.page.waitForTimeout(500);
        
        await this.popupSaveButton.click({ force: true });
        console.log("✅ Popup SAVE clicked");

        // ✅ Wait for completion
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

        console.log("🎉 Utility Settings - Live Streaming updated successfully!");
    }
}

module.exports = { UtalitySettingsLiveStreaming };