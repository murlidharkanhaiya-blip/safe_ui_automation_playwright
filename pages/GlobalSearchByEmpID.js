const { expect } = require('@playwright/test');

class GlobalSearchByEmpID {
    constructor(page) {
        this.page = page;

        // Locators
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");

        // More stable locator for specific suggestion
        this.selectedname = page.locator("(//div[@title='Murli Kumar'])[1]");
    }

    async searchEmployeeByID() {
        const ID = '145672';
        const searchInput = this.page.locator(this.globalSearchInput);

        // Type ID and click search
        await searchInput.fill(ID);
        await expect(this.searchIcon).toBeVisible({ timeout: 5000 });
        await this.searchIcon.click();

        // Wait and click on suggestion
        await expect(this.selectedname).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(3000); // Optional delay
        await this.selectedname.click();

        console.log("✅ Global search suggestion clicked successfully.");
    }
}

module.exports = { GlobalSearchByEmpID };
