const { expect } = require('@playwright/test');

class BatchSchedulingSearch {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.batchSchedulingNav = page.locator("div.fixed-left-sidebar li[data-tip='Batch Scheduling'] a[data-testid='nav-link']");
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

    // Get first valid job (deterministic)
    async getFirstValidJob() {
        await this.tableRow.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);

        const rows = await this.tableRow.all();

        for (const row of rows) {
            try {
                const cells = await row.locator('td').all();

                if (cells.length >= 3) {
                    const jobName = await cells[0].innerText({ timeout: 3000 });
                    const createdBy = await cells[2].innerText({ timeout: 3000 });

                    if (jobName?.trim() && createdBy?.trim()) {
                        return {
                            jobName: jobName.trim(),
                            createdBy: createdBy.trim()
                        };
                    }
                }
            } catch (err) {
                // Skip invalid row
                continue;
            }
        }

        throw new Error("❌ No valid jobs found in Batch Scheduling table");
    }

    async performSearch(criteriaText, inputValue) {
        console.log(`🔎 Searching by ${criteriaText}: "${inputValue}"`);

        // Ensure search input is ready
        await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });

        // Open dropdown
        await this.searchByTrigger.click();
        await this.page.waitForTimeout(500);

        // Select criteria
        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(300);

        // Clear and fill
        await this.searchInput.clear();
        await this.page.waitForTimeout(200);
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

    async verifySearchOnbatchschedulingPage() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ Navigate to Batch Scheduling if not already there
        if (!currentUrl.includes('batch-scheduling')) {
            console.log("📂 Navigating to Batch Scheduling...");
            
            const sidebar = this.page.locator('div.fixed-left-sidebar');
            await sidebar.waitFor({ state: 'visible', timeout: 10000 });
            
            await this.batchSchedulingNav.waitFor({ state: 'visible', timeout: 15000 });
            await this.batchSchedulingNav.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.batchSchedulingNav.click();
            console.log("✅ Clicked Batch Scheduling");

            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log("✅ Already on Batch Scheduling page");
        }

        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // Get first valid job (deterministic)
        const { jobName, createdBy } = await this.getFirstValidJob();
        console.log(`🎯 Selected Job:
        Job Name: ${jobName}
        Created By: ${createdBy}`);

        // Search by Job Name
        await this.performSearch("Job Name", jobName);
        await this.validateSearchResult(jobName, 0, "Job Name");

        // Search by Created By
        await this.performSearch("Created By", createdBy);
        await this.validateSearchResult(createdBy, 2, "Created By");

        console.log("🎉 All Batch Scheduling searches completed successfully!");
    }
}

module.exports = { BatchSchedulingSearch };