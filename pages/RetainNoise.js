const { expect } = require('@playwright/test');

class RetainNoise {
    constructor(page) {
        this.page = page;
        this.noisecardLocator = this.page.locator("(//span[normalize-space()='Noise Detection'])[1]");
        this.noiseactionicon = this.page.locator("(//img[@title='View'])[1]");
        this.actiondot = this.page.locator("(//img[@alt='menu'])[1]");

        // Retain option inside popup
        this.retainoption = this.page.locator("//img[@alt='retain_noise' and @title='Retain']");
        this.retainnoiseconfirmation = this.page.locator("(//button[normalize-space()='PROCEED'])[1]");

        this.loaderOverlay = this.page.locator(
            "//div[contains(@class,'popup-overlay') or contains(@class,'loading')]"
        );
    }

    async waitForLoader() {
        await this.loaderOverlay.waitFor({ state: "hidden", timeout: 20000 }).catch(() => {});
    }

    async retainnoisecard() {
        await this.page.waitForLoadState('networkidle');

        // click on noise card
        await this.noisecardLocator.click();
        await this.waitForLoader();

        // click on noise action
        await this.noiseactionicon.click();
        await this.waitForLoader();

        // click on 3-dot action icon
        await this.actiondot.click();
        await this.waitForLoader();

        // small wait for popup animation
        await this.page.waitForTimeout(500);

        // now click retain button
        await expect(this.retainoption).toBeVisible({ timeout: 10000 });
        await expect(this.retainoption).toBeEnabled();
        await this.retainoption.scrollIntoViewIfNeeded();
        await this.retainoption.click();

        // wait loader after retain
        await this.waitForLoader();

        // confirm proceed button
        await expect(this.retainnoiseconfirmation).toBeVisible({ timeout: 20000 });
        await expect(this.retainnoiseconfirmation).toBeEnabled();
        await this.retainnoiseconfirmation.click();
    }
}

module.exports = { RetainNoise };
