const { expect } = require('@playwright/test');

class GlobalSearchRetainedEntity
 {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.retainentityviewmore = this.page.locator("(//span[@class='view-more-link'][normalize-space()='View More'])[10]");
        this.noisetab=this.page.locator("(//div[contains(text(),'Noise')])[2]");
        this.videotab=this.page.locator("(//div[contains(text(),'Video')])[3]");
        this.closepopup=this.page.locator("(//img[contains(@alt,'close popup')])[1]");
        
    }

    async globalsearchretainentityviewmorelink() {
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
        await this.retainentityviewmore.waitFor({ state: 'visible', timeout: 15000 });
        await this.retainentityviewmore.click();

       // Wait for "noise tab" link and click it
       await this.noisetab.waitFor({ state: 'visible', timeout: 15000 });
        await this.noisetab.click();
         // Wait for "video tab" link and click it
       await this.videotab.waitFor({ state: 'visible', timeout: 15000 });
        await this.videotab.click();

         // Wait for "close pop up icon"  and click it
         await this.closepopup.waitFor({ state: 'visible', timeout: 15000 });
        await this.closepopup.click();
        // ✅ OR: Optional visual hold for 3 seconds (if you just want to "see" it)
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { GlobalSearchRetainedEntity };