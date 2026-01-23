const { expect } = require('@playwright/test');

class DeleteImage {
  constructor(page) {
    this.page = page;
    this.loader = page.locator('#global-loader-container .loading');
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

  async deleteimagesingroup() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    console.log("📊 Looking for Total Unique Login card...");

    // Step 1: Click Total Unique Login card
    const card = this.page
      .locator("div.recharts-wrapper")
      .filter({ hasText: 'Total Unique Login' });

    await card.first().waitFor({ state: 'visible', timeout: 20000 });
    await card.first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await card.first().click({ force: true });
    console.log("✅ Clicked Total Unique Login card");

    // Wait for navigation and data load
    await this.page.waitForURL('**/unique-login**', { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // Verify data loaded
    const rows = await this.page.locator('tr').count();
    console.log(`✅ Found ${rows} table rows`);

    if (rows === 0) {
      throw new Error("No employee data loaded");
    }

    // Step 2: Click "View Employee Details" icon
    console.log("🔍 Looking for View Employee Details icon...");
    const actionIcon = this.page.locator("img[title='View Employee Details']").first();
    
    await actionIcon.waitFor({ state: 'visible', timeout: 15000 });
    await actionIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await actionIcon.click();
    console.log("✅ Clicked View Employee Details");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // Step 3: Click drilldown (Path icon)
    console.log("📂 Looking for drilldown...");
    const drilldown = this.page.locator("polyline#Path").first();
    
    await drilldown.waitFor({ state: 'visible', timeout: 15000 });
    await drilldown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await drilldown.click();
    console.log("✅ Clicked drilldown");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(3000);

    // Step 4: Find and click delete image icon
    console.log("🗑️ Looking for delete image icons...");
    const deleteIcons = this.page.locator("img[title='Delete Images']");
    
    const count = await deleteIcons.count();
    console.log(`🔍 Found ${count} delete image icons`);

    if (count === 0) {
      console.warn("⚠️ No images available to delete - test skipped");
      return;
    }

    const deleteIcon = deleteIcons.first();
    
    await deleteIcon.waitFor({ state: 'visible', timeout: 15000 });
    await deleteIcon.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await deleteIcon.click();
    console.log("✅ Clicked delete image icon");

    await this.page.waitForTimeout(1500);

    // Step 5: Enter deletion remark
    console.log("✍️ Entering deletion remark...");
    const remarkField = this.page.locator("textarea[placeholder='Enter deletion remarks']").first();
    
    await remarkField.waitFor({ state: 'visible', timeout: 15000 });
    await remarkField.fill("Automated deletion - QA test");
    console.log("✅ Entered deletion remark");

    await this.waitForLoader();
    await this.page.waitForTimeout(500);

    // Step 6: Click DELETE button
    console.log("🗑️ Clicking DELETE button...");
    const deleteBtn = this.page.locator("button:has-text('DELETE')").first();
    
    await deleteBtn.waitFor({ state: 'visible', timeout: 15000 });
    await expect(deleteBtn).toBeEnabled({ timeout: 5000 });
    await deleteBtn.click();
    console.log("✅ Clicked DELETE button");

    // Step 7: Wait for deletion to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    console.log(" Image deletion completed successfully!");
  }
}

module.exports = { DeleteImage };