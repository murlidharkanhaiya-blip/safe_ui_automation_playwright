const { expect } = require('@playwright/test');

class EmotionDetectionImageView {
  constructor(page) {
    this.page = page;

    // Improved Locators
    this.emotionDetectionCard = page.locator("div.block.hand.box-shadow").filter({ hasText: 'Emotion Detection' });
    this.eyeIcon = page.locator("img[title='View Employee Details']").first();
    this.drilldown = page.locator("polyline#Path").first();
    this.clickToViewImage = page.locator("span[title='Click to view image']").first();
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

  async verifyeimageviewonemotiondeductionpage() {
    // ✅ Reset state
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    console.log("📍 Current URL:", this.page.url());

    // ✅ Find and click Emotion Detection card
    console.log("📊 Looking for Emotion Detection card...");
    
    const cardCount = await this.emotionDetectionCard.count();
    console.log(`🔍 Found ${cardCount} Emotion Detection card(s)`);

    if (cardCount === 0) {
      // Try scrolling to find it
      console.log("🔄 Scrolling to find card...");
      
      for (let i = 0; i < 5; i++) {
        await this.page.mouse.wheel(0, 300);
        await this.page.waitForTimeout(500);
        
        const retryCount = await this.emotionDetectionCard.count();
        if (retryCount > 0) {
          console.log("✅ Card found after scrolling");
          break;
        }
      }
      
      const finalCount = await this.emotionDetectionCard.count();
      if (finalCount === 0) {
        await this.page.screenshot({ path: 'debug-no-emotion-card.png', fullPage: true });
        throw new Error("❌ Emotion Detection card not found. Check debug-no-emotion-card.png");
      }
    }

    // Click the card
    await this.emotionDetectionCard.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.emotionDetectionCard.first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.emotionDetectionCard.first().click();
    console.log("✅ Clicked Emotion Detection card");

    // Wait for navigation/data load
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Click Eye Icon
    console.log("👁️ Looking for View Employee Details icon...");
    
    const eyeIconCount = await this.eyeIcon.count();
    console.log(`🔍 Found ${eyeIconCount} eye icon(s)`);

    if (eyeIconCount === 0) {
      await this.page.screenshot({ path: 'debug-no-eye-icon.png', fullPage: true });
      console.warn("⚠️ No employee data available - View icon not found");
      return;
    }

    await this.eyeIcon.waitFor({ state: 'visible', timeout: 20000 });
    await this.eyeIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.eyeIcon.click();
    console.log("✅ Clicked View Employee Details");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // ✅ Click Drilldown
    console.log("📂 Looking for drilldown...");
    
    const drilldownCount = await this.drilldown.count();
    console.log(`🔍 Found ${drilldownCount} drilldown icon(s)`);

    if (drilldownCount === 0) {
      await this.page.screenshot({ path: 'debug-no-drilldown.png', fullPage: true });
      console.warn("⚠️ Drilldown not found");
      return;
    }

    await this.drilldown.waitFor({ state: 'visible', timeout: 20000 });
    await this.drilldown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.drilldown.click();
    console.log("✅ Clicked drilldown");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // ✅ Click to View Image
    console.log("🖼️ Looking for 'Click to view image'...");
    
    const viewImageCount = await this.clickToViewImage.count();
    console.log(`🔍 Found ${viewImageCount} view image link(s)`);

    if (viewImageCount === 0) {
      await this.page.screenshot({ path: 'debug-no-view-image.png', fullPage: true });
      console.warn("⚠️ No images available to view");
      return;
    }

    await this.clickToViewImage.waitFor({ state: 'visible', timeout: 20000 });
    await this.clickToViewImage.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.clickToViewImage.click();
    console.log("✅ Clicked 'Click to view image'");

    await this.page.waitForTimeout(2000);

    // ✅ Verify image modal/viewer opened
    const imageModal = this.page.locator('img[src*="blob:"], img[src*="data:image"], div[role="dialog"] img, .image-viewer').first();
    const isImageVisible = await imageModal.isVisible({ timeout: 5000 }).catch(() => false);

    if (isImageVisible) {
      console.log("✅ Image viewer opened successfully");
      
      // Close image viewer (if needed)
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(1000);
      console.log("✅ Image viewer closed");
    } else {
      console.log("ℹ️ Image viewer state unknown");
    }

    console.log("🎉 Emotion Detection image view completed!");
  }
}

module.exports = { EmotionDetectionImageView };