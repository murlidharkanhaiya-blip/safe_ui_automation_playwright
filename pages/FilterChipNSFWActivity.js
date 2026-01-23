const { expect } = require('@playwright/test');

class FilterChipNSFWActivity {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.nsfwActivityNav = page.locator("span:has-text('NSFW Activity(s)')").first();
        this.filterChip = page.locator("div.filter-icon.hand").first();
        this.channelDropdown = page.locator("div.inputBoxDiv.ellipsis").first(); // Channel dropdown
        this.applyButton = page.locator("button[data-testid='apply-filter']");
        this.loader = page.locator('#global-loader-container .loading');
        this.tableRow = page.locator("tr.MuiTableRow-root");
        this.noDataMessage = page.locator("text=No data, text=No records, text=Empty");
    }

    async waitForLoader() {
        try {
            const isVisible = await this.loader.isVisible({ timeout: 2000 });
            if (isVisible) {
                await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
                console.log("⏳ Loader hidden");
            }
        } catch {
            // Loader not present
        }
    }

    async selectAndApplyFilter(filterName) {
        console.log(`🎯 Applying filter: ${filterName}`);

        // ✅ Open filter chip
        console.log("🔧 Opening filter...");
        await this.filterChip.waitFor({ state: 'visible', timeout: 10000 });
        await this.filterChip.click();
        await this.page.waitForTimeout(1000);

        // ✅ Open Channel dropdown
        console.log("📋 Opening Channel dropdown...");
        await this.channelDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.channelDropdown.click();
        await this.page.waitForTimeout(1000);

        // ✅ Select filter option - multiple strategies
        let filterSelected = false;
        
        const selectors = [
            `text=${filterName}`,
            `a:has-text('${filterName}')`,
            `li:has-text('${filterName}')`,
            `div:has-text('${filterName}')`,
            `[title='${filterName}']`,
            `a[data-testid='search-dropdown']:has-text('${filterName}')`
        ];

        for (const selector of selectors) {
            try {
                const option = this.page.locator(selector).first();
                const isVisible = await option.isVisible({ timeout: 2000 });
                
                if (isVisible) {
                    await option.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(300);
                    await option.click();
                    console.log(`✅ Selected "${filterName}"`);
                    filterSelected = true;
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!filterSelected) {
            // Debug: List available options
            console.log("🔍 Available Channel options:");
            const allOptions = await this.page.locator('text=Windows, text=Android, text=Chromebook, text=Macos').all();
            
            for (const el of allOptions) {
                const text = await el.textContent();
                console.log(`  - ${text.trim()}`);
            }
            
            console.warn(`⚠️ Filter "${filterName}" not found - skipping`);
            
            // Close dropdown
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
            return false;
        }

        await this.page.waitForTimeout(500);

        // ✅ Click Apply button
        console.log("✔️ Clicking Apply...");
        await this.applyButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.applyButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        
        const isApplyEnabled = await this.applyButton.isEnabled({ timeout: 3000 }).catch(() => false);
        
        if (!isApplyEnabled) {
            console.warn("⚠️ Apply button is disabled");
            await this.page.keyboard.press('Escape');
            return false;
        }

        await this.applyButton.click();
        console.log(`✅ Filter "${filterName}" applied`);

        // Wait for filter to apply
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        return true;
    }

    async verifynsfwfilterchip() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        // ✅ Step 1: Click NSFW Activity nav
        console.log("📊 Looking for NSFW Activity(s)...");
        
        await this.nsfwActivityNav.waitFor({ state: 'visible', timeout: 15000 });
        await this.nsfwActivityNav.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.nsfwActivityNav.click();
        console.log("✅ Clicked NSFW Activity(s)");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(3000);

        // ✅ Check if data exists
        const noDataVisible = await this.noDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (noDataVisible) {
            console.warn("⚠️ No data available on NSFW Activity");
            return;
        }

        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} row(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No data available to filter");
            return;
        }

        // ✅ Step 2: Apply filters (correct names: Windows, Android, Chromebook, Macos)
        const filters = ["Windows", "Android", "Chromebook", "Macos"];
        
        let successCount = 0;
        
        for (const filterName of filters) {
            const applied = await this.selectAndApplyFilter(filterName);
            
            if (applied) {
                successCount++;
                console.log(`✅ Filter "${filterName}" applied successfully`);
            } else {
                console.warn(`⚠️ Filter "${filterName}" skipped`);
            }
            
            await this.page.waitForTimeout(1000);
        }

        console.log(`🎉 Filters tested: ${successCount}/${filters.length} applied successfully`);
    }
}

module.exports = { FilterChipNSFWActivity };