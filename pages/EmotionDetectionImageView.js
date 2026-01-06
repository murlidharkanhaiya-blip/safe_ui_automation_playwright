const { expect } = require('@playwright/test');

class EmotionDetectionImageView {
  constructor(page) {
    this.page = page;

    // ===== EXISTING LOCATORS (UNCHANGED) =====
    this.emotiondeductioncard = "//div[@class='block hand box-shadow']";
    this.tableRow = "//tbody/tr";
    this.eyeIcon = "(//img[@title='View'])[1]";
    this.drilldown = "(//*[name()='polyline'][@id='Path'])[1]";
    this.clicktoviewimage = "(//span[@title='Click to view image'])[1]";
  }

  /* ===================== FIX: MISSING FUNCTION ===================== */
  async waitForVisibleRows(rows, timeout = 30000) {
    await rows.first().waitFor({ state: 'visible', timeout });
    return await rows.count();
  }

  async verifyeimageviewonemotiondeductionpage() {

    /* ===================== CLICK EMOTION DETECTION CARD ===================== */

    const emotionCard = this.page.locator(this.emotiondeductioncard).first();
    await emotionCard.scrollIntoViewIfNeeded();
    await expect(emotionCard).toBeVisible({ timeout: 20000 });
    await emotionCard.click();

    /* ===================== WAIT FOR PAGE DATA ===================== */

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    /* ===================== WAIT FOR TABLE ROW ===================== */

    const rows = this.page.locator(this.tableRow);
    const rowCount = await this.waitForVisibleRows(rows);

    if (rowCount === 0) {
      throw new Error("❌ No rows found in Emotion Detection table.");
    }

    /* ===================== CLICK EYE ICON ===================== */

    const eyeIcon = this.page.locator(this.eyeIcon);
    await eyeIcon.scrollIntoViewIfNeeded();
    await expect(eyeIcon).toBeVisible({ timeout: 30000 });
    await eyeIcon.click({ force: true });

    /* ===================== DRILLDOWN ===================== */

    const drilldown = this.page.locator(this.drilldown);
    await expect(drilldown).toBeVisible({ timeout: 30000 });
    await drilldown.click({ force: true });

    /* ===================== VIEW IMAGE ===================== */

    const viewImage = this.page.locator(this.clicktoviewimage);
    await expect(viewImage).toBeVisible({ timeout: 30000 });
    await viewImage.click();
  }
}

module.exports = { EmotionDetectionImageView };
