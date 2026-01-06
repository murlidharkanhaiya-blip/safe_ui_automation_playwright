const { expect } = require('@playwright/test');

class BulkUploadSearch {
  constructor(page) {
    this.page = page;

    this.bulkUploadNavbar =
      "(//a[@data-testid='nav-link' and @href='/bulk-upload'])[2]";

    this.searchInput =
      "(//input[contains(@placeholder,'Search')])[2]";

    this.tableRow = "tbody tr.MuiTableRow-root";
  }

  async verifySearchOnbulkuploadPage() {
    // Open Bulk Upload
    await this.page.locator(this.bulkUploadNavbar).click();

    // Ensure page loaded
    await expect(this.page.locator(this.searchInput))
      .toBeVisible({ timeout: 30000 });

    const rows = this.page.locator(this.tableRow);
    await expect(rows.first()).toBeVisible({ timeout: 30000 });

    // 🔥 Dynamically find Uploaded By column
    const uploadedByColIndex =
      await this.getColumnIndexByHeader('Uploaded By');

    // Pick random value BEFORE search
    const count = await rows.count();
    const randomIndex = Math.floor(Math.random() * count);

    const uploadedBy =
      (await rows
        .nth(randomIndex)
        .locator(`td:nth-child(${uploadedByColIndex})`)
        .innerText()).trim();

    console.log(`🔍 Picked Uploaded By → ${uploadedBy}`);
    expect(uploadedBy).toBeTruthy();

    // Perform search
    await this.searchAndValidate(uploadedBy, uploadedByColIndex);
  }

  async searchAndValidate(value, colIndex) {
    const searchInput = this.page.locator(this.searchInput);
    const rows = this.page.locator(this.tableRow);

    // Clear & search
    await searchInput.fill('');
    await searchInput.fill(value);
    await searchInput.press('Enter');

    // Wait for table refresh
    await this.page.waitForLoadState('networkidle');
    await expect(rows.first()).toBeVisible({ timeout: 30000 });

    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    // 🔥 Validate Uploaded By column ONLY
    for (let i = 0; i < count; i++) {
      const cellText =
        (await rows
          .nth(i)
          .locator(`td:nth-child(${colIndex})`)
          .innerText()).trim();

      expect(cellText).toBe(value);
    }

    console.log(`✅ Uploaded By search validated → ${value}`);
  }

  async getColumnIndexByHeader(headerText) {
    const headers = this.page.locator('thead tr th');
    const count = await headers.count();

    for (let i = 0; i < count; i++) {
      const text = (await headers.nth(i).innerText()).trim();
      if (text === headerText) return i + 1;
    }
    throw new Error(`Column not found: ${headerText}`);
  }
}

module.exports = { BulkUploadSearch };
