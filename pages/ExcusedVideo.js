const { expect } = require('@playwright/test');

class ExcusedVideo {
    constructor(page) {
        this.page = page;

        // Locators
        this.excusedEntityCard = this.page.locator("div.block-container.deleted-images-block").filter({ hasText: "Excused Entities" });
        this.videotab=this.page.locator("(//div[@class='videos failed-captures btn btn-outline-success '])[1]");
        this.actionicon=this.page.locator("(//img[contains(@title,'View')])[1]");
        this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");
        this.clicktoviewvideo=this.page.locator("(//img[@title='Click to view video'])[1]");

        // Loader
        this.loader = this.page.locator('#global-loader-container >> .loading');
    }

    // ✅ Wait for loader to disappear
   async waitForExcusedEntitiesToLoad() {
        await this.excusedEntityCard.waitFor({ state: 'visible', timeout: 20000 });

        const cardHandle = await this.excusedEntityCard.elementHandle();

        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                const match = text.match(/Excused Entities\s*(\d+)/);
                return match && parseInt(match[1], 10) > 0;
            },
            cardHandle,
            { timeout: 20000 }
        );
    }

    // ✅ Main ecxused video flow
    async excusedemployeevideo() {
        

        
        // Step 1:✅ Select card excused image card 
       await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        await this.waitForExcusedEntitiesToLoad();
        await this.excusedEntityCard.scrollIntoViewIfNeeded();
        await this.excusedEntityCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.excusedEntityCard.click();
        const loader = this.page.locator('#global-loader-container >> .loading');
        try {
            if (await loader.isVisible({ timeout: 3000 })) {
                await loader.waitFor({ state: 'hidden', timeout: 15000 });
            }
        } catch {
            console.log("⚠️ Loader not visible or skipped.");
        }

       // Step2 click on video tab 
        await this.videotab.waitFor({ state: 'visible', timeout: 5000 });
        await this.videotab.click();
        // Step2 click on action icon 
        await this.actionicon.waitFor({ state: 'visible', timeout: 5000 });
        await this.actionicon.click();

        //Click on drill down
        await this.drilldown.waitFor({ state: 'visible', timeout: 5000 });
        await this.drilldown.click();

        //click on view video icon

       await this.clicktoviewvideo.waitFor({ state: 'visible', timeout: 5000 });
        await this.clicktoviewvideo.click();
       
    }
}

module.exports = { ExcusedVideo };