const { expect } = require('@playwright/test');

class UtalitySettingsVideoRecording {
    constructor(page) {
        this.page = page;

        // Scrollable sidebar container
this.sidebar = this.page.locator(".fixed-left-sidebar").first();

// Settings icon (inside correct container)
this.settingsIcon = this.page
    .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
    .first();

     //this.settingIcon = "(//*[name()='svg'])[19]";

        // Tabs & Inputs
        this.utalitysettings = "(//span[normalize-space()='Utility Settings'])[1]";
        this.videocapturesettings = this.page.locator("(//span[normalize-space()='Video Recording Settings'])[1]");
        this.videorecordingtoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]");
        this.videoclipcountduration=this.page.locator("(//input[@id='video_duration'])[1]")
        this.maxvideocount = this.page.locator("(//div[@class='rangeslider__fill'])[1]");

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

    

    async utalitysettingsVideocapture() {

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

       await this.videocapturesettings.waitFor({ state: 'visible', timeout: 15000 });

       await this.videocapturesettings.click();

        //select value from dropdown 
      const businessGroupDropdown = this.page.locator(
  "(//div[contains(@class,'inputBoxDiv ellipsis')])[1]"
);

// Wait for DOM presence only
await businessGroupDropdown.waitFor({ state: 'attached', timeout: 20000 });

// Scroll into view and force click
await businessGroupDropdown.scrollIntoViewIfNeeded();
await businessGroupDropdown.click({ force: true });


// Select "Intensive Watch"
const trustedOption = this.page.locator("text=Trusted");
await trustedOption.waitFor({ state: 'attached', timeout: 10000 });
await trustedOption.click({ force: true });
await this.page.keyboard.press('Escape');
await this.page.waitForTimeout(500);

//video recording toggle
 await this.clickToggle(this.videorecordingtoggle);
 await this.page.waitForTimeout(500);

  // --- FILL FORM VALUES ---
await this.clearAndFill(this.videoclipcountduration, "10");

await this.page.waitForTimeout(500);


//Max Video Record Count

await this.maxvideocount.scrollIntoViewIfNeeded();
await this.maxvideocount.click({ force: true });
await this.page.waitForTimeout(500);

        
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

module.exports = { UtalitySettingsVideoRecording };