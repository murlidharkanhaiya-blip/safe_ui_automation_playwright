const { expect } = require('@playwright/test');

class GeneralSettingsAudio {
    constructor(page) {
        this.page = page;

        // Locators
        this.settingIcon = "(//*[name()='svg'])[19]";
        this.audiotab="(//span[normalize-space()='Audio'])[1]";

        this.audiocapturetoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]"); 
        this.recordednoiseexpirationinput = this.page.locator("(//input[@id='noise_expiration'])[1]"); 
        this.retainnoiseexpirationinput = this.page.locator("(//input[@id='retained_noise_expiration'])[1]"); 
        this.savebutton = '.button-box__button.submit';
        this.confrmsnpopup=this.page.locator("(//button[normalize-space()='SAVE'])[1]");
        this.loader = '#global-loader-container .loading'; // loader blocking clicks

    }
       async clearAndFill(inputLocator, value) {
    await inputLocator.waitFor({ state: 'visible', timeout: 10000 });
    await inputLocator.fill('');          // React-friendly clear
    await inputLocator.fill(value);       // React-friendly set


        
    }

    async generalsettingAudio() {

         await this.page.waitForLoadState('networkidle');

         
        // Step 1: Click the settings icon
        const settingsIcon = this.page.locator(this.settingIcon);
        await settingsIcon.waitFor({ state: 'visible', timeout: 10000 });
        await settingsIcon.click();

        const audiotab = this.page.locator(this.audiotab);
        await audiotab.waitFor({ state: 'visible', timeout: 10000 });
        await audiotab.click();
       //Step 2: enable/disable audio capture toggle

        await this.page.waitForTimeout(500);
        await this.audiocapturetoggle.click();
        await this.page.waitForTimeout(500);

        // Step 3: Clear and fill all fields manually
       await this.clearAndFill(this.recordednoiseexpirationinput, '20');
        await this.page.waitForTimeout(500);
       await this.clearAndFill(this.retainnoiseexpirationinput, '25');
        await this.page.waitForTimeout(500);

      // Step 4: Wait for loader to disappear
        await this.page.waitForSelector(this.loader, { state: 'hidden', timeout: 15000 });

        // Step 5: Wait for save button to be enabled and click
        const saveButton = this.page.locator(this.savebutton);
        await saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(saveButton).toBeEnabled({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(500);
      
         // Step 6: Wait for confrmsn popup  button to be enabled and click

        await this.confrmsnpopup.click();
        await this.page.waitForTimeout(500);

           
        };

        
    }


module.exports = { GeneralSettingsAudio };