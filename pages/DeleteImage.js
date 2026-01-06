const { expect } = require('@playwright/test');

class DeleteImage {
    constructor(page) {
        this.page = page;

        this.totaluniquecardLocator = "div.recharts-wrapper";
        this.actionicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
        this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");

        // ✅ image delete
       
        //this.imagedelete = this.page.locator("(//img[@title='Delete Images'])[1]");

        this.enterdeleteremark=this.page.locator("(//textarea[@placeholder='Enter deletion remarks'])[1]");

        this.deleteBtn = this.page.locator("(//button[normalize-space()='DELETE'])[1]");

        // ✅ Loader
        this.loader = this.page.locator('#global-loader-container >> .loading');
    }

    async waitForLoader() {
        if (await this.loader.isVisible().catch(() => false)) {
            await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
        }
    }

    async deleteimagesingroup() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Open unique login card
        const card = this.page.locator('div.recharts-wrapper').filter({ hasText: 'Total Unique Login' });
        await card.first().scrollIntoViewIfNeeded();
        await card.first().click();

        await this.waitForLoader();

        // Step 2: Drill into employee details
        await this.actionicon.click();
        await this.drilldown.click();

        // Step 3: Pick random delete icon
        const deleteicon = this.page.locator("(//img[@title='Delete Images'])[1]");
        const count = await deleteicon.count();
        if (count === 0) throw new Error("No deleteicon found!");

        const randomIndex = Math.floor(Math.random() * count);
        const randomdeleteicon = deleteicon.nth(randomIndex);
        await randomdeleteicon.click();

        // Wait for popup 
        await this.page.waitForTimeout(1000);

        // enter delete remark
        await this.enterdeleteremark.waitFor({ state: 'visible' });
        await this.enterdeleteremark.fill("yes");

        // Wait loader after single retain
        await this.waitForLoader();

        
        //  Confirm "RETAIN ALL"
        await this.deleteBtn.waitFor({ state: "visible", timeout: 20000 });
        await expect(this.deleteBtn).toBeEnabled();

        await this.waitForLoader(); // wait if loader appears before clicking
        await this.deleteBtn.click();

        // Final wait for loader
        await this.waitForLoader();
    }
}

module.exports = { DeleteImage };