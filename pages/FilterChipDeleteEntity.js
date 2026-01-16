const { expect } = require('@playwright/test');

class FilterChipDeleteEntity {
  constructor(page) {
    this.page = page;

    this.deletedEntityCard = page.locator(
      "div.block-container.deleted-images-block",
      { hasText: 'Deleted Entities' }
    );

    this.filterchip = page.locator("//div[contains(@class,'filter-icon')]");
    this.selectrange = page.locator("//input[@placeholder='Select Range']");
    this.applybtn = page.locator("//button[@data-testid='apply-filter']");
    this.overlay = page.locator("//div[contains(@class,'overlay')]");
  }

  // 🔥 Faster overlay handler
  async waitForOverlayIfPresent(timeout = 10000) {
    if (await this.overlay.count() > 0) {
      try {
        if (await this.overlay.isVisible({ timeout: 1000 })) {
          await this.overlay.waitFor({ state: 'hidden', timeout });
        }
      } catch {}
    }
  }

  async verifydeletetityfilterchip() {
    // Dashboard card
    await expect(this.deletedEntityCard).toBeVisible({ timeout: 20000 });
    await this.waitForOverlayIfPresent();
    await this.deletedEntityCard.click();

    // Page ready
    await expect(this.filterchip).toBeVisible({ timeout: 15000 });

    // Open filter
    await this.filterchip.click();

    // Date range
    await expect(this.selectrange).toBeVisible({ timeout: 10000 });
    await this.selectrange.click();

    const last90DaysOption = this.page.locator(
      "//li[@data-range-key='Last 90 Days']"
    );
    await expect(last90DaysOption).toBeVisible({ timeout: 10000 });
    await last90DaysOption.click();

    // ⚡ FAST APPLY CLICK
    await this.waitForOverlayIfPresent();

    await expect(this.applybtn).toBeVisible({ timeout: 3000 });
    await this.applybtn.click();

    console.log("🎉 Filter 'Last 90 Days' applied successfully.");
  }
}

module.exports = { FilterChipDeleteEntity };
