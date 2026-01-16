const { expect } = require('@playwright/test');

class GeneralSettingsAudio {
  constructor(page) {
    this.page = page;

    /* Navigation */
    this.settingIcon = page.locator("(//*[name()='svg'])[19]");
    this.audioTab = page.locator("//span[normalize-space()='Audio']");

    /* Inputs */
    this.recordedNoiseExpirationInput =
      page.locator("(//input[@id='noise_expiration'])[1]");
    this.retainedNoiseExpirationInput =
      page.locator("(//input[@id='retained_noise_expiration'])[1]");

    /* Save buttons */
    this.saveButton = page.locator('.button-box__button.submit');

    //  REAL popup SAVE button (NO dialog role)
    this.popupSaveButton = page.locator(
      "(//button[normalize-space()='SAVE'])[1]"
    );

    /* Loader */
    this.loader = page.locator('#global-loader-container .loading');

    /* Success popup */
    this.confirmPopup = page.locator(
      'text=/settings updated successfully/i'
    );
  }

  async setStableValue(input) {
    await input.waitFor({ state: 'visible', timeout: 30000 });
    await input.scrollIntoViewIfNeeded();

    const currentValue = await input.inputValue();
    const newValue = String(Number(currentValue) + 1);

    await input.click({ clickCount: 3 });
    await input.fill('');
    await input.type(newValue, { delay: 100 });
    await input.evaluate(el => el.blur());

    await expect
      .poll(() => input.inputValue(), { timeout: 15000 })
      .toBe(newValue);
  }

  async generalsettingAudio() {
    /* Open Settings */
    await this.settingIcon.waitFor({ state: 'visible', timeout: 20000 });
    await this.settingIcon.click();

    /* Open Audio */
    await this.audioTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.audioTab.click();

    /* Inputs ready */
    await this.recordedNoiseExpirationInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });

    /* Update values */
    await this.setStableValue(this.recordedNoiseExpirationInput);
    await this.setStableValue(this.retainedNoiseExpirationInput);

    /* Main Save */
    await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();

    /* 🔥 WAIT FOR POPUP SAVE (KEY FIX) */
    await this.popupSaveButton.waitFor({
      state: 'visible',
      timeout: 20000,
    });

    await expect
      .poll(() => this.popupSaveButton.isEnabled(), { timeout: 10000 })
      .toBe(true);

    await this.popupSaveButton.scrollIntoViewIfNeeded();

    // Click with guaranteed success
    await this.popupSaveButton.click({ force: true });

    /* Final loader */
    await this.loader.waitFor({ state: 'hidden', timeout: 30000 });

    /* Confirmation */
    await this.confirmPopup.waitFor({
      state: 'visible',
      timeout: 20000,
    });
  }
}

module.exports = { GeneralSettingsAudio };
