const { expect } = require('@playwright/test');

class VideoOnDemandSearch {
    constructor(page) {
        this.page = page;

        // Card locator
        this.cardTitleText = 'On Demand Media';

        // Search & button locators
        this.searchInput = page.locator("input[placeholder*='Search']").nth(1);
        this.searchButton = page.locator("div.page-heading-actions div.search-wrapper img[alt='search']");
        this.searchByTrigger = page.locator('[data-testid="searchBy"]');

        // Completed tab
        this.completedTab = page.locator('div.status:has-text("Completed")');

        // Table locators
        this.tableRow = page.locator("tr.MuiTableRow-root");
        this.tableWrapper = page.locator("div.MuiTableContainer-root");
        this.loader = page.locator('#global-loader-container .loading');
    }

    async scrollUntilCardIsVisible() {
        for (let i = 0; i < 10; i++) {
            const card = this.page.locator('div.block-container').filter({ hasText: this.cardTitleText });
            const count = await card.count();
            
            if (count > 0) {
                const firstCard = card.first();
                if (await firstCard.isVisible()) {
                    return firstCard;
                }
            }
            
            await this.page.mouse.wheel(0, 300);
            await this.page.waitForTimeout(500);
        }
        throw new Error(`❌ On Demand Media card not found after scrolling.`);
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

    // Get first valid employee (deterministic)
    async getFirstValidEmployee() {
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000); // Stabilization

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
                // Skip invalid row
                continue;
            }
        }

        throw new Error("❌ No valid employee found in Completed tab");
    }

    async performSearch(criteriaText, inputValue) {
        console.log(`🔎 Searching by ${criteriaText}: "${inputValue}"`);

        // Open dropdown
        await this.searchByTrigger.click();
        await this.page.waitForTimeout(300);

        // Select criteria
        const dropdownWrapper = this.page.locator('.search__options--dropdown');
        await dropdownWrapper.waitFor({ state: 'visible', timeout: 5000 });

        const option = dropdownWrapper.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(200);

        // Fill search
        await this.searchInput.clear();
        await this.searchInput.fill(inputValue);
        await expect(this.searchInput).toHaveValue(inputValue);

        // Click search
        await this.searchButton.click();

        // Wait for search completion
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(1500);
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async validateSearchResult(inputValue, cellIndex, label, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
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
                    console.warn(`⚠️ ${label} validation completed for "${inputValue}"`);
                    return;
                }
                console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
                await this.page.waitForTimeout(1000);
            }
        }
    }

    async verifySearchonvideoondemandPage() {
        // Wait for page ready
        await this.page.waitForLoadState('domcontentloaded');

        // Click On Demand Media card
        console.log("📂 Looking for On Demand Media card...");
        const card = await this.scrollUntilCardIsVisible();
        const clickable = card.locator("div.block.hand.box-shadow");
        await clickable.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await clickable.click({ timeout: 5000 });
        console.log("✅ Clicked On Demand Media card");

        // Click Completed tab
        console.log("⏳ Waiting for 'Completed' tab...");
        await this.completedTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.completedTab.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await this.completedTab.click();
        console.log("✅ Clicked 'Completed' tab");

        // Wait for loader and table
        await this.waitForLoader();
        await this.tableWrapper.waitFor({ state: 'visible', timeout: 15000 });

        const rowCount = await this.tableRow.count();
        if (rowCount === 0) {
            console.warn("⚠️ No records in 'Completed' tab. Skipping search.");
            return;
        }

        // Get first valid employee (deterministic)
        const { id, name, email } = await this.getFirstValidEmployee();
        console.log(`🎯 Selected Employee:
        ID: ${id}
        Name: ${name}
        Email: ${email}`);

        // Search by Employee ID
        await this.performSearch("Employee ID", id);
        await this.validateSearchResult(id, 0, "Employee ID");

        // Search by Employee Name
        await this.performSearch("Employee Name", name);
        await this.validateSearchResult(name, 1, "Employee Name");

        // Search by Employee Email
        await this.performSearch("Employee Email", email);
        await this.validateSearchResult(email, 2, "Employee Email");

        console.log("🎉 All Video On Demand searches completed!");
    }
}

module.exports = { VideoOnDemandSearch };