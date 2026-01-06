const { expect } = require('@playwright/test');

class GlobalSearchNoiseActivity {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.noiseviewmore = this.page.locator("(//span[@class='view-more-link'][normalize-space()='View More'])[2]");
        
        
        
    }

    async globalsearchnoiseactivityviewmorelink() {
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
        await this.noiseviewmore.waitFor({ state: 'visible', timeout: 15000 });
        await this.noiseviewmore.click();

         

        // ✅ OR: Optional visual hold for 3 seconds (if you just want to "see" it)
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { GlobalSearchNoiseActivity };