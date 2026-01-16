const { expect } = require('@playwright/test');

class ExportReportIndiExcusedVideo {
  constructor(page) {
    this.page = page;

   this.excusedentityCard = page.locator('.dashboard-box:has-text("Excused Entities")');
   this.loader = page.locator('#global-loader-container');  

   // Optional overlay locator
        this.overlay = this.page.locator("//div[contains(@class,'overlay')]");

    /* Tabs */
    this.videotab = page.locator(
      "//div[contains(@class,'videos') and contains(@class,'failed-captures')]"
    );

    /* Action + Export */
    this.actionicon = page.locator("//img[@title='View']").first();
    this.exporticon = page.locator("//button[@data-testid='export-report']").first();
    this.csvbutton = page.locator("//a[normalize-space()='CSV']");

    /* Toast */
    this.successToast = page.locator(
      "//div[contains(text(),'Report has been sent to your email')]"
    );
  }

  /* ------------------ UTILS ------------------ */

  async waitForLoader() {
    if (await this.loader.isVisible().catch(() => false)) {
      await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async waitForDashboardReady() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
  }

  /* ------------------ MAIN FLOW ------------------ */

  async verifyexportreportonexcusedindivideopage() {
    // Step 1: Navigate to excused entity
        await this.excusedentityCard.waitFor({ state: 'visible', timeout: 30000 });
        await this.excusedentityCard.click();
         await this.waitForLoader();

    /* Step 2: Confirm navigation + click Video tab */

// Wait for tabs container
await this.page.waitForSelector(
  "//div[contains(@class,'btn') or contains(@class,'tab')]",
  { timeout: 30000 }
);

// Click Video tab by text (most stable)
this.videotab = this.page.getByText(/video/i, { exact: false });

await expect(this.videotab.first()).toBeVisible({ timeout: 20000 });
await this.videotab.first().click();

await this.waitForLoader();

    /* Step 3: Click Action icon */
    await this.actionicon.waitFor({ state: 'visible', timeout: 20000 });
    await this.actionicon.click();

    /* Step 4: Export → CSV */
    await this.exporticon.waitFor({ state: 'visible', timeout: 15000 });
    await this.exporticon.click();

    await this.csvbutton.waitFor({ state: 'visible', timeout: 15000 });
    await this.csvbutton.click();

    /* Step 5: Validate success toast */
    await this.successToast.waitFor({ state: 'visible', timeout: 20000 });

    /* Step 6: Screenshot */
    await this.page.screenshot({
      path: 'export_success_toast.png',
      fullPage: true,
    });

    console.log('✅ Export success message appeared and screenshot taken.');
  }
}

module.exports = { ExportReportIndiExcusedVideo };
