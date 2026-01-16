const { expect } = require('@playwright/test');

class DeleteRetainImage {
    constructor(page) {
        this.page = page;

        this.retainEntityCard = page.locator('.dashboard-box:has-text("Retained Entities")');
        //this.loader = page.locator('#global-loader-container');
        this.eyeicon=this.page.locator("(//img[@title='View'])[1]");
        this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");

        // ✅ image delete
       
        //this.imagedelete = this.page.locator("(//img[@title='Delete Images'])[1]");

        //this.deleteretainimage=this.page.locator("(//img[@title='Delete Retained'])[1]");

        this.deleteBtnconfm = this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");

        // ✅ Loader
        this.loader = this.page.locator('#global-loader-container >> .loading');
    }

    async waitForLoader() {
        if (await this.loader.isVisible().catch(() => false)) {
            await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
        }
    }

    async deleteretainimagesingroup() {
        await this.page.waitForLoadState('networkidle');

       // Step 1:✅ Select card delete retain image
        await this.retainEntityCard.waitFor({ state: 'visible', timeout: 30000 });
        await this.retainEntityCard.click();

        await this.eyeicon.click();
        await this.drilldown.click();


        // Step 3: Pick random delete icon
        const deleteretainimage = this.page.locator("(//img[@title='Delete Retained'])[1]");
        const count = await deleteretainimage.count();
        if (count === 0) throw new Error("No deleteicon found!");

        const randomIndex = Math.floor(Math.random() * count);
        const randomdeleteretainimage = deleteretainimage.nth(randomIndex);
        await randomdeleteretainimage.click();

        // Wait for popup 
        await this.page.waitForTimeout(1000);


        // Wait loader after single retain
        await this.waitForLoader();

        
        //  Confirm pop up for delete retain image
        await this.deleteBtnconfm.waitFor({ state: "visible", timeout: 20000 });
        await expect(this.deleteBtnconfm).toBeEnabled();

        await this.waitForLoader(); // wait if loader appears before clicking
        await this.deleteBtnconfm.click();

        // Final wait for loader
        await this.waitForLoader();
    }
}

module.exports = { DeleteRetainImage };