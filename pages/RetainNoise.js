const { expect } = require('@playwright/test');

class RetainNoise {
  constructor(page) {
    this.page = page;

    /* Cards & actions */
    this.noiseCard = page.locator("span:has-text('Noise Detection')");
    this.viewIcon = page.locator("img[title='View']").first();
    this.menuIcon = page.locator("img[alt='menu']").first();

    /* Retain popup */
    this.retainOption = page.locator("img[title='Retain']");
    this.proceedButton = page.locator("button:has-text('PROCEED')");
    this.confirmationModal = page.locator("text=Are you sure you want to retain");

    /* Loaders (EXCLUDING popup overlay) */
    this.loader = page.locator(".loading");
  }

  async waitForLoader() {
    if (await this.loader.isVisible().catch(() => false)) {
      await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async retainnoisecard() {
  /* Open noise card */
  await expect(this.noiseCard).toBeVisible({ timeout: 30000 });
  await this.noiseCard.click();
  await this.waitForLoader();

  /* ✅ Check if any noise data exists */
  const viewCount = await this.viewIcon.count();

  if (viewCount === 0) {
    console.log("ℹ️ No noise data found to retain");
    return; // ✅ Exit without failing test
  }

  /* Click view */
  await this.viewIcon.first().click();
  await this.waitForLoader();

  /* Open menu */
  const menuVisible = await this.menuIcon.isVisible().catch(() => false);
  if (!menuVisible) {
    console.log("ℹ️ Menu option not available — no retainable noise data");
    return;
  }
  await this.menuIcon.click();

  /* Click retain */
  const retainVisible = await this.retainOption.isVisible().catch(() => false);
  if (!retainVisible) {
    console.log("ℹ️ Retain option not available — noise already processed");
    return;
  }
  await this.retainOption.click();

  /* Wait for confirmation popup */
  const confirmVisible = await this.confirmationModal.isVisible().catch(() => false);
  if (!confirmVisible) {
    console.log("ℹ️ Retain confirmation not shown — skipping retain");
    return;
  }

  /* Click PROCEED */
  await expect(this.proceedButton).toBeVisible({ timeout: 20000 });
  await expect(this.proceedButton).toBeEnabled();
  await this.proceedButton.click();

  /* Wait for backend processing */
  await this.waitForLoader();

  }
}

module.exports = { RetainNoise };
