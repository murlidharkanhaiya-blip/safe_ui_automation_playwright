const { expect } = require('@playwright/test');

class UserActivateDeactivate {
    constructor(page) {
        this.page = page;

        // Locators
        this.ManageuserNavViewLocator = "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Users']//a[@data-testid='nav-link']";
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectstatus = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[1]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");
        this.deactivatuser = this.page.locator("(//img[@title='Deactivate User'])[1]");
        this.reactivateuser = this.page.locator("(//img[@title='Activate User'])[1]");

        // ✅ Confirmation button (generic)
        this.cnfbtn = this.page.locator("//button[normalize-space()='CONFIRM']");

        // ✅ Overlay (optional)
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async verifyuseractivatedeactivate() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Navigate
       const manageusernav = this.page.locator(this.ManageuserNavViewLocator);
      await manageusernav.waitFor({ state: 'visible', timeout: 15000 });
      await manageusernav.click();

        // Step 2: Filter
        await this.filterchip.click();
        await this.page.waitForTimeout(1000);

        // Step 3: Status dropdown
        await this.selectstatus.click();
        await this.page.waitForTimeout(1000);

        // Step 4: Select "Total Users"
        const totalUsersOption = this.page.locator("//a[@data-testid='search-dropdown' and @title='Total Users']");
        await totalUsersOption.waitFor({ state: 'visible', timeout: 10000 });
        await totalUsersOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // ✅ Step 5: Apply
        console.log("⏳ Waiting for Apply button...");
        await this.applybtn.waitFor({ state: 'attached', timeout: 15000 });
        await this.applybtn.scrollIntoViewIfNeeded();
        await expect(this.applybtn).toBeVisible({ timeout: 10000 });
        try {
            await this.applybtn.click({ timeout: 5000 });
        } catch {
            await this.page.evaluate((btn) => btn.click(), await this.applybtn.elementHandle());
        }
        console.log("✅ Apply button clicked successfully.");
        await this.page.waitForTimeout(3000);

        // ✅ Step 6: Deactivate user
        console.log("⏳ Deactivating user...");
        await this.deactivatuser.waitFor({ state: 'visible', timeout: 15000 });
        await this.deactivatuser.click({ force: true });

        // ✅ Step 7: Confirm deactivate
        await this.cnfbtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.cnfbtn.click({ force: true });
        console.log("✅ User deactivated successfully.");

        await this.page.waitForTimeout(3000);

        // ✅ Step 8: Reactivate user
        console.log("⏳ Reactivating user...");
        await this.reactivateuser.waitFor({ state: 'visible', timeout: 20000 });
        await this.reactivateuser.click({ force: true });

        // ✅ Step 9: Confirm reactivation — retry strategy
        try {
            await this.cnfbtn.waitFor({ state: 'visible', timeout: 10000 });
            await this.cnfbtn.click({ force: true });
        } catch (err) {
            console.warn("⚠️ CONFIRM button not visible immediately, retrying...");
            await this.page.waitForTimeout(3000);
            const confirmRetry = this.page.locator("//button[contains(text(),'CONFIRM')]");
            await confirmRetry.click({ force: true });
        }

        console.log("✅ User reactivated successfully!");
    }
}

module.exports = { UserActivateDeactivate };