const { expect } = require('@playwright/test');

class GlobalSearchScreenLockStats
 {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.screenlockstatsviewmore = this.page.locator("(//span[@class='view-more-link'][normalize-space()='View More'])[8]");
        this.rejectedtab=this.page.locator("(//div[@data-testid='tab-label'][normalize-space()='Rejected'])[1]");
        this.noactiontab=this.page.locator("(//div[contains(@data-testid,'tab-label')][normalize-space()='No Action'])[1]");
        this.closepopup=this.page.locator("(//img[contains(@alt,'close popup')])[1]");
        
    }

    async globalsearchscreenlockstatsviewmorelink() {
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
        await this.screenlockstatsviewmore.waitFor({ state: 'visible', timeout: 15000 });
        await this.screenlockstatsviewmore.click();

       // Wait for "rejected tab" link and click it
       await this.rejectedtab.waitFor({ state: 'visible', timeout: 15000 });
        await this.rejectedtab.click();

         // Wait for "no action tab"  and click it

       await this.noactiontab.waitFor({ state: 'visible', timeout: 15000 });
        await this.noactiontab.click();

         // Wait for "close pop up icon"  and click it
         await this.closepopup.waitFor({ state: 'visible', timeout: 15000 });
        await this.closepopup.click();
        // ✅ OR: Optional visual hold for 3 seconds (if you just want to "see" it)
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { GlobalSearchScreenLockStats };