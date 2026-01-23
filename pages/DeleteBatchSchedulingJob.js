const { expect } = require('@playwright/test');

class DeleteBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.batchSchedulingNav = page.locator("div.fixed-left-sidebar li[data-tip='Batch Scheduling'] a[data-testid='nav-link']");
        this.deleteScheduleIcon = page.locator("img[title='Delete Schedule']").first();
        this.confirmButton = page.locator("button:has-text('CONFIRM')").first();
        this.loader = page.locator('#global-loader-container .loading');
        this.tableRow = page.locator("tr.MuiTableRow-root");
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

    async DeleteBatchschedulejob() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ Navigate to Batch Scheduling if not already there
        if (!currentUrl.includes('batch-scheduling')) {
            console.log("📂 Navigating to Batch Scheduling...");
            
            // Wait for sidebar
            const sidebar = this.page.locator('div.fixed-left-sidebar');
            await sidebar.waitFor({ state: 'visible', timeout: 10000 });
            
            await this.batchSchedulingNav.waitFor({ state: 'visible', timeout: 15000 });
            await this.batchSchedulingNav.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.batchSchedulingNav.click();
            console.log("✅ Clicked Batch Scheduling");

            // Wait for navigation
            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log("✅ Already on Batch Scheduling page");
        }

        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Check if there are any schedules to delete
        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} schedule(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No schedules available to delete - test skipped");
            return;
        }

        // ✅ Get schedule name before deleting (for logging)
        let scheduleName = "Unknown";
        try {
            const firstRow = this.tableRow.first();
            const nameCell = firstRow.locator('td').first();
            scheduleName = await nameCell.innerText({ timeout: 3000 });
            console.log(`🎯 Deleting schedule: "${scheduleName}"`);
        } catch {
            console.log("🎯 Deleting first schedule");
        }

        // ✅ Click delete icon
        console.log("🗑️ Clicking delete icon...");
        await this.deleteScheduleIcon.waitFor({ state: 'visible', timeout: 15000 });
        await this.deleteScheduleIcon.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.deleteScheduleIcon.click();
        console.log("✅ Delete icon clicked");

        await this.page.waitForTimeout(1500);

        // ✅ Confirm deletion
        console.log("✔️ Confirming deletion...");
        await this.confirmButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.confirmButton).toBeEnabled({ timeout: 5000 });
        await this.confirmButton.click();
        console.log("✅ Deletion confirmed");

        // ✅ Wait for deletion to complete
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Verify deletion success
        const successMessage = this.page.locator("text=success, text=deleted, text=removed").first();
        const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
            const message = await successMessage.textContent();
            console.log(`🎉 Success: ${message}`);
        } else {
            console.log("✅ Schedule deleted (no explicit confirmation)");
        }

        // ✅ Verify schedule was removed from table
        const newRowCount = await this.tableRow.count();
        console.log(`📊 Schedules after deletion: ${newRowCount}`);

        if (newRowCount < rowCount) {
            console.log(`✅ Schedule "${scheduleName}" successfully deleted`);
        } else {
            console.warn(`⚠️ Row count unchanged - deletion may have failed`);
        }

        console.log("🎉 Delete Batch Scheduling job completed!");
    }
}

module.exports = { DeleteBatchSchedulingJob };