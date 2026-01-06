const { expect } = require('@playwright/test');

class EmployeeExmptedResume {
  constructor(page) {
    this.page = page;

    this.totalUniqueCard = "div.recharts-wrapper";
    this.resumeIconSelector = "(//img[@title='Resume'])[1]";
    this.globalLoader = page.locator('#global-loader-container >> .loading');
  }

 async waitForTotalUniqueLoginCard(timeout = 45000) {
  const start = Date.now();
  const cards = this.page.locator("div.recharts-wrapper");

  while (Date.now() - start < timeout) {
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);

      // 1️⃣ Card must be visible
      if (!(await card.isVisible())) continue;

      // 2️⃣ Card must contain chart data (SVG elements)
      const hasChartData = await card.locator(
        'svg path, svg rect, svg circle'
      ).count();

      if (hasChartData > 0) {
        await card.scrollIntoViewIfNeeded();
        return card;
      }
    }

    // Data not yet bound, retry
    await this.page.waitForTimeout(2000);
  }

  throw new Error('❌ Total Unique Login card loaded but chart data never appeared');
}


  async verifyexmptedresumeemployee() {
    await this.page.waitForLoadState('networkidle');

    // Wait for loader
    if (await this.globalLoader.isVisible().catch(() => false)) {
      await this.globalLoader.waitFor({ state: 'hidden', timeout: 20000 });
    }

    // Click dashboard card
    const card = await this.waitForTotalUniqueLoginCard();
    await card.click();

    // Wait for navigation loader
    if (await this.globalLoader.isVisible().catch(() => false)) {
      await this.globalLoader.waitFor({ state: 'hidden', timeout: 20000 });
    }

    // Click Resume icon (stable)
    const resumeIcon = this.page.locator(this.resumeIconSelector);
    await resumeIcon.waitFor({ state: 'attached', timeout: 20000 });
    await resumeIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await resumeIcon.click();

    console.log("✅ Employee exempted resume action successful!");
  }
}

module.exports = { EmployeeExmptedResume };
