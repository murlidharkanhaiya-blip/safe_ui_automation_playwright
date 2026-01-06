const { expect } = require('@playwright/test');

class FilterChipOnDemandMediaVideo {
    constructor(page) {
        this.page = page;

        // Locators
        this.ondemandmediaCard = this.page.locator("div.block-container:has-text('On Demand Media')");
        // Updated Completed tab selector
        this.completedCardSelector = 'div.status:has-text("Completed")';
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectstatus = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[1]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");

        // Optional overlay locator
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

    async waitForOndemandmediacardToLoad() {
        const maxScrollAttempts = 10;
        let found = false;

        for (let i = 0; i < maxScrollAttempts; i++) {
            const visible = await this.ondemandmediaCard.first().isVisible().catch(() => false);
            if (visible) {
                found = true;
                break;
            }

            await this.page.mouse.wheel(0, 500);
            await this.page.waitForTimeout(800);
        }

        if (!found) {
            throw new Error("❌ On Demand Media card not found even after scrolling.");
        }

        this.ondemandmediaCard = this.ondemandmediaCard.first();

        const cardHandle = await this.ondemandmediaCard.elementHandle();
        await this.page.waitForFunction(
    (el) => el?.innerText?.includes("On Demand Media"),
    cardHandle,
    { timeout: 15000 }
);
    }


    async verifyondemandnediavideofilterchip() {
        await this.page.waitForLoadState('networkidle');

         await this.waitForOndemandmediacardToLoad();

        // ✅ Click on the ondemand media  card
        await this.ondemandmediaCard.scrollIntoViewIfNeeded();
        await this.ondemandmediaCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.ondemandmediaCard.hover();
        await this.page.waitForTimeout(300);
        await this.ondemandmediaCard.click({ force: true });

        // ✅ Click the Completed tab
        const completedTab = this.page.locator(this.completedCardSelector);
        console.log("⏳ Waiting for 'Completed' tab to appear...");
        await completedTab.waitFor({ state: 'attached', timeout: 10000 });
        await completedTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await completedTab.click();
        console.log("✅ Clicked on 'Completed' tab.");

        // ✅ Wait for loader if it appears
        const loader = this.page.locator('#global-loader-container >> .loading');
        if (await loader.isVisible().catch(() => false)) {
            await loader.waitFor({ state: 'hidden', timeout: 15000 });
        }

        // Function to select and apply a given filter
        const selectAndApplyFilter = async (filterName) => {
            console.log(`🎯 Applying filter: ${filterName}`);

            // Open filter chip
            await this.filterchip.click();
            await this.page.waitForTimeout(1000);

            // Open status dropdown
            await this.selectstatus.click();
            await this.page.waitForTimeout(1000);

            // Select filter value
            const filterOption = this.page.locator(`//a[@data-testid='search-dropdown' and @title='${filterName}']`);
            await filterOption.waitFor({ state: 'visible', timeout: 10000 });
            await filterOption.click({ force: true });
            await this.page.waitForTimeout(1000);

            // Click Apply
            await this.applybtn.waitFor({ state: 'attached', timeout: 15000 });
            await this.applybtn.scrollIntoViewIfNeeded();
            await expect(this.applybtn).toBeVisible({ timeout: 10000 });

            try {
                await this.applybtn.click({ timeout: 5000 });
            } catch {
                await this.page.evaluate((btn) => btn.click(), await this.applybtn.elementHandle());
            }

            console.log(`✅ Filter "${filterName}" applied successfully.`);
            await this.page.waitForTimeout(3000);
        };

        // Step 2: Apply both filters sequentially
        
        await selectAndApplyFilter("Deactivated");
         await selectAndApplyFilter("Total Users");
    }
}

module.exports = { FilterChipOnDemandMediaVideo };