const { expect } = require('@playwright/test');

class EmployeeExmpted {
  constructor(page) {
    this.page = page;

    /* ===== DASHBOARD CARD ===== */
    this.totalUniqueCard = "div.recharts-wrapper";

    /* ===== ACTION ICON ===== */
    this.exemptedIcon = page.locator("(//img[@title='Exempt Employee'])[1]");

    /* ===== EXEMPTION FLOW ===== */
    this.exemptionReason = page.locator("(//div[contains(@data-testid,'inputBoxDiv-ellipsis')])[1]");
    this.exemptedBtn = page.locator("(//button[normalize-space()='EXEMPT EMPLOYEE'])[1]");

    /* ===== GLOBAL LOADER (FIXED) ===== */
    this.globalLoader = page.locator('#global-loader-container >> .loading');
  }

  /* ================= DASHBOARD CARD WAIT ================= */
  async waitForTotalUniqueLoginCard(timeout = 45000) {
    const start = Date.now();
    const cards = this.page.locator(this.totalUniqueCard);

    while (Date.now() - start < timeout) {
      const count = await cards.count();

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);

        // Card must be visible
        if (!(await card.isVisible().catch(() => false))) continue;

        // Card must contain SVG chart data
        const svgCount = await card.locator(
          'svg path, svg rect, svg circle'
        ).count();

        if (svgCount > 0) {
          await card.scrollIntoViewIfNeeded();
          return card;
        }
      }

      // Data not yet bound
      await this.page.waitForTimeout(2000);
    }

    throw new Error('❌ Total Unique Login card loaded but chart data never appeared');
  }

  /* ================= SAFE LOADER HANDLER ================= */
  async waitForLoaderToDisappear(timeout = 20000) {
    if (await this.globalLoader.isVisible().catch(() => false)) {
      await this.globalLoader.waitFor({ state: 'hidden', timeout });
    }
  }

  /* ================= MAIN TEST ================= */
  async verifyexmptedemployee() {
    await this.page.waitForLoadState('networkidle');

    await this.waitForLoaderToDisappear();

    /* ----- Click Total Unique Login card ----- */
    const card = await this.waitForTotalUniqueLoginCard();
    await card.click();

    await this.waitForLoaderToDisappear();

    /* ----- Click Exempt Employee icon (stable) ----- */
    await this.exemptedIcon.waitFor({ state: 'attached', timeout: 15000 });
    await this.exemptedIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await this.exemptedIcon.click();

    /* ----- Select Exemption Reason ----- */
    await this.exemptionReason.waitFor({ state: 'visible', timeout: 10000 });
    await this.exemptionReason.click();

    const dropdown = this.page.locator("div.conversationBotListDropdown");
    const faceObscured = dropdown.locator("a:has-text('Face Obscured')");

    await faceObscured.waitFor({ state: 'visible', timeout: 10000 });
    await faceObscured.click();

    /* ----- Click EXEMPT EMPLOYEE button ----- */
    await this.exemptedBtn.waitFor({ state: 'attached', timeout: 15000 });
    await this.exemptedBtn.scrollIntoViewIfNeeded();

    try {
      await this.exemptedBtn.click({ timeout: 5000 });
    } catch {
      // Fallback for overlay / re-render
      const handle = await this.exemptedBtn.elementHandle();
      await this.page.evaluate(btn => btn.click(), handle);
    }

    console.log("✅ Employee exempted successfully!");
  }
}

module.exports = { EmployeeExmpted };
