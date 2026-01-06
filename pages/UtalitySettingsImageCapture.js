const { expect } = require('@playwright/test');

class UtalitySettingsImageCapture {
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
       this.imagecapturesettings = this.page.locator("(//span[normalize-space()='Image Capture Settings'])[1]");
        this.imagecapturefrequency = this.page.locator("(//div[@class='rangeslider__fill'])[1]");
        this.capturewaitduration=this.page.locator("(//input[@id='picture_time_capture'])[1]")
        this.suspiciouscaptureinterval = this.page.locator("(//input[@id='suspicious_capture_interval'])[1]");
        this.imageondemandtoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]");
        this.alloscreenlocktoggle = this.page.locator("(//div[@class='react-switch-bg'])[2]");
       

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

        await this.page.waitForTimeout(500); // allow layout update
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

    

    async utalitysettingsImagecapture() {

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
        // --- CLICK utality settings image capture  ---
        const utalitysettings = this.page.locator(this.utalitysettings);
        await utalitysettings.waitFor({ state: "visible", timeout: 15000 });
        await utalitysettings.scrollIntoViewIfNeeded();
        await utalitysettings.click();

        await this.waitForLoaderToDisappear();

       await this.imagecapturesettings.waitFor({ state: 'visible', timeout: 15000 });

       await this.imagecapturesettings.click();

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
const intensiveWatchOption = this.page.locator("text=Intensive Watch");
await intensiveWatchOption.waitFor({ state: 'attached', timeout: 10000 });
await intensiveWatchOption.click({ force: true });
await this.page.keyboard.press('Escape');
await this.page.waitForTimeout(300);


// image capture frequency
await this.imagecapturefrequency.scrollIntoViewIfNeeded();
await this.imagecapturefrequency.click({ force: true });
await this.page.waitForTimeout(500);

        // --- FILL FORM VALUES ---
        await this.clearAndFill(this.capturewaitduration, "15");
        await this.clearAndFill(this.suspiciouscaptureinterval, "110");


        await this.clickToggle(this.imageondemandtoggle);
        await this.clickToggle(this.alloscreenlocktoggle);
        

       

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

module.exports = { UtalitySettingsImageCapture };