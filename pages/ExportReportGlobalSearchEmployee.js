const { expect } = require('@playwright/test');

class ExportReportGlobalSearchEmployee {
    constructor(page) {
        this.page = page;
        this.globalSearchInput = "(//input[@placeholder='Search by Emp. Name/ID'])[1]";
        this.searchIcon = this.page.locator("//div[@class='search__input-bar--image']//img[@alt='search']");
        this.selectedname = this.page.locator("(//div[@title='Murli Kumar'])[1]");
        this.exporticon = this.page.locator("(//button[@data-testid='export-report'])[1]");
        this.csvbutton = this.page.locator("(//a[normalize-space()='CSV'])[1]");
       
    }

    async searchCandidateByID() {
        const ID = '145672';
        const searchInput = this.page.locator(this.globalSearchInput);

        await searchInput.fill(ID);
        await expect(this.searchIcon).toBeVisible({ timeout: 5000 });
        await this.searchIcon.click();

        // Click candidate name to open the profile
        await expect(this.selectedname).toBeVisible({ timeout: 5000 });
        await this.selectedname.click();

        // ✅ Wait for export button to appear and click
        await this.exporticon.waitFor({ state: 'visible', timeout: 15000 });
        await this.exporticon.click();

        // ✅ Wait for CSV option to appear and click
        await this.csvbutton.waitFor({ state: 'visible', timeout: 10000 });
        await this.csvbutton.click();
        }

       

        
    }


module.exports = { ExportReportGlobalSearchEmployee };
