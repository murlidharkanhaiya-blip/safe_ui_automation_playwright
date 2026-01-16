const { expect } = require('@playwright/test');

class ActivateDeactivateBatchSchedulingJob {
  constructor(page) {
    this.page = page;

    // Sidebar navigation
    this.sidebar = page.locator('.fixed-left-sidebar');
    this.batchSchedulingLink = page.locator(
      ".fixed-left-sidebar a[data-testid='nav-link']:has-text('Batch Scheduling')"
    );

    // Monthly Mail label row
    this.monthlyMailRow = page.locator(
      'div[data-testid="job-list-item__label"]',
      { hasText: 'Monthly Mail' }
    );

    // Toggle switch
    this.monthlyMailSwitch = this.monthlyMailRow
      .locator('xpath=following::div[contains(@class,"react-switch-bg")]')
      .first();

    // Confirm button
    this.confirmButton = page.getByRole('button', { name: 'CONFIRM' });
  }

  async setMonthlyMail() {
    // 1️⃣ Navigate to Batch Scheduling
    await expect(this.sidebar).toBeVisible({ timeout: 20000 });
    await this.batchSchedulingLink.click();
    await this.page.waitForLoadState('networkidle');

    // 2️⃣ Ensure toggle is visible
    await expect(this.monthlyMailSwitch).toBeVisible({ timeout: 20000 });
    await this.monthlyMailSwitch.scrollIntoViewIfNeeded();

    // 3️⃣ Detect current state using background color
    const initialColor = await this.monthlyMailSwitch.evaluate(
      el => getComputedStyle(el).backgroundColor
    );

    const isOn = initialColor === 'rgb(0, 136, 0)';

    // ---------- ACTIVATE (only if OFF) ----------
    if (!isOn) {
      await this.monthlyMailSwitch.click({ force: true });

      await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
      await this.confirmButton.click();

      await expect(this.monthlyMailSwitch).toHaveCSS(
        'background-color',
        'rgb(0, 136, 0)',
        { timeout: 20000 }
      );

      // Backend sync buffer
      await this.page.waitForTimeout(2000);
    }

    // ---------- DEACTIVATE ----------
    await this.monthlyMailSwitch.click({ force: true });

    await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
    await this.confirmButton.click();

    await expect(this.monthlyMailSwitch).toHaveCSS(
      'background-color',
      'rgb(136, 136, 136)',
      { timeout: 20000 }
    );

    await this.page.waitForTimeout(2000);

    // ---------- RE-ACTIVATE ----------
    await this.monthlyMailSwitch.click({ force: true });

    await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
    await this.confirmButton.click();

    await expect(this.monthlyMailSwitch).toHaveCSS(
      'background-color',
      'rgb(0, 136, 0)',
      { timeout: 20000 }
    );

    // Final settle wait
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { ActivateDeactivateBatchSchedulingJob };
