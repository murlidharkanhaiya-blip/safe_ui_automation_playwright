const { expect } = require('@playwright/test');

class ExportReportGlobalSearchSeniorManager {
    constructor(page) {
        this.page = page;

        // Locators
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.senoiorgmanager = page.locator("(//div[normalize-space()='Senior Manager'])[1]");
        this.resultRecords = page.locator("div.search-result-table__body--record");
        this.exporticon = page.locator("(//button[@data-testid='export-report'])[1]");
        this.csvbutton = page.locator("(//a[normalize-space()='CSV'])[1]");
        this.successToast = page.locator("//div[contains(text(),'Report has been sent to your email')]");
        this.hardcodedName = page.locator("(//div[@title='Alex Hales'])[1]"); 
    }

    async searchEmployeeByName() {
        const prefix = 'roh';
        const searchInput = this.page.locator(this.globalSearchInput);

        // Step 1: Fill the input and click search icon
        await searchInput.fill(prefix);
        await expect(this.searchIcon).toBeVisible({ timeout: 5000 });
        await this.searchIcon.click();

        // Step 2: Click "Senior Manager" tab
        await expect(this.senoiorgmanager).toBeVisible({ timeout: 5000 });
        await this.senoiorgmanager.click();

        // Step 3: Click hardcoded employee name
        
        await expect(this.hardcodedName).toBeVisible({ timeout: 10000 });

        console.log("👤 Clicking on hardcoded employee: Ali Mac Five");
        await this.hardcodedName.click();

        // Step 4: Export
        
        await expect(this.exporticon).toBeVisible({ timeout: 15000 });

        
        await this.exporticon.click();

        console.log("⬇️ Waiting for and clicking CSV...");
        await expect(this.csvbutton).toBeVisible({ timeout: 10000 });
        await this.csvbutton.click();

       
        await expect(this.successToast).toBeVisible({ timeout: 10000 });

        console.log("🎉 Export successful!");
    }
}

module.exports = { ExportReportGlobalSearchSeniorManager };