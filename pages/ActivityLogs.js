const { expect } = require('@playwright/test');

class ActivityLogs {
  constructor(page) {
    this.page = page;

    /* ✅ Sidebar Activity Logs nav — FINAL */
   this.activitylogNavViewLocator =
  "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Activity Logs']//a[@data-testid='nav-link']";


    /* View icon */
    this.activitylogsview = this.page.locator("(//img[@title='View'])[1]");

    /* Screenshot capture count */
  this.nbrofscreenshotcapture = this.page.locator(
  "//table//tbody//tr//td[4]//a[contains(@class,'telus-text-color')]"
);

    /* Download button */
    this.downloadall = this.page.locator("//button[normalize-space()='Download All']");
  }

  async verifyactivitylogsview() {
    /* Step 1: Click Activity Logs (sidebar only) */
   const activityLogsNav = this.page.locator(this.activitylogNavViewLocator);
  await activityLogsNav.waitFor({ state: 'visible', timeout: 15000 });
  await activityLogsNav.click();

  // Wait for loader if present
  const loader = this.page.locator('#global-loader-container >> .loading');
  if (await loader.isVisible({ timeout: 2000 }).catch(() => false)) {
    await loader.waitFor({ state: 'hidden', timeout: 15000 });
  }

    /* Step 2: Open View */
    await this.activitylogsview.waitFor({ state: 'visible', timeout: 10000 });
    await this.activitylogsview.click();

    //* Step 3: Open Screenshot Capture */

/* Step 3: Open Screenshot Capture */

// 1️⃣ Wait for table rows
await this.page.waitForSelector(
  "//table//tbody//tr",
  { state: "visible", timeout: 20000 }
);

// 2️⃣ Screenshot count locator (correct column)
this.nbrofscreenshotcapture = this.page.locator(
  "//table//tbody//tr//td[4]//a[contains(@class,'telus-text-color')]"
);

// 3️⃣ Ensure value exists
await expect(this.nbrofscreenshotcapture.first())
  .toBeVisible({ timeout: 15000 });

// 4️⃣ Click
await this.nbrofscreenshotcapture.first().click();

    /* Step 5: Download */
    await this.downloadall.waitFor({ state: 'visible', timeout: 10000 });
    await this.downloadall.scrollIntoViewIfNeeded();
    await this.downloadall.click();

    console.log('✅ A Zip File has been sent to your email');
  }
}

module.exports = { ActivityLogs };
