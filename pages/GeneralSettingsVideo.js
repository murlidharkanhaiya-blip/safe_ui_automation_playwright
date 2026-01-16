const { expect } = require('@playwright/test');

class GeneralSettingsVideo {
    constructor(page) {
        this.page = page;

        // Locators
        this.settingIcon = page.locator("(//*[name()='svg'])[19]");
       this.videotab = page.locator("(//span[normalize-space()='Video'])[1]");

       // this.videocapturetoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]"); 
        this.capturevideoexpirationinput = this.page.locator("(//input[@id='video_expiration'])[1]"); 
        this.retainvideoxpirationinput = this.page.locator("(//input[@id='retained_video_expiration'])[1]"); 
       /* Save buttons */
      this.saveButton = page.locator('.button-box__button.submit');
        this.popupSaveButton=this.page.locator("(//button[normalize-space()='SAVE'])[1]");
        /* Loader */
    this.loader = page.locator('#global-loader-container .loading');
         /* Success popup */
    this.confirmPopup = page.locator(
      'text=/settings updated successfully/i');

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


    async generalsettingVideo() {

   /* Open Settings */
    await this.settingIcon.waitFor({ state: 'visible', timeout: 20000 });
    await this.settingIcon.click();

    /* Open Audio */
    await this.videotab.waitFor({ state: 'visible', timeout: 20000 });
    await this.videotab.click();

    /* Inputs ready */
    await this.capturevideoexpirationinput.waitFor({
      state: 'visible',
      timeout: 30000,
    });
       /* Update values */
    await this.setStableValue(this.capturevideoexpirationinput);
    await this.setStableValue(this.retainvideoxpirationinput);

    /* Main Save */
    await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();

    /*  WAIT FOR POPUP SAVE  */
    await this.popupSaveButton.waitFor({
      state: 'visible',
      timeout: 20000,
    });

    await expect
      .poll(() => this.popupSaveButton.isEnabled(), { timeout: 10000 })
      .toBe(true);

    await this.popupSaveButton.scrollIntoViewIfNeeded();

    // Click with  success
    await this.popupSaveButton.click({ force: true });

    /* Final loader */
    await this.loader.waitFor({ state: 'hidden', timeout: 30000 });

    /* Confirmation */
    await this.confirmPopup.waitFor({
      state: 'visible',
      timeout: 20000,
    });
           
        };

        
        
    }


module.exports = { GeneralSettingsVideo };