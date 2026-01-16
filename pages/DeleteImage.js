const { expect } = require('@playwright/test');

class DeleteImage {
  constructor(page) {
    this.page = page;

    // Dashboard card
    this.totaluniquecardLocator = "div.recharts-wrapper";

    // Action & drilldown
    this.actionicon = this.page.locator("(//img[@title='View Employee Details'])[1]");
    this.drilldown = this.page.locator("(//*[name()='polyline'][@id='Path'])[1]");

    // Delete flow
    this.enterdeleteremark = this.page.locator("(//textarea[@placeholder='Enter deletion remarks'])[1]");
    this.deleteBtn = this.page.locator("(//button[normalize-space()='DELETE'])[1]");

    // Loader
    this.loader = this.page.locator('#global-loader-container >> .loading');
  }

  // 🔁 Robust loader wait (handles late appearance)
  async waitForLoader() {
    try {
      await this.loader.waitFor({ state: 'hidden', timeout: 20000 });
    } catch {
      // ignore if loader never appears
    }
  }

  async deleteimagesingroup() {
    // ❌ DO NOT use networkidle (group flakiness)
    await this.page.waitForLoadState('domcontentloaded');

    // Step 1️⃣ Open "Total Unique Login" card
    const card = this.page
      .locator(this.totaluniquecardLocator)
      .filter({ hasText: 'Total Unique Login' });

    await expect(card.first()).toBeVisible({ timeout: 20000 });
    await card.first().scrollIntoViewIfNeeded();
    await card.first().click();

    await this.waitForLoader();

    // Step 2️⃣ Wait for employee action icon
    await expect(this.actionicon).toBeVisible({ timeout: 20000 });
    await this.actionicon.click();

    await this.waitForLoader();

    // Step 3️⃣ Drilldown
    await expect(this.drilldown).toBeVisible({ timeout: 20000 });
    await this.drilldown.click();

    await this.waitForLoader();

    // Step 4️⃣ Pick RANDOM delete image icon (FIXED)
    const deleteIcons = this.page.locator("//img[@title='Delete Images']");
    const count = await deleteIcons.count();

    if (count === 0) {
      throw new Error("No delete images available to delete");
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomdeleteicon = deleteIcons.nth(randomIndex);

    await expect(randomdeleteicon).toBeVisible({ timeout: 20000 });
    await randomdeleteicon.click();

    // Step 5️⃣ Enter deletion remark
    await expect(this.enterdeleteremark).toBeVisible({ timeout: 20000 });
    await this.enterdeleteremark.fill("yes");

    await this.waitForLoader();

    // Step 6️⃣ Confirm DELETE
    await expect(this.deleteBtn).toBeVisible({ timeout: 20000 });
    await expect(this.deleteBtn).toBeEnabled();

    await this.deleteBtn.click();

    // Step 7️⃣ Final loader settle
    await this.waitForLoader();
  }
}

module.exports = { DeleteImage };
