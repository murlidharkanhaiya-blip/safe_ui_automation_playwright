const { expect } = require('@playwright/test');

class HandGestureSearch {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.handGestureCard = page.locator("div.block-container").filter({ hasText: 'Hand gesture' });
        this.searchInput = page.locator("input[placeholder*='Search']").nth(1);
        this.searchButton = page.locator("div.page-heading-actions div.search-wrapper img[alt='search']");
        this.searchByTrigger = page.locator('[data-testid="searchBy"]');
        this.tableRow = page.locator("tr.MuiTableRow-root");
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

    async getFirstValidEmployee() {
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);

        const rows = await this.tableRow.all();

        for (const row of rows) {
            try {
                const cells = await row.locator('td').all();

                if (cells.length >= 3) {
                    const id = await cells[0].innerText({ timeout: 3000 });
                    const name = await cells[1].innerText({ timeout: 3000 });
                    const email = await cells[2].innerText({ timeout: 3000 });

                    if (id?.trim() && name?.trim() && email?.trim()) {
                        return {
                            id: id.trim(),
                            name: name.trim(),
                            email: email.trim()
                        };
                    }
                }
            } catch (err) {
                continue;
            }
        }

        throw new Error("❌ No valid employee found in Hand Gesture table");
    }

    async performSearch(criteriaText, inputValue) {
        console.log(`🔎 Searching by ${criteriaText}: "${inputValue}"`);

        await this.searchByTrigger.click();
        await this.page.waitForTimeout(300);

        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(200);

        await this.searchInput.clear();
        await this.page.waitForTimeout(200);
        await this.searchInput.fill(inputValue);
        await expect(this.searchInput).toHaveValue(inputValue);

        await this.searchButton.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(1500);
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async validateSearchResult(inputValue, cellIndex, label, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.tableRow.first().waitFor({ state: 'visible', timeout: 10000 });

                const rows = await this.tableRow.all();

                if (rows.length === 0) {
                    console.warn(`⚠️ No results found for ${label}: "${inputValue}"`);
                    return;
                }

                const firstRow = rows[0];
                const cells = await firstRow.locator('td').all();

                if (cells[cellIndex]) {
                    const cellText = await cells[cellIndex].innerText({ timeout: 5000 });
                    expect(cellText.trim()).toContain(inputValue);
                    console.log(`✅ ${label} search verified`);
                    return;
                }

            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`❌ ${label} validation failed after ${retries} attempts: ${error.message}`);
                }
                console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
                await this.page.waitForTimeout(1000);
            }
        }
    }

    async verifySearchonhandgesturePage() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        // ✅ Find and click Hand Gesture card
        console.log("📊 Looking for Hand Gesture card...");
        
        const cardCount = await this.handGestureCard.count();
        console.log(`🔍 Found ${cardCount} Hand Gesture card(s)`);

        if (cardCount === 0) {
            // Try scrolling
            console.log("🔄 Scrolling to find card...");
            
            for (let i = 0; i < 5; i++) {
                await this.page.mouse.wheel(0, 400);
                await this.page.waitForTimeout(500);
                
                const retryCount = await this.handGestureCard.count();
                if (retryCount > 0) {
                    console.log("✅ Card found after scrolling");
                    break;
                }
            }
            
            const finalCount = await this.handGestureCard.count();
            if (finalCount === 0) {
                await this.page.screenshot({ path: 'debug-no-hand-gesture-card.png', fullPage: true });
                throw new Error("❌ Hand Gesture card not found. Check debug-no-hand-gesture-card.png");
            }
        }

        await this.handGestureCard.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.handGestureCard.first().scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.handGestureCard.first().click();
        console.log("✅ Clicked Hand Gesture card");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(3000);

        // ✅ Wait for table
        try {
            await this.tableRow.first().waitFor({ state: 'visible', timeout: 15000 });
        } catch {
            console.warn("⚠️ No table data found");
            return;
        }

        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} row(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No data available in Hand Gesture table");
            return;
        }

        // ✅ Get first valid employee
        const { id, name, email } = await this.getFirstValidEmployee();
        console.log(`🎯 Selected Employee:
        ID: ${id}
        Name: ${name}
        Email: ${email}`);

        // ✅ Search by Employee ID
        await this.performSearch("Employee ID", id);
        await this.validateSearchResult(id, 0, "Employee ID");

        // ✅ Search by Employee Name
        await this.performSearch("Employee Name", name);
        await this.validateSearchResult(name, 1, "Employee Name");

        // ✅ Search by Employee Email
        await this.performSearch("Employee Email", email);
        await this.validateSearchResult(email, 2, "Employee Email");

        console.log("🎉 All Hand Gesture searches completed successfully!");
    }
}

module.exports = { HandGestureSearch };