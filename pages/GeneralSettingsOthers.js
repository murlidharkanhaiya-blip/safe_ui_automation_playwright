const { expect } = require('@playwright/test');

class GeneralSettingsOthers {
    constructor(page) {
        this.page = page;

        // Scrollable sidebar container
this.sidebar = this.page.locator(".fixed-left-sidebar").first();

// Settings icon (inside correct container)
this.settingsIcon = this.page
    .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
    .first();

        // Tabs & Inputs
        this.othertab = "(//span[normalize-space()='Other'])[1]";
        this.calendarexpirationdaterangeinput = this.page.locator("(//input[@id='calendar_date'])[1]");
        this.workdayintegrationtoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]");
        //this.shiftmanagementtoggle = this.page.locator("(//div[@class='react-switch-bg'])[2]");
        this.trackemployeelocationtoggle = this.page.locator("(//div[@class='react-switch-bg'])[3]");
        this.autorefreshtoggle = this.page.locator("(//div[@class='react-switch-bg'])[4]");
        this.bulkuploadlimit = this.page.locator("(//input[@id='bulk_onboard_record_limit'])[1]");

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

    

    async generalsettingOthers() {

        await this.page.waitForLoadState("domcontentloaded");
        await this.waitForLoaderToDisappear();

        // --- Scroll Sidebar to show settings icon ---
        await this.scrollNavBarToBottom();

        // --- CLICK SETTINGS ICON ---
        await this.settingsIcon.waitFor({ state: "visible", timeout: 15000 });
        await this.settingsIcon.scrollIntoViewIfNeeded();
        await this.settingsIcon.click();

        // --- CLICK OTHER TAB ---
        const othertab = this.page.locator(this.othertab);
        await othertab.waitFor({ state: "visible", timeout: 15000 });
        await othertab.scrollIntoViewIfNeeded();
        await othertab.click();

        await this.waitForLoaderToDisappear();

        // --- FILL FORM VALUES ---
        await this.clearAndFill(this.calendarexpirationdaterangeinput, "20");

        await this.clickToggle(this.workdayintegrationtoggle);
       // await this.clickToggle(this.shiftmanagementtoggle);
        await this.clickToggle(this.trackemployeelocationtoggle);
        await this.clickToggle(this.autorefreshtoggle);

        await this.clearAndFill(this.bulkuploadlimit, "500");

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

module.exports = { GeneralSettingsOthers };