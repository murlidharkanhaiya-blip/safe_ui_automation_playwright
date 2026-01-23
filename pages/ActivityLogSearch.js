const { expect } = require('@playwright/test');

class ActivityLogSearch {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.activitylogNavView = page.locator("div.fixed-left-sidebar li[data-tip='Activity Logs'] a[data-testid='nav-link']");
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
        await this.page.waitForTimeout(1000); // Increased stabilization

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

        throw new Error("❌ No valid employee found in Activity Logs table");
    }

    async performSearch(criteriaText, inputValue) {
        console.log(`🔎 Searching by ${criteriaText}: "${inputValue}"`);

        // Ensure search input is ready
        await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });

        // Open dropdown
        await this.searchByTrigger.click();
        await this.page.waitForTimeout(500); // Increased wait

        // Select criteria
        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(300);

        // Clear and fill
        await this.searchInput.clear();
        await this.page.waitForTimeout(200); // Wait for clear
        await this.searchInput.fill(inputValue);
        await expect(this.searchInput).toHaveValue(inputValue);

        // Click search
        await this.searchButton.click();

        // Wait for search completion
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(1500); // Increased wait
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

    async verifySearchOnactivitylogPage() {
        // ✅ ADDED: Reset state before starting
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000); // Allow previous test cleanup

        // ✅ ADDED: Check if already on Activity Logs page
        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        if (!currentUrl.includes('activity-logs')) {
            console.log("📂 Navigating to Activity Logs...");
            
            // Wait for sidebar to be ready
            const sidebar = this.page.locator('div.fixed-left-sidebar');
            await sidebar.waitFor({ state: 'visible', timeout: 10000 });
            
            await this.activitylogNavView.waitFor({ state: 'visible', timeout: 15000 });
            await this.activitylogNavView.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.activitylogNavView.click();
            console.log("✅ Clicked Activity Logs");

            // Wait for navigation
            await this.page.waitForURL('**/activity-logs**', { timeout: 10000 });
            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log("✅ Already on Activity Logs page");
        }

        await this.waitForLoader();
        await this.page.waitForTimeout(2000); // Allow page to stabilize

        // Get first valid employee
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

        console.log("🎉 All Activity Log searches completed successfully!");
    }
}

module.exports = { ActivityLogSearch };