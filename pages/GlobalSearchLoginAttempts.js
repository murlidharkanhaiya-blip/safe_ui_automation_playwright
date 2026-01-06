const { expect } = require('@playwright/test');

class GlobalSearchLoginAttempts
 {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.loginattemptsviewmore = this.page.locator("(//span[@class='view-more-link'][normalize-space()='View More'])[9]");
        this.failedtab=this.page.locator("(//div[contains(text(),'Failed Attempts')])[2]");
        this.closepopup=this.page.locator("(//img[contains(@alt,'close popup')])[1]");
        
    }

    async globalsearchloginattemptsviewmorelink() {
        const ID = '145672';
        const searchInput = this.page.locator(this.globalSearchInput);

        await searchInput.fill(ID);
        await this.page.waitForLoadState('domcontentloaded');
         await this.searchIcon.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.searchIcon.first().click();

        // Click candidate name to open the profile
        await expect(this.selectedname).toBeVisible({ timeout: 5000 });
        await this.selectedname.click();

        // Wait for "View More" link and click it
        await this.loginattemptsviewmore.waitFor({ state: 'visible', timeout: 15000 });
        await this.loginattemptsviewmore.click();

       // Wait for "failed tab" link and click it
       await this.failedtab.waitFor({ state: 'visible', timeout: 15000 });
        await this.failedtab.click();

         // Wait for "close pop up icon"  and click it
         await this.closepopup.waitFor({ state: 'visible', timeout: 15000 });
        await this.closepopup.click();
        // ✅ OR: Optional visual hold for 3 seconds (if you just want to "see" it)
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { GlobalSearchLoginAttempts };