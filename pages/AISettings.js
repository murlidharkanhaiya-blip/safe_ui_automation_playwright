const { expect } = require('@playwright/test');

class AISettings {
  constructor(page) {
    this.page = page;

   this.sidebar = this.page.locator(".fixed-left-sidebar").first();

// Settings icon (inside correct container)
this.settingsIcon = this.page
    .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
    .first();

      // Tabs & Inputs
this.utalitysettings = "(//span[normalize-space()='Utility Settings'])[1]";

this.aiSettingsTab = page.locator("//span[normalize-space()='AI Settings']/ancestor::div[@role='button']");

    /* ===== PAGE VALIDATOR ===== */
this.aiSettingsHeader = page.locator("h1:has-text('AI Settings')");

this.matchThreshold = page.locator("(//div[contains(@class,'rangeslider-horizontal')])[1]");

    this.allowQuickMatch = page.locator("(//div[@class='react-switch-bg'])[1]");
    this.allowEmotion = page.locator("(//div[@class='react-switch-bg'])[2]");
    this.allowGesture = page.locator("(//div[@class='react-switch-bg'])[3]");
    this.allowNSFW = page.locator("(//div[@class='react-switch-bg'])[4]");
    this.allowMultipleFace = page.locator("(//div[@class='react-switch-bg'])[5]");

    // Buttons
        this.savebutton = '.button-box__button.submit';
        this.confrmsnpopup = this.page.locator("(//button[normalize-space()='SAVE'])[1]");

        // Loader
        this.loader = '#global-loader-container .loading';
  }

  async scrollNavBarToBottom() {
        const navBar = this.sidebar;

        await navBar.evaluate(el => {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: 'instant'
            });
        });

        await this.page.waitForTimeout(500);
    }

   

    async clearAndFill(locator, value) {
        await locator.waitFor({ state: "visible" });
        await locator.scrollIntoViewIfNeeded();
        await locator.fill("");
        await locator.type(value.toString(), { delay: 50 });
        await this.page.waitForTimeout(150);
    }

    async clickToggle(locator) {
        await locator.waitFor({ state: "visible" });
        await locator.scrollIntoViewIfNeeded();
        await locator.click({ force: true });
        await this.page.waitForTimeout(150);
    }

    async waitForLoaderToDisappear() {
        await this.page.waitForSelector(this.loader, {
            state: "hidden",
            timeout: 30000
        });
    }
  /* ===== MAIN FLOW ===== */
  async verifyAisettings() {
     await this.page.waitForLoadState("domcontentloaded");
        await this.waitForLoaderToDisappear();

        // --- Scroll Sidebar to show settings icon ---
       await this.sidebar.waitFor({ state: 'visible', timeout: 20000 });

// Scroll sidebar container
await this.sidebar.evaluate(el => el.scrollTop = el.scrollHeight);

// Small wait for DOM repaint
await this.page.waitForTimeout(500);

// Force click settings icon
await this.settingsIcon.click({ force: true });
        // --- CLICK utality settings video capture  ---
        const utalitysettings = this.page.locator(this.utalitysettings);
        await utalitysettings.waitFor({ state: "visible", timeout: 15000 });
        await utalitysettings.scrollIntoViewIfNeeded();
        await utalitysettings.click();

        await this.waitForLoaderToDisappear();

    /* STEP 4: Click AI Settings tab */
    await this.aiSettingsTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.aiSettingsTab.click();

    /* STEP 5: Validate page */
    await expect(this.page).toHaveURL(/ai/i, { timeout: 20000 });

    //select value from dropdown 
      const businessGroupDropdown = this.page.locator(
  "(//div[contains(@class,'inputBoxDiv ellipsis')])[1]"
);

// Wait for DOM presence only
await businessGroupDropdown.waitFor({ state: 'attached', timeout: 20000 });

// Scroll into view and force click
await businessGroupDropdown.scrollIntoViewIfNeeded();
await businessGroupDropdown.click({ force: true });


// Select "Trusted Watch"
const trustedOption = this.page.locator("text=Trusted");
await trustedOption.waitFor({ state: 'attached', timeout: 10000 });
await trustedOption.click({ force: true });
await this.page.keyboard.press('Escape');
await this.page.waitForTimeout(500);

  //Match Threshold


 await this.clickToggle(this.matchThreshold);
 await this.page.waitForTimeout(500);

    await this.clickToggle(this.allowQuickMatch);
    await this.page.waitForTimeout(500);
    await this.clickToggle(this.allowEmotion);
    await this.page.waitForTimeout(500);
    await this.clickToggle(this.allowGesture);
    await this.page.waitForTimeout(500);
    await this.clickToggle(this.allowNSFW);
    await this.page.waitForTimeout(500);
    await this.clickToggle(this.allowMultipleFace);
    await this.page.waitForTimeout(500);

    /* STEP 8: Save */
   // --- WAIT FOR SAVE BUTTON TO BE ENABLED ---
        const saveButton = this.page.locator(this.savebutton);
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.waitFor({ state: "visible", timeout: 15000 });

        await this.page.waitForFunction(() => {
            const btn = document.querySelector('.button-box__button.submit');
            return btn && !btn.disabled;
        }, { timeout: 30000 });

        await saveButton.click();
        await this.waitForLoaderToDisappear();

        // --- CONFIRM POPUP ---
        await this.confrmsnpopup.waitFor({ state: "visible", timeout: 15000 });
        await this.confrmsnpopup.scrollIntoViewIfNeeded();
        await this.confrmsnpopup.click();

        await this.waitForLoaderToDisappear();
  }
}

module.exports = { AISettings };