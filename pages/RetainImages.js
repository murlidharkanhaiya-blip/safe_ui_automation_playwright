const { expect } = require('@playwright/test');

class RetainImages {
    constructor(page) {
        this.page = page;

        this.cardContainer = "div.recharts-wrapper";

        this.actionicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
        this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");

        // ✅ Single image
        this.viewsingleimage = this.page.locator("//span[@title='Click to view image']");
        this.singleimageretain = this.page.locator("//button[normalize-space()='RETAIN IMAGE']");

        // ✅ All images
        this.allimagesretain = this.page.locator("//img[@title='Retain All Images']");
        this.retainallBtn = this.page.locator("//button[normalize-space()='RETAIN ALL']");

        // ✅ Loader
        this.loader = this.page.locator('#global-loader-container >> .loading');
    }

    /* ----------------------------------------------------
       ✅ Loader wait
    ---------------------------------------------------- */
    async waitForLoader() {
        try {
            if (await this.loader.isVisible({ timeout: 3000 })) {
                await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
            }
        } catch {}
    }

    /* ----------------------------------------------------
       ✅ Wait until Total Unique Login card has data
    ---------------------------------------------------- */

    async waitForEmployeeTableAndActionIcon(timeout = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        // wait loader if present
        await this.waitForLoader();

        // check table rows
        const rows = this.page.locator("//table//tr");
        const rowCount = await rows.count();

        if (rowCount > 0) {
            const icon = this.actionicon;
            if (await icon.isVisible().catch(() => false)) {
                console.log("✅ Employee table & action icon loaded");
                return;
            }
        }

        console.log("⏳ Waiting for employee table / action icon...");
        await this.page.waitForTimeout(1500);
    }

    throw new Error("❌ Employee table or action icon did not load in time");
}
    async waitForTotalUniqueLoginCard(timeout = 30000) {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            const cards = this.page.locator(this.cardContainer);
            const count = await cards.count();

            for (let i = 0; i < count; i++) {
                const card = cards.nth(i);
                const text = (await card.innerText().catch(() => '')).trim();

                // waits for: "Total Unique Login 12"
                if (/Total\s+Unique\s+Login\s*\d+/i.test(text)) {
                    await card.scrollIntoViewIfNeeded();
                    return card;
                }
            }

            console.log('⏳ Waiting for Total Unique Login card data...');
            await this.page.waitForTimeout(1500);
        }

        throw new Error('❌ Total Unique Login card did not load data in time');
    }

    /* ----------------------------------------------------
       ✅ Main Flow
    ---------------------------------------------------- */
    async retainimagesingroup() {
        await this.page.waitForLoadState('networkidle');

        // Step 1: Safely open Total Unique Login card
        const card = await this.waitForTotalUniqueLoginCard();
        await expect(card).toBeVisible();
        await card.click();

        await this.waitForLoader();

        
        // Step 2: Drill into employee details (stable)
await this.waitForEmployeeTableAndActionIcon();

await this.actionicon.scrollIntoViewIfNeeded();
await this.actionicon.click({ force: true });

await this.drilldown.waitFor({ state: 'visible', timeout: 15000 });
await this.drilldown.click();

await this.waitForLoader();

        // Step 3: Pick random image
        const images = this.viewsingleimage;
        const count = await images.count();
        if (count === 0) {
            throw new Error("❌ No images found!");
        }

        const randomIndex = Math.floor(Math.random() * count);
        await images.nth(randomIndex).scrollIntoViewIfNeeded();
        await images.nth(randomIndex).click();

        // Retain single image
        await this.singleimageretain.waitFor({ state: "visible", timeout: 15000 });
        await expect(this.singleimageretain).toBeEnabled();
        await this.singleimageretain.click();

        await this.waitForLoader();

        // Step 4: Retain all images
        const allIcons = this.allimagesretain;
        const iconCount = await allIcons.count();
        if (iconCount === 0) {
            throw new Error("❌ No 'Retain All Images' icons found!");
        }

        const randomIndex1 = Math.floor(Math.random() * iconCount);
        console.log(`🔹 Clicking 'Retain All Images' at index: ${randomIndex1}`);

        await allIcons.nth(randomIndex1).scrollIntoViewIfNeeded();
        await allIcons.nth(randomIndex1).click();

        // Step 5: Confirm RETAIN ALL
        await this.retainallBtn.waitFor({ state: "visible", timeout: 20000 });
        await expect(this.retainallBtn).toBeEnabled();

        await this.waitForLoader();
        await this.retainallBtn.click();

        await this.waitForLoader();

        console.log("✅ Image retention flow completed successfully.");
    }
}

module.exports = { RetainImages };