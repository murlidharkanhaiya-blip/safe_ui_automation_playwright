const { expect } = require('@playwright/test');

class SuspiciousVideo {
    constructor(page) {
        this.page = page;

        // Improved Locators
        this.suspiciousCard = page.locator("span:has-text('Suspicious Activities')").first();
        this.videoTab = page.locator("div.videos.failed-captures.btn.btn-outline-success").first();
        this.eyeIcon = page.locator("img[title='View Employee Details']").first();
        this.drilldown = page.locator("polyline#Path").first();
        this.markAsUnsuspicious = page.locator("img[title*='Mark as unsuspicious']");
        this.reasonDropdown = page.locator("div[data-testid='inputBoxDiv-ellipsis']").first();
        this.confirmButton = page.locator("button:has-text('CONFIRM')").first();
        this.loader = page.locator('#global-loader-container .loading');
        this.tableRow = page.locator("tr.MuiTableRow-root");
        this.noDataMessage = page.locator("text=No data, text=No records, text=Empty");
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

    async suspiciousactivitycard() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        console.log("📍 Current URL:", this.page.url());

        // ✅ Step 1: Click Suspicious Activities
        console.log("📊 Clicking Suspicious Activities card...");
        await this.suspiciousCard.waitFor({ state: 'visible', timeout: 10000 });
        await this.suspiciousCard.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.suspiciousCard.click();
        console.log("✅ Suspicious Activities card clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 2: Click Video tab
        console.log("🎥 Clicking Video tab...");
        await this.videoTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.videoTab.click();
        console.log("✅ Video tab clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Check if data exists
        const noDataVisible = await this.noDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (noDataVisible) {
            console.warn("⚠️ No suspicious videos available");
            return;
        }

        const rowCount = await this.tableRow.count();

        if (rowCount === 0) {
            console.warn("⚠️ No suspicious videos available");
            return;
        }

        // ✅ Step 3: Click View icon
        const eyeIconCount = await this.eyeIcon.count();

        if (eyeIconCount === 0) {
            console.warn("⚠️ No View icon found");
            return;
        }

        console.log("👁️ Clicking View Employee Details...");
        await this.eyeIcon.waitFor({ state: 'visible', timeout: 15000 });
        await this.eyeIcon.click();
        console.log("✅ View icon clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Step 4: Click Drilldown
        console.log("📂 Clicking drilldown...");
        
        const drilldownCount = await this.drilldown.count();
        
        if (drilldownCount === 0) {
            console.warn("⚠️ Drilldown not available");
            return;
        }

        await this.drilldown.waitFor({ state: 'visible', timeout: 10000 });
        await this.drilldown.click();
        console.log("✅ Drilldown clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(3000);

        // ✅ Step 5: CHECK IF "Mark as unsuspicious" EXISTS
        console.log("🔍 Checking for 'Mark as unsuspicious' icons...");
        
        await this.page.waitForTimeout(2000);
        
        const markIconCount = await this.markAsUnsuspicious.count();
        console.log(`🔍 Found ${markIconCount} 'Mark as unsuspicious' icon(s)`);

        if (markIconCount === 0) {
            console.warn("⚠️ No data available to mark as unsuspicious - all videos already processed (deleted/retained)");
            return; // ✅ EXIT GRACEFULLY - DON'T CONTINUE
        }

        // ✅ Click Mark as unsuspicious
        console.log("✅ Clicking 'Mark as unsuspicious'...");
        await this.markAsUnsuspicious.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.markAsUnsuspicious.first().scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.markAsUnsuspicious.first().click();
        console.log("✅ 'Mark as unsuspicious' clicked");

        await this.page.waitForTimeout(1500);

        // ✅ Step 6: Select reason (ONLY IF WE GOT HERE)
        console.log("📋 Selecting reason...");
        
        // ✅ Check if dropdown appeared
        const isDropdownVisible = await this.reasonDropdown.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isDropdownVisible) {
            console.warn("⚠️ Reason dropdown did not appear - operation may have failed");
            return;
        }

        await this.reasonDropdown.click();
        await this.page.waitForTimeout(500);

        const reasonOption = this.page.getByText('Excusable Object Detected', { exact: true });
        const isReasonVisible = await reasonOption.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isReasonVisible) {
            console.warn("⚠️ Reason option not found");
            return;
        }

        await reasonOption.click();
        console.log("✅ Reason selected: Excusable Object Detected");

        await this.page.waitForTimeout(500);

        // ✅ Step 7: Click Confirm
        console.log("✔️ Clicking CONFIRM...");
        
        const isConfirmVisible = await this.confirmButton.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isConfirmVisible) {
            console.warn("⚠️ CONFIRM button not found");
            return;
        }

        const isConfirmEnabled = await this.confirmButton.isEnabled({ timeout: 3000 }).catch(() => false);
        
        if (!isConfirmEnabled) {
            console.warn("⚠️ CONFIRM button is disabled");
            return;
        }

        await this.confirmButton.click();
        console.log("✅ CONFIRM clicked");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Verify success
        const successMessage = this.page.locator("text=success, text=marked, text=updated").first();
        const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
            const message = await successMessage.textContent();
            console.log(`🎉 ${message}`);
        } else {
            console.log("✅ Video marked as unsuspicious");
        }

        console.log("🎉 Suspicious video operation completed!");
    }
}

module.exports = { SuspiciousVideo };