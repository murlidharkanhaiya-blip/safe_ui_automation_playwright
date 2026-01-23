const { expect } = require('@playwright/test');

class ManageUserSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.manageUserNav = page.locator("//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Users']//a[@data-testid='nav-link']");
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

    async getFirstValidUser() {
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);

        const rows = await this.tableRow.all();

        for (const row of rows) {
            try {
                const cells = await row.locator('td').all();

                if (cells.length >= 3) {
                    const id = await cells[0].innerText({ timeout: 3000 });
                    const username = await cells[1].innerText({ timeout: 3000 });
                    const email = await cells[2].innerText({ timeout: 3000 });

                    if (id?.trim() && username?.trim() && email?.trim()) {
                        return {
                            id: id.trim(),
                            username: username.trim(),
                            email: email.trim()
                        };
                    }
                }
            } catch (err) {
                continue;
            }
        }

        throw new Error("❌ No valid users found in Manage Users table");
    }

    async performSearch(criteriaText, inputValue) {
        console.log(`🔎 Searching by ${criteriaText}: "${inputValue}"`);

        await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });

        await this.searchByTrigger.click();
        await this.page.waitForTimeout(500);

        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(300);

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

    async verifySearchOnmanageuserPage() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ Navigate to Manage Users if not already there
        if (!currentUrl.includes('manage-user')) {
            console.log("📂 Navigating to Manage Users...");
            
            const sidebar = this.page.locator('div.fixed-left-sidebar');
            await sidebar.waitFor({ state: 'visible', timeout: 10000 });
            
            await this.manageUserNav.waitFor({ state: 'visible', timeout: 20000 });
            await this.manageUserNav.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.manageUserNav.click();
            console.log("✅ Clicked Manage Users");

            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log("✅ Already on Manage Users page");
        }

        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // Get first valid user
        const { id, username, email } = await this.getFirstValidUser();
        console.log(`🎯 Selected User:
        Employee ID: ${id}
        Username: ${username}
        Email ID: ${email}`);

        // Search by Employee ID
        await this.performSearch("Employee ID", id);
        await this.validateSearchResult(id, 0, "Employee ID");

        // Search by Username
        await this.performSearch("Username", username);
        await this.validateSearchResult(username, 1, "Username");

        // Search by Email ID
        await this.performSearch("Email ID", email);
        await this.validateSearchResult(email, 2, "Email ID");

        console.log("🎉 All Manage Users searches completed successfully!");
    }
}

module.exports = { ManageUserSearch };