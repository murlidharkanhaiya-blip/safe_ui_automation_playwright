const { expect } = require('@playwright/test');

class HandGestureSearch {
    constructor(page) {
        this.page = page;

        // ✅ Card locator
        this.handgestureCard = this.page.locator("div.block-container:has-text('Hand gesture')");

        // Search input & button
        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton =
            "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        // Table row & cells
        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    /* ----------------------------------------------------
       ✅ Wait until Hand Gesture card is visible & populated
    ---------------------------------------------------- */
    async waitForHandGestureToLoad() {
        const maxScrollAttempts = 10;
        let found = false;

        for (let i = 0; i < maxScrollAttempts; i++) {
            const visible = await this.handgestureCard.first().isVisible().catch(() => false);
            if (visible) {
                found = true;
                break;
            }

            await this.page.mouse.wheel(0, 500);
            await this.page.waitForTimeout(800);
        }

        if (!found) {
            throw new Error("❌ Hand Gesture card not found even after scrolling.");
        }

        this.handgestureCard = this.handgestureCard.first();

        // ✅ Wait for count text like: "Hand gesture 3"
        const cardHandle = await this.handgestureCard.elementHandle();
        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                return /Hand gesture\s*\d+/i.test(text);
            },
            cardHandle,
            { timeout: 20000 }
        );
    }

    /* ----------------------------------------------------
       ✅ Wait for table rows to appear (stable solution)
    ---------------------------------------------------- */
    async waitForTableToLoad(timeout = 30000) {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            const loader = this.page.locator('#global-loader-container >> .loading');
            try {
                if (await loader.isVisible({ timeout: 2000 })) {
                    await loader.waitFor({ state: 'hidden', timeout: 15000 });
                }
            } catch {}

            const rows = this.page.locator(this.tableRow);
            const count = await rows.count();

            if (count > 0) {
                console.log(`✅ Table loaded with ${count} rows`);
                return;
            }

            console.log('⏳ Waiting for table rows...');
            await this.page.waitForTimeout(1500);
        }

        throw new Error('❌ Table did not load any rows within timeout');
    }

    /* ----------------------------------------------------
       ✅ Main Test Flow
    ---------------------------------------------------- */
    async verifySearchonhandgesturePage() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // 1️⃣ Load card safely
        await this.waitForHandGestureToLoad();

        // 2️⃣ Click card safely
        await this.handgestureCard.scrollIntoViewIfNeeded();
        await this.handgestureCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.handgestureCard.hover();
        await this.page.waitForTimeout(300);
        await this.handgestureCard.click({ force: true });

        // 3️⃣ Wait for table
        await this.waitForTableToLoad();

        const rows = this.page.locator(this.tableRow);
        const count = await rows.count();

        let employeeId = '';
        let employeeName = '';
        let employeeEmail = '';
        let found = false;

        // 4️⃣ Pick first stable row
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            try {
                await row.scrollIntoViewIfNeeded();
                await row.waitFor({ state: 'visible', timeout: 5000 });

                const idCell = row.locator(this.idCell);
                const nameCell = row.locator(this.nameCell);
                const emailCell = row.locator(this.emailCell);

                await Promise.all([
                    idCell.waitFor({ state: 'visible', timeout: 3000 }),
                    nameCell.waitFor({ state: 'visible', timeout: 3000 }),
                    emailCell.waitFor({ state: 'visible', timeout: 3000 }),
                ]);

                employeeId = (await idCell.innerText()).trim();
                employeeName = (await nameCell.innerText()).trim();
                employeeEmail = (await emailCell.innerText()).trim();

                if (employeeId && employeeName && employeeEmail) {
                    found = true;
                    break;
                }
            } catch {
                console.log(`⏭ Skipping unstable row ${i + 1}`);
            }
        }

        if (!found) {
            throw new Error("❌ No usable row found with ID, Name and Email.");
        }

        console.log(`🔍 Picked Employee:
  ID: ${employeeId}
  Name: ${employeeName}
  Email: ${employeeEmail}`);

        // 5️⃣ Search validations
        await this.performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await this.performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await this.performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }

    /* ----------------------------------------------------
       ✅ Search & Assert Logic (retry safe)
    ---------------------------------------------------- */
    async performSearchAndAssert(criteriaText, inputValue, cellSelector, label) {
        console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

        await this.page.locator('[data-testid="searchBy"]').click();
        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();

        const inputBox = this.page.locator(this.searchInput);
        await inputBox.fill('');
        await inputBox.fill(inputValue);
        await this.page.locator(this.searchButton).click();

        const loader = this.page.locator('#global-loader-container >> .loading');
        try {
            if (await loader.isVisible({ timeout: 2000 })) {
                await loader.waitFor({ state: 'hidden', timeout: 10000 });
            }
        } catch {}

        const resultCell = this.page.locator(`${this.tableRow} >> ${cellSelector}`);
        let matched = false;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await this.page.waitForTimeout(1500);
                const cellText = await resultCell.first().innerText();
                if (cellText?.trim().toLowerCase().includes(inputValue.toLowerCase())) {
                    console.log(`✅ ${label} search verified.`);
                    matched = true;
                    break;
                }
                console.log(`⏳ Retry ${attempt}: Value not reflected yet`);
            } catch {
                console.log(`⏳ Retry ${attempt}: Unable to read result cell`);
            }
        }

        if (!matched) {
            throw new Error(`❌ ${label} search failed for value: ${inputValue}`);
        }
    }
}

module.exports = { HandGestureSearch };