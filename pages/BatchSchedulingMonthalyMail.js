const { expect } = require('@playwright/test');

class BatchSchedulingMonthalyMail {
    constructor(page) {
        this.page = page;

        this.batchschedulingnavbar = "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Batch Scheduling']//a[@data-testid='nav-link']";
       this.monthalymailbutton = this.page.locator("(//div[contains(text(),'Monthly Mail')])[1]");
        this.createnewscheduler = this.page.locator("(//button[normalize-space()='Create New scheduler'])[1]");
        this.SchedulerNameInput = page.locator("(//input[@id='scheduler_name'])[1]");
        this.selectrange = this.page.locator("//input[@placeholder='Select Range']");
        this.tomorrowdate = this.page.locator("//li[@data-range-key='Tomorrow']");

        // Dropdowns
        this.duration = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[1]");
        this.occurrences = this.page.locator("(//div[@class='inputBoxDiv ellipsis '])[2]");
        
        // ✅ Timezone dropdown container (not input)
        this.timezoneDropdown = this.page.locator("//div[contains(@class,'inputBoxDiv') and contains(., 'Select the time zone')]");

        this.timezoneOptions = this.page.locator("a[data-testid='dropdown-item']");

        this.savebutton = this.page.locator("(//button[normalize-space()='Save'])[1]");
    }

    async Batchschedulingjobmonthalymail() {
        // batch scheduling nav view click
         /* Step 1: Click batch scheduling (sidebar only) */
   const batchschedulingnav = this.page.locator(this.batchschedulingnavbar);
  await batchschedulingnav.waitFor({ state: 'visible', timeout: 15000 });
  await batchschedulingnav.click();

        await this.monthalymailbutton.click();
        await this.page.waitForTimeout(2000);

        await this.createnewscheduler.click();
        await this.page.waitForTimeout(1000);

        const schedulerName = `monthalymail_${Date.now()}`;
        await this.SchedulerNameInput.fill(schedulerName);
        console.log("✅ Scheduler Name filled");

        // Select range → Tomorrow
        await this.selectrange.click();
        await this.page.waitForTimeout(1000);
        await this.page.mouse.wheel(0, 400);
        await this.page.waitForTimeout(1000);
        await this.tomorrowdate.waitFor({ state: 'visible', timeout: 5000 });
        await this.tomorrowdate.click();
        console.log("✅ Date range 'Tomorrow' selected");
        // Duration → First option = Daily
        await this.duration.click();
        const durationOptions = this.page.locator("a[data-testid='dropdown-item']");
        await durationOptions.first().waitFor({ state: 'visible', timeout: 5000 });
        const firstDuration = durationOptions.first();
        console.log("Selecting Duration:", await firstDuration.textContent());
        await firstDuration.click();
        console.log("✅ Duration selected: Daily");

        // Occurrences → Second option = Twice
        await this.occurrences.click();
        const occurrenceOptions = this.page.locator("a[data-testid='dropdown-item']");
        await occurrenceOptions.nth(1).waitFor({ state: 'visible', timeout: 5000 });
        const secondOccurrence = occurrenceOptions.nth(1);
        console.log("Selecting Occurrence:", await secondOccurrence.textContent());
        await secondOccurrence.click();
        console.log("✅ Occurrences selected: Twice");

        // Scroll page to bottom first
await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await this.page.waitForTimeout(1000);

// Wait for the Timezone label to be visible

// Find the timezone input field
const timezoneLabel = this.page.locator("//div[contains(text(), 'Timezone')]");
await timezoneLabel.waitFor({ state: 'visible', timeout: 5000 });
await timezoneLabel.scrollIntoViewIfNeeded();

const timezoneInput = timezoneLabel.locator("..").locator("input[data-testid='inputControl-pointer']");
await timezoneInput.waitFor({ state: 'visible', timeout: 5000 });

// Click to open the timezone dropdown
await timezoneInput.click();
await this.page.waitForTimeout(1000);

// Try locating by any element containing the text
const option = this.page.locator("text=India Standard Time").first();
await option.waitFor({ state: 'visible', timeout: 5000 });
await option.click();
await this.page.waitForTimeout(1000);

const selectedValue = await timezoneInput.inputValue();
console.log("✅ Timezone selected:", selectedValue);

//const errorMessages = await this.page.locator(".error-message").allTextContents();
//console.log("Form errors:", errorMessages);

// Scroll to Save button
const saveButton = this.page.locator("(//button[normalize-space()='Save'])[1]");
await saveButton.scrollIntoViewIfNeeded();
await this.page.waitForTimeout(500);

// Wait until Save is enabled
await expect(saveButton).toBeVisible({ timeout: 10000 });
await expect(saveButton).toBeEnabled({ timeout: 10000 });

// Click Save
await saveButton.click();
console.log("✅ Save button clicked");


// Optionally, wait for navigation or success message
await this.page.waitForTimeout(2000);
    }
}

module.exports = { BatchSchedulingMonthalyMail };