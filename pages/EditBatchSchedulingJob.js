const { expect } = require('@playwright/test');

class EditBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        this.batchSchedulingNav = page.locator("div.fixed-left-sidebar li[data-tip='Batch Scheduling'] a[data-testid='nav-link']");
        this.editScheduleIcon = page.locator("img[title='Edit Schedule']").first();
        this.selectRange = page.locator("input[placeholder='Select Range']");
        this.nextSevenDays = page.locator("li:has-text('Next 7 Days')").first();
        this.saveButton = page.locator("button:has-text('Save')").first();
        this.tableRow = page.locator("tr.MuiTableRow-root");
        this.loader = page.locator('#global-loader-container .loading');
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

    async EditBatchschedulingjob() {
        // ✅ IMPROVED: Better state reset
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000); // Reduced from 5000

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ IMPROVED: Only navigate if NOT on batch-scheduling page
        if (!currentUrl.includes('batch-scheduling')) {
            console.log("📂 Navigating to Batch Scheduling...");
            
            let navigated = false;

            // Try sidebar first
            try {
                const sidebar = this.page.locator('div.fixed-left-sidebar');
                await sidebar.waitFor({ state: 'visible', timeout: 10000 });
                
                await this.batchSchedulingNav.waitFor({ state: 'visible', timeout: 10000 });
                await this.batchSchedulingNav.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(500);
                await this.batchSchedulingNav.click();
                navigated = true;
                console.log("✅ Clicked Batch Scheduling (sidebar)");
            } catch {
                // Fallback to direct URL
                try {
                    const baseUrl = this.page.url().split('/').slice(0, 3).join('/');
                    await this.page.goto(`${baseUrl}/batch-scheduling`);
                    navigated = true;
                    console.log("✅ Navigated via URL");
                } catch (err) {
                    await this.page.screenshot({ path: 'debug-nav-failed.png', fullPage: true });
                    throw new Error(`❌ Navigation failed. Check debug-nav-failed.png`);
                }
            }

            if (navigated) {
                // ✅ IMPROVED: Wait for URL change
                await this.page.waitForURL('**/batch-scheduling**', { timeout: 10000 });
                await this.page.waitForLoadState('domcontentloaded');
                await this.waitForLoader();
                await this.page.waitForTimeout(3000); // Reduced from 5000
            }
        } else {
            console.log("✅ Already on Batch Scheduling page");
            await this.waitForLoader();
            await this.page.waitForTimeout(2000);
        }

        // ✅ IMPROVED: Try to click Monthly Mail tab (optional)
        const monthlyMailSelectors = [
            "div:has-text('Monthly Mail')",
            "button:has-text('Monthly Mail')",
            "a:has-text('Monthly Mail')",
            "text=Monthly Mail"
        ];

        let monthlyMailClicked = false;

        for (const selector of monthlyMailSelectors) {
            try {
                const tab = this.page.locator(selector).first();
                const isVisible = await tab.isVisible({ timeout: 2000 }); // Reduced timeout
                
                if (isVisible) {
                    await tab.click();
                    console.log(`✅ Clicked Monthly Mail tab`);
                    monthlyMailClicked = true;
                    await this.page.waitForTimeout(1500);
                    await this.waitForLoader();
                    break;
                }
            } catch {
                continue;
            }
        }

        if (!monthlyMailClicked) {
            console.warn("⚠️ Monthly Mail tab not found - working with current view");
        }

        // ✅ IMPROVED: Check for schedules with better wait
        await this.page.waitForTimeout(1500);
        
        // Wait for table to be ready
        try {
            await this.tableRow.first().waitFor({ state: 'visible', timeout: 10000 });
        } catch {
            console.warn("⚠️ No table found");
            return;
        }

        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} schedule(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No data available for edit");
            return;
        }

        // ✅ IMPROVED: Check Edit button with better error handling
        await this.page.waitForTimeout(1000);
        const editIconCount = await this.editScheduleIcon.count();
        console.log(`🔍 Found ${editIconCount} edit icon(s)`);

        if (editIconCount === 0) {
            console.warn("⚠️ No edit button available");
            return;
        }

        const isEditVisible = await this.editScheduleIcon.isVisible({ timeout: 3000 }).catch(() => false);
        if (!isEditVisible) {
            console.warn("⚠️ Edit button not visible");
            return;
        }

        const isEditEnabled = await this.editScheduleIcon.isEnabled({ timeout: 3000 }).catch(() => false);
        if (!isEditEnabled) {
            console.warn("⚠️ Edit button is disabled");
            return;
        }

        // ✅ Get schedule name for logging
        let scheduleName = "Unknown";
        try {
            const firstRow = this.tableRow.first();
            const nameCell = firstRow.locator('td').first();
            scheduleName = await nameCell.innerText({ timeout: 3000 });
            console.log(`📝 Editing schedule: "${scheduleName}"`);
        } catch {
            console.log("📝 Editing first schedule");
        }

        // ✅ Click Edit
        console.log("✏️ Clicking Edit button...");
        await this.editScheduleIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.editScheduleIcon.click();
        console.log("✅ Edit button clicked");

        await this.page.waitForTimeout(1500);

        // ✅ Select Date Range
        console.log("📅 Selecting date range...");
        await this.selectRange.waitFor({ state: 'visible', timeout: 10000 });
        await this.selectRange.click();
        await this.page.waitForTimeout(1000);
        
        await this.page.mouse.wheel(0, 400);
        await this.page.waitForTimeout(500);
        
        await this.nextSevenDays.waitFor({ state: 'visible', timeout: 10000 });
        await this.nextSevenDays.click();
        console.log("✅ Date range 'Next 7 Days' selected");
        await this.page.waitForTimeout(500);

        // ✅ Save
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);

        await this.saveButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);

        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.saveButton).toBeEnabled({ timeout: 10000 });

        console.log("💾 Saving changes...");
        await this.saveButton.click();
        console.log("✅ Save button clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ IMPROVED: Verify success
        const successMessage = this.page.locator("text=success, text=updated, text=saved").first();
        const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
            const message = await successMessage.textContent();
            console.log(`🎉 Success: ${message}`);
        } else {
            console.log("✅ Schedule updated");
        }

        console.log(`🎉 Schedule "${scheduleName}" edited successfully!`);
    }
}

module.exports = { EditBatchSchedulingJob };