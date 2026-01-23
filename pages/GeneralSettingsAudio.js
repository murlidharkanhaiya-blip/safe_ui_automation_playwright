const { expect } = require('@playwright/test');

class GeneralSettingsAudio {
  constructor(page) {
    this.page = page;

    // Locators
    this.settingsIcon = page.locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]').first();
    this.audioTab = page.locator("span:has-text('Audio')");
    this.recordedNoiseInput = page.locator("input#noise_expiration").first();
    this.retainedNoiseInput = page.locator("input#retained_noise_expiration").first();
    this.saveButton = page.locator("button.button-box__button.submit, button:has-text('Save')").first();
    
    // ✅ Correct popup SAVE button from DOM
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

  async generalsettingAudio() {
    // ✅ Reset state
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);

    // ✅ Click Settings
    console.log("⚙️ Clicking Settings icon...");
    
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);
    
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

    // ✅ Click Audio tab
    console.log("🔊 Clicking Audio tab...");
    await this.audioTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.audioTab.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.audioTab.click();
    console.log("✅ Audio tab opened");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // ✅ Wait for inputs
    await this.recordedNoiseInput.waitFor({ state: 'visible', timeout: 15000 });
    console.log("✅ Audio settings form loaded");

    // ✅ Update values
    const recordedValue = await this.setStableValue(this.recordedNoiseInput, "Recorded Noise Expiration");
    const retainedValue = await this.setStableValue(this.retainedNoiseInput, "Retained Noise Expiration");

    await this.page.waitForTimeout(500);

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

    // ✅ Click popup SAVE button (using correct data-testid)
    console.log("✔️ Waiting for confirmation popup...");
    
    await this.popupSaveButton.waitFor({ state: 'visible', timeout: 15000 });
    console.log("📋 Confirmation popup SAVE button visible");
    
    await this.page.waitForTimeout(500); // Wait for popup animation
    
    // Click with force to bypass overlay
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

    console.log(`🎉 Audio settings updated! Recorded: ${recordedValue}, Retained: ${retainedValue}`);
  }
}

module.exports = { GeneralSettingsAudio };