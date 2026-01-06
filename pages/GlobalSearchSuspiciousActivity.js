const { expect } = require('@playwright/test');

class GlobalSearchSuspiciousActivity {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.suspiciousviewmore = this.page.locator("(//span[@class='view-more-link'][normalize-space()='View More'])[1]");
        this.videotab=this.page.locator("(//div[contains(text(),'Videos')])[1]");
        
        
    }

    async globalsearchsuspiciousactivityviewmorelink() {
        const ID = '145672';
        const searchInput = this.page.locator(this.globalSearchInput);

        await searchInput.fill(ID);
        await expect(this.searchIcon).toBeVisible({ timeout: 5000 });
        await this.searchIcon.click();

        // Click candidate name to open the profile
        await expect(this.selectedname).toBeVisible({ timeout: 5000 });
        await this.selectedname.click();

        // Wait for "View More" link and click it
        await this.suspiciousviewmore.waitFor({ state: 'visible', timeout: 15000 });
        await this.suspiciousviewmore.click();

         // Wait for "video tab"  and click it

         await this.videotab.waitFor({ state: 'visible', timeout: 15000 });
        await this.videotab.click();

        // ✅ OR: Optional visual hold for 3 seconds (if you just want to "see" it)
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { GlobalSearchSuspiciousActivity };