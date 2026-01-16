const { expect } = require('@playwright/test');

class GeneralSettingsImage {
  constructor(page) {
    this.page = page;

    this.settingIcon = "(//*[name()='svg'])[19]";

    this.retainimageexpirationinput = page.locator('#retain_image_expiry');
    this.matchedimageexpirationinput = page.locator('#successful_image_expiry');
    this.unmatchedimageexpirationinput = page.locator('#unsuccessful_image_expiry');

    this.savebutton = page.locator('.button-box__button.submit');

    // ✅ FIXED: unique popup button
    this.confirmPopup = page.locator('[data-testid="confirmation-popup-btn"]');

    this.loader = '#global-loader-container .loading';
  }

  async clearAndFill(input, value) {
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.press('Control+A');
    await input.press('Backspace');
    await input.type(value, { delay: 50 });
    await this.page.keyboard.press('Tab'); // React blur trigger
  }

  async generalsetting() {
    await this.page.waitForLoadState('networkidle');

    const settingsIcon = this.page.locator(this.settingIcon);
    await settingsIcon.waitFor({ state: 'visible', timeout: 10000 });
    await settingsIcon.click();

    await this.clearAndFill(this.retainimageexpirationinput, '150');
    await this.clearAndFill(this.matchedimageexpirationinput, '150');
    await this.clearAndFill(this.unmatchedimageexpirationinput, '120');

    await this.page.waitForSelector(this.loader, { state: 'hidden', timeout: 15000 });

    await expect(this.savebutton).toBeEnabled({ timeout: 10000 });
    await this.savebutton.click();

    // ✅ confirmation popup
    await this.confirmPopup.waitFor({ state: 'visible', timeout: 5000 });
    await this.confirmPopup.click();
  }
}

module.exports = { GeneralSettingsImage };
