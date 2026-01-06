const { expect } = require('@playwright/test');

class ActivateDeactivateBatchSchedulingJob {
  constructor(page) {
    this.page = page;

    // Sidebar navigation
    this.sidebar = page.locator('.fixed-left-sidebar');
    this.batchSchedulingLink = page.locator(
      ".fixed-left-sidebar a[data-testid='nav-link']:has-text('Batch Scheduling')"
    );

    // Monthly Mail label
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
    // 1️⃣ Navigate
    await expect(this.sidebar).toBeVisible({ timeout: 20000 });
    await this.batchSchedulingLink.click();
    await this.page.waitForLoadState('networkidle');

    // 2️⃣ Ensure switch visible
    await expect(this.monthlyMailSwitch).toBeVisible({ timeout: 20000 });
    await this.monthlyMailSwitch.scrollIntoViewIfNeeded();

    // ---------- ACTIVATE ----------
    const colorBefore = await this.monthlyMailSwitch.evaluate(
      el => getComputedStyle(el).backgroundColor
    );

    const isOn = colorBefore === 'rgb(0, 136, 0)';

    if (!isOn) {
      // Click switch
      await this.monthlyMailSwitch.click({ force: true });

      // Wait & click CONFIRM (NO TEXT VALIDATION)
      await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
      await this.confirmButton.click();

      // Wait for ON state
      await expect(this.monthlyMailSwitch).toHaveCSS(
        'background-color',
        'rgb(0, 136, 0)',
        { timeout: 20000 }
      );

      // 🕒 Buffer wait (backend sync)
      await this.page.waitForTimeout(2000);
    }

    // ---------- DEACTIVATE ----------
    await this.monthlyMailSwitch.click({ force: true });

    await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
    await this.confirmButton.click();

    // Wait for OFF state
    await expect(this.monthlyMailSwitch).toHaveCSS(
      'background-color',
      'rgb(136, 136, 136)',
      { timeout: 20000 }
    );

    // 🕒 Final settle wait
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { ActivateDeactivateBatchSchedulingJob };
