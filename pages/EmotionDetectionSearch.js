const { expect } = require('@playwright/test');

class EmotionDetectionSearch {
  constructor(page) {
    this.page = page;

    /* Card */
    this.emotiondeductioncard = "//div[@class='block hand box-shadow']"; 

    /* Search */
    this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
    this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

    /* Table */
    this.tableRow = "tr.MuiTableRow-root";
    this.idCell = "td:nth-child(1)";
    this.nameCell = "td:nth-child(2)";
    this.emailCell = "td:nth-child(3)";
  }

  async waitForVisibleRows(rows, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
      const count = await rows.count();
      if (count > 0) return count;
      await this.page.waitForTimeout(delay);
    }
    return 0;
  }

  async verifyEmotionDetectionSearch() {
    await this.page.waitForLoadState('networkidle');

    /* ===================== CLICK EMOTION DETECTION CARD ===================== */

    const allCards = this.page.locator(this.emotiondeductioncard);
    const cardCount = await allCards.count();   // ✅ FIXED

    let clicked = false;

    for (let i = 0; i < cardCount; i++) {
      const card = allCards.nth(i);
      const textContent = await card.textContent();

      if (textContent && textContent.includes("Emotion Detection")) {
        await card.scrollIntoViewIfNeeded();
        await card.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      throw new Error("❌ Emotion Detection card not found or not clickable.");
    }

    /* ===================== WAIT FOR LOADER ===================== */

    const loader = this.page.locator('#global-loader-container >> .loading');
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: 'hidden', timeout: 15000 });
    }

    /* ===================== WAIT FOR TABLE ===================== */

    const rows = this.page.locator(this.tableRow);
    const rowCount = await this.waitForVisibleRows(rows);

    if (rowCount === 0) {
      throw new Error("❌ No employee rows found after retries.");
    }

    /* ===================== PICK RANDOM ROW ===================== */

    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = rows.nth(randomIndex);

    await randomRow.locator(this.idCell).waitFor({ state: 'visible', timeout: 5000 });

    const employeeId = (await randomRow.locator(this.idCell).innerText()).trim();
    const employeeName = (await randomRow.locator(this.nameCell).innerText()).trim();
    const employeeEmail = (await randomRow.locator(this.emailCell).innerText()).trim();

    console.log(`🔍 Picked Random Employee:
    ID: ${employeeId}
    Name: ${employeeName}
    Email: ${employeeEmail}`);

    /* ===================== SEARCH & ASSERT ===================== */

    const searchInput = this.page.locator(this.searchInput);
    const searchByDropdown = this.page.locator('[data-testid="searchBy"]');

    const performSearchAndAssert = async (criteriaText, value, cellSelector) => {
      if (!value || value === '-') return;

      await searchByDropdown.click();

      const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
      await expect(option.first()).toBeVisible({ timeout: 10000 });
      await option.first().click();

      await searchInput.fill('');
      await searchInput.fill(value);

      await this.page.locator(this.searchButton).click();

      const resultCell = this.page.locator(`${this.tableRow} >> ${cellSelector}`).first();
      await expect(resultCell).toBeVisible({ timeout: 15000 });

      const resultText = (await resultCell.innerText()).trim();
      expect(resultText).toContain(value);

      console.log(`✅ ${criteriaText} Search Passed`);
    };

    await performSearchAndAssert("Employee ID", employeeId, this.idCell);
    await performSearchAndAssert("Employee Name", employeeName, this.nameCell);
    await performSearchAndAssert("Employee Email", employeeEmail, this.emailCell);
  }
}

module.exports = { EmotionDetectionSearch };
