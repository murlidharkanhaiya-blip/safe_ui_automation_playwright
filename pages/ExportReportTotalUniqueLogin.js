const { expect } = require('@playwright/test');

class ExportReportTotalUniqueLogin {
  constructor(page) {
    this.page = page;

    // Locators
    this.cardContainer = 'div.recharts-wrapper';
    this.exporticon = "(//button[@data-testid='export-report'])[1]";
    this.csvbutton = "(//a[normalize-space()='CSV'])[1]";
    this.successToast = "//div[contains(text(),'Report has been sent to your email.')]";
  }

  async waitForTotalUniqueLoginCard(timeout = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const cards = this.page.locator(this.cardContainer);

      const count = await cards.count();
      if (count === 0) {
        await this.page.waitForTimeout(1000);
        continue;
      }

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const text = (await card.innerText()).trim();

        if (text.includes('Total Unique Login')) {
          await card.scrollIntoViewIfNeeded();
          return card;
        }
      }

      // UI loaded but data not yet populated
      await this.page.waitForTimeout(1500);
    }

    throw new Error('❌ Total Unique Login card did not load with data within timeout');
  }

  async verifyexportreportontotaluniqueloginpage() {
    await this.page.waitForLoadState('networkidle');

    // Step 1: Wait & click Total Unique Login card safely
    const card = await this.waitForTotalUniqueLoginCard();
    await expect(card).toBeVisible();
    await card.click();

    // Step 2: Click Export > CSV
    await this.page.locator(this.exporticon).waitFor({ state: 'visible' });
    await this.page.locator(this.exporticon).click();
    await this.page.locator(this.csvbutton).click();

    // Step 3: Verify success toast
    const toast = this.page.locator(this.successToast);
    await toast.waitFor({ state: 'visible', timeout: 15000 });

    // Step 4: Screenshot
    await this.page.screenshot({
      path: 'export_success_toast.png',
      fullPage: true
    });

    console.log("✅ Export success message appeared and screenshot taken.");
  }
}

module.exports = { ExportReportTotalUniqueLogin };