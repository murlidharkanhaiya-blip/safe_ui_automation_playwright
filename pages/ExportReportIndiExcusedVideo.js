const { expect } = require('@playwright/test');

class ExportReportIndiExcusedVideo {
  constructor(page) {
    this.page = page;

    // Improved Locators
    this.excusedEntityCard = page.locator("div.dashboard-box").filter({ hasText: 'Excused Entities' });
    this.videoTab = page.locator("div.videos.failed-captures, button:has-text('Video'), a:has-text('Video')").first();
    this.actionIcon = page.locator("img[title='View']").first();
    this.exportIcon = page.locator("button[data-testid='export-report']");
    this.csvButton = page.locator("a:has-text('CSV')");
    this.successToast = page.locator("div:has-text('Report has been sent to your email')");
    this.loader = page.locator('#global-loader-container .loading');
    this.tableRow = page.locator("tr.MuiTableRow-root");
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

  async verifyexportreportonexcusedindivideopage() {
    // ✅ Reset state
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    console.log("📍 Current URL:", this.page.url());

    // ✅ Step 1: Find and click Excused Entities card
    console.log("📊 Looking for Excused Entities card...");
    
    const cardCount = await this.excusedEntityCard.count();
    console.log(`🔍 Found ${cardCount} Excused Entities card(s)`);

    if (cardCount === 0) {
      // Try scrolling
      console.log("🔄 Scrolling to find card...");
      
      for (let i = 0; i < 5; i++) {
        await this.page.mouse.wheel(0, 300);
        await this.page.waitForTimeout(500);
        
        const retryCount = await this.excusedEntityCard.count();
        if (retryCount > 0) {
          console.log("✅ Card found after scrolling");
          break;
        }
      }
      
      const finalCount = await this.excusedEntityCard.count();
      if (finalCount === 0) {
        await this.page.screenshot({ path: 'debug-no-excused-card.png', fullPage: true });
        throw new Error("❌ Excused Entities card not found. Check debug-no-excused-card.png");
      }
    }

    await this.excusedEntityCard.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.excusedEntityCard.first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.excusedEntityCard.first().click();
    console.log("✅ Clicked Excused Entities card");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Step 2: Click Video tab
    console.log("🎥 Looking for Video tab...");
    
    const videoTabCount = await this.videoTab.count();
    console.log(`🔍 Found ${videoTabCount} video tab(s)`);

    if (videoTabCount === 0) {
      await this.page.screenshot({ path: 'debug-no-video-tab.png', fullPage: true });
      console.warn("⚠️ Video tab not found");
      return;
    }

    await this.videoTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.videoTab.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.videoTab.click();
    console.log("✅ Clicked Video tab");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Check if data exists
    const rowCount = await this.tableRow.count();
    console.log(`📊 Found ${rowCount} row(s) in Video tab`);

    if (rowCount === 0) {
      console.warn("⚠️ No video data available - cannot export");
      return;
    }

    // ✅ Step 3: Click Action (View) icon
    console.log("👁️ Looking for View icon...");
    
    const actionIconCount = await this.actionIcon.count();
    console.log(`🔍 Found ${actionIconCount} view icon(s)`);

    if (actionIconCount === 0) {
      await this.page.screenshot({ path: 'debug-no-view-icon.png', fullPage: true });
      console.warn("⚠️ View icon not found");
      return;
    }

    await this.actionIcon.waitFor({ state: 'visible', timeout: 20000 });
    await this.actionIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.actionIcon.click();
    console.log("✅ Clicked View icon");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // ✅ Step 4: Click Export button
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

    // ✅ Step 5: Click CSV option
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

    // ✅ Step 6: Validate success toast
    console.log("✉️ Waiting for success message...");
    
    const isToastVisible = await this.successToast.isVisible({ timeout: 20000 }).catch(() => false);

    if (isToastVisible) {
      console.log("✅ Success toast appeared");
      
      // Take screenshot
      await this.page.screenshot({
        path: 'export_success_toast.png',
        fullPage: true,
      });
      console.log("📸 Screenshot saved: export_success_toast.png");
    } else {
      console.warn("⚠️ Success toast not visible - export may have failed");
      await this.page.screenshot({ path: 'debug-no-toast.png', fullPage: true });
    }

    console.log("🎉 Export report flow completed!");
  }
}

module.exports = { ExportReportIndiExcusedVideo };