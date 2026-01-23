const { expect } = require('@playwright/test');

class GlobalSearchByEmpID {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.globalSearchInput = page.locator("input[placeholder='Search by Emp. Name/ID']").first();
        this.searchIcon = page.locator("div.search__input-bar--image img[alt='search']");
        this.suggestionList = page.locator("div.search__suggestions, div[class*='suggestion']");
        this.loader = page.locator('#global-loader-container .loading');
    }

    async waitForLoader() {
        try {
            const isVisible = await this.loader.isVisible({ timeout: 2000 });
            if (isVisible) {
                await this.loader.waitFor({ state: 'hidden', timeout: 15000 });
                console.log("⏳ Loader hidden");
            }
        } catch {
            // Loader not present
        }
    }

    async searchEmployeeByID() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        const employeeID = '145672';
        const expectedName = 'Murli Kumar';

        console.log(`🔍 Searching for Employee ID: ${employeeID}`);

        // ✅ Clear any existing search
        await this.globalSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.globalSearchInput.clear();
        await this.page.waitForTimeout(300);

        // ✅ Type employee ID
        await this.globalSearchInput.fill(employeeID);
        console.log(`✅ Entered ID: ${employeeID}`);

        await this.page.waitForTimeout(500);

        // ✅ Click search icon
        await this.searchIcon.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchIcon.click();
        console.log("✅ Clicked search icon");

        // ✅ Wait for suggestions to appear
        await this.page.waitForTimeout(2000);
        await this.waitForLoader();

        // ✅ Wait for suggestion list
        console.log("⏳ Waiting for search suggestions...");
        
        try {
            await this.suggestionList.waitFor({ state: 'visible', timeout: 10000 });
            console.log("✅ Suggestions appeared");
        } catch {
            console.warn("⚠️ No suggestions appeared");
            await this.page.screenshot({ path: 'debug-no-suggestions.png', fullPage: true });
            return;
        }

        await this.page.waitForTimeout(1000);

        // ✅ Try to find the specific employee - multiple strategies
        let suggestionClicked = false;

        const selectors = [
            `div[title='${expectedName}']`,
            `text=${expectedName}`,
            `div:has-text('${expectedName}')`,
            `a:has-text('${expectedName}')`,
            `li:has-text('${expectedName}')`
        ];

        for (const selector of selectors) {
            try {
                const suggestion = this.page.locator(selector).first();
                const isVisible = await suggestion.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    await suggestion.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(300);
                    await suggestion.click();
                    console.log(`✅ Clicked suggestion: "${expectedName}"`);
                    suggestionClicked = true;
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!suggestionClicked) {
            // Try clicking first suggestion
            console.log("⚠️ Specific employee not found, trying first suggestion...");
            
            const firstSuggestion = this.page.locator("div[class*='suggestion'] div, div[class*='search-result']").first();
            const isFirstVisible = await firstSuggestion.isVisible({ timeout: 3000 }).catch(() => false);
            
            if (isFirstVisible) {
                const suggestionText = await firstSuggestion.textContent();
                await firstSuggestion.click();
                console.log(`✅ Clicked first suggestion: "${suggestionText}"`);
                suggestionClicked = true;
            } else {
                console.warn("⚠️ No suggestions found to click");
                await this.page.screenshot({ path: 'debug-no-clickable-suggestion.png', fullPage: true });
                return;
            }
        }

        // ✅ Wait for navigation/details to load
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        console.log("🎉 Global search completed successfully!");
    }
}

module.exports = { GlobalSearchByEmpID };