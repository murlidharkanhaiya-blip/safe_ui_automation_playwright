const { expect } = require('@playwright/test');

class RetainEntitySearch {
  constructor(page) {
    this.page = page;

    /* DASHBOARD */
    this.retainEntityCard = page.locator('.dashboard-box:has-text("Retained Entities")');
    this.loader = page.locator('#global-loader-container');

    /* SEARCH */
    this.searchBy = page.locator('[data-testid="searchBy"]');
    this.searchInput = page.locator("(//input[contains(@placeholder,'Search')])[2]");
    this.searchIcon = page.locator("(//img[@alt='search'])[last()]");

    /* TABLE */
    this.rows = page.locator('tbody tr.MuiTableRow-root');
  }

  /* ---------- COMMON WAITS ---------- */
  async waitForLoader() {
    if (await this.loader.isVisible().catch(() => false)) {
      await this.loader.waitFor({ state: 'hidden', timeout: 30000 });
    }
  }

  async waitForRows() {
    await expect(this.rows.first()).toBeVisible({ timeout: 30000 });
    const count = await this.rows.count();
    expect(count).toBeGreaterThan(0);
  }

  /* ---------- SAFE TEXT READ (NO FLAKE) ---------- */
  async getCellText(row, index) {
    return await row.evaluate((el, i) => {
      const cell = el.querySelector(`td:nth-child(${i})`);
      return cell ? cell.innerText.trim() : '';
    }, index);
  }

  /* ---------- PICK RANDOM VALID ROW ---------- */
  async pickRandomRow() {
    const count = await this.rows.count();
    const validRows = [];

    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      await row.scrollIntoViewIfNeeded();

      const id = await this.getCellText(row, 1);
      const name = await this.getCellText(row, 2);
      const email = await this.getCellText(row, 3);

      if (id && name && email && id !== 'Emp ID') {
        validRows.push({ id, name, email });
      }
    }

    if (validRows.length === 0) {
      throw new Error('❌ No valid data rows found in table');
    }

    const picked = validRows[Math.floor(Math.random() * validRows.length)];
    console.log('🎯 Picked Row:', picked);
    return picked;
  }

  /* ---------- SEARCH ---------- */
  async searchAndVerify(criteria, value, columnIndex) {
    await this.searchBy.click();
    await this.page.locator(`text=${criteria}`).click();

    await this.searchInput.fill(value);
    await this.searchIcon.click();

    const resultRow = this.rows.first();
    await expect(resultRow).toBeVisible({ timeout: 20000 });

    const resultText = await this.getCellText(resultRow, columnIndex);
    expect(resultText).toContain(value);

    console.log(`✅ ${criteria} search verified → ${value}`);

    // reset
    await this.searchInput.fill('');
    await this.searchIcon.click();
    await this.waitForRows();
  }

  /* ---------- MAIN FLOW ---------- */
  async verifySearchonretainentityPage() {
    await this.retainEntityCard.waitFor({ state: 'visible', timeout: 30000 });
    await this.retainEntityCard.click();

    await this.waitForLoader();
    await this.waitForRows();

    const { id, name, email } = await this.pickRandomRow();

    await this.searchAndVerify('Employee ID', id, 1);
    await this.searchAndVerify('Employee Name', name, 2);
    await this.searchAndVerify('Employee Email', email, 3);
  }
}

module.exports = { RetainEntitySearch };
