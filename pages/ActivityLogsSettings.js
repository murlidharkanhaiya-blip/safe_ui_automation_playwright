const { expect } = require('@playwright/test');

class ActivityLogsSettings {
  constructor(page) {
    this.page = page;

    /* ===== SIDEBAR ===== */
    this.sidebar = this.page.locator(".fixed-left-sidebar").first();

    // Settings icon (inside correct container)
    this.settingsIcon = this.page
      .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
      .first();

    /* ===== TAB ===== */
    this.activitylogsSettingsTab = this.page.locator(
      "//span[normalize-space()='Activity Logs Settings']"
    );

    /* ===== TOGGLES & INPUT ===== */
    this.ScreenshotCapturingtoggle = this.page.locator("(//div[@class='react-switch-bg'])[1]");
    this.ScreenshotCapturinginterval = this.page.locator('#screenshot_capture_interval');

    this.screenshotrenderingtoggle = this.page.locator("(//div[@class='react-switch-bg'])[2]");
    this.NSFWPIIDetection = this.page.locator("(//div[@class='react-switch-bg'])[3]");
    this.activitylogs = this.page.locator("(//div[@class='react-switch-bg'])[4]");
    this.webhistorytracking = this.page.locator("(//div[@class='react-switch-bg'])[5]");

    /* ===== BUTTONS ===== */
    this.saveButton = this.page.locator('.button-box__button.submit');
    this.confirmSaveButton = this.page.locator("//button[normalize-space()='SAVE']");

    /* ===== LOADER ===== */
    this.loader = this.page.locator('#global-loader-container .loading');
  }

  /* ================= LOADER HELPERS ================= */

  async waitForLoaderToDisappear() {
    await this.loader
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});
  }

  async waitForLoaderStable() {
    if (await this.loader.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  /* ================= FIELD HELPERS ================= */

  // Robust toggle click for general toggles
  async clickToggleProperly(toggle) {
    await toggle.waitFor({ state: 'visible', timeout: 20000 });
    await toggle.scrollIntoViewIfNeeded();

    const box = await toggle.boundingBox();
    if (box) {
      await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    // Small wait to let React update the input
    await this.page.waitForTimeout(300);
  }

  // Enable toggle if its input is disabled
  async enableToggleIfInputDisabled(toggle, input) {
    await toggle.waitFor({ state: 'visible', timeout: 20000 });
    await toggle.scrollIntoViewIfNeeded();

    if (await input.isDisabled()) {
      await this.clickToggleProperly(toggle);
    }

    await expect(input).toBeEnabled({ timeout: 20000 });
  }

  // Special helper for Screenshot Capturing toggle + input
 async enableScreenshotCapture(toggle, input, value) {
    await toggle.waitFor({ state: 'visible', timeout: 20000 });
    await toggle.scrollIntoViewIfNeeded();

    // Retry click up to 3 times if input is still disabled
    for (let attempt = 1; attempt <= 3; attempt++) {
        const handle = await toggle.elementHandle();
        if (handle) {
            await this.page.evaluate((el) => el.click(), handle);
        }

        // Wait a short time for React state to update
        await this.page.waitForTimeout(500);

        // Check if input is enabled
        if (await input.isEnabled()) break;

        console.log(`Attempt ${attempt}: ScreenshotCapturing input not enabled yet, retrying...`);
        await this.page.waitForTimeout(500);
    }

    // Final check
    await expect(input).toBeEnabled({ timeout: 20000 });

    // Fill the interval
    await input.fill(String(value));
    await this.page.waitForTimeout(300); // small wait for React to register
}



  async clearAndFillEnabledInput(input, value) {
    await input.waitFor({ state: 'visible', timeout: 20000 });
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeEnabled({ timeout: 20000 });

    await input.fill(String(value));
  }

  async clickToggle(toggle) {
    // Normal click for toggles that work without React issues
    await toggle.waitFor({ state: 'visible', timeout: 20000 });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click({ force: true });
  }

  /* ================= MAIN FLOW ================= */

  async verifyActivitylogssettings() {
    /* ---- PAGE READY ---- */
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoaderToDisappear();

    // --- Scroll Sidebar to show settings icon ---
    await this.sidebar.waitFor({ state: 'visible', timeout: 20000 });

    // Scroll sidebar container
    await this.sidebar.evaluate(el => el.scrollTop = el.scrollHeight);

    // Small wait for DOM repaint
    await this.page.waitForTimeout(500);

    // Force click settings icon
    await this.settingsIcon.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoaderToDisappear();

    /* ---- ACTIVITY LOGS TAB ---- */
    await this.activitylogsSettingsTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.activitylogsSettingsTab.scrollIntoViewIfNeeded();
    await this.activitylogsSettingsTab.click({ force: true });

    await this.waitForLoaderToDisappear();

    /* ---- BUSINESS GROUP ---- */
    const businessGroupDropdown = this.page.locator(
      "(//div[contains(@class,'inputBoxDiv ellipsis')])[1]"
    );

    await businessGroupDropdown.waitFor({ state: 'visible', timeout: 20000 });
    await businessGroupDropdown.scrollIntoViewIfNeeded();
    await businessGroupDropdown.click({ force: true });

    const trustedOption = this.page.locator('text=Trusted');
    await trustedOption.waitFor({ state: 'visible', timeout: 10000 });
    await trustedOption.click({ force: true });

    await this.page.keyboard.press('Escape');

    /* ---- SCREENSHOT CAPTURE ---- */
    await this.enableScreenshotCapture(
      this.ScreenshotCapturingtoggle,
      this.ScreenshotCapturinginterval,
      20
    );

    /* ---- OTHER TOGGLES ---- */
    await this.clickToggleProperly(this.screenshotrenderingtoggle);
    await this.clickToggleProperly(this.NSFWPIIDetection);
    await this.clickToggleProperly(this.activitylogs);
    await this.clickToggleProperly(this.webhistorytracking);

    /* ---- SAVE ---- */
    await this.waitForLoaderStable();

    await expect(this.saveButton).toBeVisible({ timeout: 20000 });
    await expect(this.saveButton).toBeEnabled({ timeout: 20000 });

    await this.saveButton.click();

    await this.waitForLoaderStable();

    /* ---- CONFIRM SAVE ---- */
    await this.confirmSaveButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.confirmSaveButton.click();

    await this.waitForLoaderStable();
  }
}

module.exports = { ActivityLogsSettings };
