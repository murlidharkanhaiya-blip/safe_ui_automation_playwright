const { expect } = require('@playwright/test');

class FilterChipEmotionDetection {
    constructor(page) {
        this.page = page;

        // Locators
       this.emotiondeductioncard = "//div[@class='block hand box-shadow']"; 
        this.filterchip = this.page.locator("(//div[@class='filter-icon hand '])[1]");
        this.selectstatus = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[1]");
        this.applybtn = this.page.locator("//button[@data-testid='apply-filter']");

        // Optional overlay locator
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");
    }

   

    async verifyemotiondetectionfilterchip() {
        await this.page.waitForLoadState('networkidle');

         const allCards = this.page.locator(this.emotiondeductioncard);
        const count = await allCards.count();

        let clicked = false;

        for (let i = 0; i < count; i++) {
            const card = allCards.nth(i);
            const textContent = await card.textContent();

            if (textContent && textContent.includes("Emotion Detection")) {
                await card.scrollIntoViewIfNeeded();  // Scroll the card into view
                await card.click();
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            throw new Error("❌ Emotion Detection card not found or not clickable.");
        }

        await this.page.waitForTimeout(2000); 

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

module.exports = { FilterChipEmotionDetection };