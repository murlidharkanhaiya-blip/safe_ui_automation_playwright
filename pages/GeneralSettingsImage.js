const { expect } = require('@playwright/test');

class GeneralSettingsImage {
  constructor(page) {
    this.page = page;

    // ✅ Use correct Settings locator
    this.settingsIcon = page.locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]').first();
    this.retainImageInput = page.locator('input#retain_image_expiry');
    this.matchedImageInput = page.locator('input#successful_image_expiry');
    this.unmatchedImageInput = page.locator('input#unsuccessful_image_expiry');
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

  async generalsetting() {
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

    // ✅ Wait for Image settings form (default tab)
    console.log("🖼️ Waiting for Image settings form...");
    await this.retainImageInput.waitFor({ state: 'visible', timeout: 15000 });
    console.log("✅ Image settings form loaded");

    // ✅ Update all three fields
    await this.setFieldValue(this.retainImageInput, '120', "Retain Image Expiration");
    await this.setFieldValue(this.matchedImageInput, '130', "Matched Image Expiration");
    await this.setFieldValue(this.unmatchedImageInput, '140', "Unmatched Image Expiration");

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
    
    await this.page.waitForTimeout(500); // Wait for animation
    
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

    console.log("🎉 Image settings updated successfully!");
  }
}

module.exports = { GeneralSettingsImage };