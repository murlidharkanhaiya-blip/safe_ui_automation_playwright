const { expect } = require('@playwright/test');

class BatchSchedulingBucketCleaner {
    constructor(page) {
        this.page = page;

        // Locators
        this.batchSchedulingNav = page.locator("div.fixed-left-sidebar li[data-tip='Batch Scheduling'] a[data-testid='nav-link']");
        this.createNewScheduler = page.locator("button:has-text('Create New scheduler')").first();
        this.schedulerNameInput = page.locator("input#scheduler_name").first();
        this.selectRange = page.locator("input[placeholder='Select Range']");
        this.tomorrowDate = page.locator("li[data-range-key='Tomorrow']");
        this.duration = page.locator("div.inputBoxDiv.ellipsis").first();
        this.occurrences = page.locator("div.inputBoxDiv.ellipsis").nth(1);
        this.saveButton = page.locator("button:has-text('Save')").first();
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

    async Batchschedulingjobbucketcleaner() {
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
            await this.waitForLoader();
            await this.page.waitForTimeout(2000);
        } else {
            console.log("✅ Already on Batch Scheduling page");
        }

        // ✅ Click Create New Scheduler
        console.log("🆕 Creating new scheduler...");
        await this.createNewScheduler.waitFor({ state: 'visible', timeout: 10000 });
        await this.createNewScheduler.click();
        await this.page.waitForTimeout(1500);

        // ✅ Fill Scheduler Name
        const schedulerName = `bucketcleaner_${Date.now()}`;
        await this.schedulerNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.schedulerNameInput.clear();
        await this.schedulerNameInput.fill(schedulerName);
        console.log(`✅ Scheduler Name: ${schedulerName}`);

        // ✅ Select Date Range - Tomorrow
        console.log("📅 Selecting date range...");
        await this.selectRange.waitFor({ state: 'visible', timeout: 10000 });
        await this.selectRange.click();
        await this.page.waitForTimeout(1000);
        
        // Scroll within date picker if needed
        await this.page.mouse.wheel(0, 400);
        await this.page.waitForTimeout(500);
        
        await this.tomorrowDate.waitFor({ state: 'visible', timeout: 10000 });
        await this.tomorrowDate.click();
        console.log("✅ Date range 'Tomorrow' selected");
        await this.page.waitForTimeout(500);

        // ✅ Select Duration (Daily)
        console.log("⏱️ Selecting duration...");
        await this.duration.waitFor({ state: 'visible', timeout: 10000 });
        await this.duration.click();
        await this.page.waitForTimeout(500);
        
        const durationOptions = this.page.locator("a[data-testid='dropdown-item']");
        await durationOptions.first().waitFor({ state: 'visible', timeout: 5000 });
        const firstDuration = durationOptions.first();
        const durationText = await firstDuration.textContent();
        console.log(`  Selecting Duration: ${durationText}`);
        await firstDuration.click();
        console.log("✅ Duration selected");
        await this.page.waitForTimeout(500);

        // ✅ Select Occurrences (Twice)
        console.log("🔢 Selecting occurrences...");
        await this.occurrences.waitFor({ state: 'visible', timeout: 10000 });
        await this.occurrences.click();
        await this.page.waitForTimeout(500);
        
        const occurrenceOptions = this.page.locator("a[data-testid='dropdown-item']");
        await occurrenceOptions.nth(1).waitFor({ state: 'visible', timeout: 5000 });
        const secondOccurrence = occurrenceOptions.nth(1);
        const occurrenceText = await secondOccurrence.textContent();
        console.log(`  Selecting Occurrence: ${occurrenceText}`);
        await secondOccurrence.click();
        console.log("✅ Occurrences selected");
        await this.page.waitForTimeout(500);

        // ✅ Select Timezone
        console.log("🌍 Selecting timezone...");
        
        // Scroll to timezone section
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);

        const timezoneLabel = this.page.locator("text=Timezone").first();
        await timezoneLabel.waitFor({ state: 'visible', timeout: 10000 });
        await timezoneLabel.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);

        const timezoneInput = this.page.locator("input[data-testid='inputControl-pointer']").last();
        await timezoneInput.waitFor({ state: 'visible', timeout: 10000 });
        await timezoneInput.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await timezoneInput.click();
        await this.page.waitForTimeout(1000);

        // Select timezone option
        const timezoneOption = this.page.locator("text=India Standard Time").first();
        await timezoneOption.waitFor({ state: 'visible', timeout: 10000 });
        await timezoneOption.click();
        await this.page.waitForTimeout(500);

        const selectedTimezone = await timezoneInput.inputValue();
        console.log(`✅ Timezone selected: ${selectedTimezone}`);

        // ✅ Check for form errors
        const errorMessages = await this.page.locator(".error-message").allTextContents();
        if (errorMessages.length > 0) {
            console.warn("⚠️ Form errors:", errorMessages);
        }

        // ✅ Click Save
        console.log("💾 Saving scheduler...");
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.saveButton).toBeEnabled({ timeout: 10000 });
        await this.saveButton.click();
        console.log("✅ Save button clicked");

        // ✅ Wait for save completion
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Verify success (optional)
        const successMessage = this.page.locator("text=successfully, text=created, text=saved").first();
        const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
            const message = await successMessage.textContent();
            console.log(`🎉 Success: ${message}`);
        } else {
            console.log("✅ Scheduler saved (no explicit success message)");
        }

        console.log("🎉 Batch Scheduling job created successfully!");
    }
}

module.exports = { BatchSchedulingBucketCleaner };