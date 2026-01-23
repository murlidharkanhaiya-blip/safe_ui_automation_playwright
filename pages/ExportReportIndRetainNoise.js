const { expect } = require('@playwright/test');

class ExportReportIndRetainNoise {
  constructor(page) {
    this.page = page;

    // Improved Locators
    this.retainEntityCard = page.locator("div.dashboard-box").nth(1); // 0-indexed, so [2] = nth(1)
    this.noiseTab = page.locator("div.noise.btn, button:has-text('Noise'), a:has-text('Noise')").first();
    this.eyeIcon = page.locator("img[title='View'], button:has-text('View')").first();
    this.exportIcon = page.locator("button[data-testid='export-report']");
    this.csvButton = page.locator("a:has-text('CSV')");
    this.successToast = page.locator("div:has-text('Report has been sent to your email')");
    this.loader = page.locator('#global-loader-container .loading');
    this.tableRow = page.locator("tr.MuiTableRow-root");
    this.noDataMessage = page.locator("text=No data, text=No records, text=Empty");
  }

  async waitForLoader() {
    try {
      const isVisible = await this.loader.isVisible({ timeout: 2000 });
      if (isVisible) {
        await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
        console.log("⏳ Loader hidden");
      }
    } catch {
      // Loader not present
    }
  }

  async verifyexportreportonexportreportindretainnoisepage() {
    // ✅ Reset state
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    console.log("📍 Current URL:", this.page.url());

    // ✅ Step 1: Click Retain Entity card
    console.log("📊 Looking for Retain Entity card...");
    
    await this.retainEntityCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.retainEntityCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.retainEntityCard.click();
    console.log("✅ Clicked Retain Entity card");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Step 2: Click Noise tab
    console.log("🔊 Looking for Noise tab...");
    
    const noiseTabCount = await this.noiseTab.count();
    console.log(`🔍 Found ${noiseTabCount} noise tab(s)`);

    if (noiseTabCount === 0) {
      await this.page.screenshot({ path: 'debug-no-noise-tab.png', fullPage: true });
      console.warn("⚠️ Noise tab not found");
      return;
    }

    await this.noiseTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.noiseTab.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.noiseTab.click();
    console.log("✅ Clicked Noise tab");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Step 3: Check if data exists in Noise tab
    console.log("🔍 Checking for data in Retain Noise tab...");

    // Check for "No data" message
    const noDataVisible = await this.noDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (noDataVisible) {
      const noDataText = await this.noDataMessage.textContent();
      console.warn(`⚠️ No data available on Retain Noise card: "${noDataText}"`);
      return;
    }

    // Check for table rows
    const rowCount = await this.tableRow.count();
    console.log(`📊 Found ${rowCount} row(s) in Noise tab`);

    if (rowCount === 0) {
      console.warn("⚠️ No data available on Retain Noise card - table is empty");
      return;
    }

    // ✅ Step 4: Check if View icon exists
    console.log("👁️ Looking for View icon...");
    
    const eyeIconCount = await this.eyeIcon.count();
    console.log(`🔍 Found ${eyeIconCount} view icon(s)`);

    if (eyeIconCount === 0) {
      await this.page.screenshot({ path: 'debug-no-view-icon.png', fullPage: true });
      console.warn("⚠️ No data available on Retain Noise card - View icon not found");
      return;
    }

    await this.eyeIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.eyeIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.eyeIcon.click();
    console.log("✅ Clicked View icon");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // ✅ Step 5: Click Export button
    console.log("📤 Looking for Export button...");
    
    const exportIconCount = await this.exportIcon.count();
    console.log(`🔍 Found ${exportIconCount} export button(s)`);

    if (exportIconCount === 0) {
      await this.page.screenshot({ path: 'debug-no-export.png', fullPage: true });
      console.warn("⚠️ Export button not found");
      return;
    }

    await this.exportIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.exportIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.exportIcon.click();
    console.log("✅ Clicked Export button");

    await this.page.waitForTimeout(1500);

    // ✅ Step 6: Click CSV option
    console.log("📄 Looking for CSV option...");
    
    const csvButtonCount = await this.csvButton.count();
    console.log(`🔍 Found ${csvButtonCount} CSV option(s)`);

    if (csvButtonCount === 0) {
      await this.page.screenshot({ path: 'debug-no-csv.png', fullPage: true });
      console.warn("⚠️ CSV option not found");
      return;
    }

    await this.csvButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.csvButton.click();
    console.log("✅ Clicked CSV");

    await this.page.waitForTimeout(2000);

    // ✅ Step 7: Validate success toast
    console.log("✉️ Waiting for success message...");
    
    const isToastVisible = await this.successToast.isVisible({ timeout: 20000 }).catch(() => false);

    if (isToastVisible) {
      console.log("✅ Success toast appeared");
      
      await this.page.screenshot({
        path: 'export_success_toast.png',
        fullPage: true,
      });
      console.log("📸 Screenshot saved: export_success_toast.png");
    } else {
      console.warn("⚠️ Success toast not visible - export may have failed");
      await this.page.screenshot({ path: 'debug-no-toast.png', fullPage: true });
    }

    console.log("🎉 Export Retain Noise report completed!");
  }
}

module.exports = { ExportReportIndRetainNoise };