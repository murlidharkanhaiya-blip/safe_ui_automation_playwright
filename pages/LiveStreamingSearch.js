const { expect } = require('@playwright/test');

class LiveStreamingSearch {
    constructor(page) {
        this.page = page;

        // Locators
        this.livestreamingCard = this.page.locator("div.block-container.deleted-images-block").filter({ hasText: "Live Streaming" });

        this.searchInput = "(//input[contains(@placeholder,'Search')])[2]";
        this.searchButton = "//div[@class='page-heading-actions']//div[@class='search-wrapper']//img[@alt='search']";

        this.tableRow = "tr.MuiTableRow-root";
        this.idCell = "td:nth-child(1)";
        this.nameCell = "td:nth-child(2)";
        this.emailCell = "td:nth-child(3)";
    }

    async waitForLiveStreamingToLoad() {
        await this.livestreamingCard.waitFor({ state: 'visible', timeout: 20000 });

        const cardHandle = await this.livestreamingCard.elementHandle();

        await this.page.waitForFunction(
            (el) => {
                const text = el?.innerText?.trim() || '';
                const match = text.match(/Live Streaming\s*(\d+)/);
                return match && parseInt(match[1], 10) > 0;
            },
            cardHandle,
            { timeout: 20000 }
        );
    }

    async verifySearchonlivestreamingPage() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        await this.waitForLiveStreamingToLoad();
        await this.livestreamingCard.scrollIntoViewIfNeeded();
        await this.livestreamingCard.waitFor({ state: 'visible', timeout: 5000 });
        await this.livestreamingCard.click();

        const loader = this.page.locator('#global-loader-container >> .loading');
        try {
            if (await loader.isVisible({ timeout: 3000 })) {
                await loader.waitFor({ state: 'hidden', timeout: 15000 });
            }
        } catch {
            console.log("⚠️ Loader not visible or skipped.");
        }

        await this.page.waitForSelector(this.tableRow, { timeout: 20000 });

        const rows = this.page.locator(this.tableRow);
        const count = await rows.count();

        let employeeId = '', employeeName = '', employeeEmail = '';
        let found = false;

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
                console.log(`⏭ Skipping row ${i + 1}: Not stable or visible.`);
            }
        }

        if (!found) {
            throw new Error("❌ No usable row with all 3 fields visible and filled.");
        }

        console.log(`🔍 Picked Employee:\n  ID: ${employeeId}\n  Name: ${employeeName}\n  Email: ${employeeEmail}`);

        await this.performSearchAndAssert("Employee ID", employeeId, this.idCell, "Employee ID");
        await this.performSearchAndAssert("Employee Name", employeeName, this.nameCell, "Employee Name");
        await this.performSearchAndAssert("Employee Email", employeeEmail, this.emailCell, "Employee Email");
    }

    async performSearchAndAssert(criteriaText, inputValue, cellSelector, label) {
        console.log(`\n🔎 Searching by ${label}: "${inputValue}"`);

        // Select search criteria
        await this.page.locator('[data-testid="searchBy"]').click();
        const option = this.page.locator(`.search__option--item:has-text("${criteriaText}")`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();

        // Fill and search
        const inputBox = this.page.locator(this.searchInput);
        await inputBox.fill('');
        await inputBox.fill(inputValue);
        await this.page.locator(this.searchButton).click();

        // Optional loader wait
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
                if (cellText && cellText.trim().toLowerCase().includes(inputValue.toLowerCase())) {
                    matched = true;
                    console.log(`✅ ${label} search verified.`);
                    break;
                } else {
                    console.log(`⏳ Retry ${attempt}: "${inputValue}" not found yet...`);
                }
            } catch {
                console.log(`⏳ Retry ${attempt}: Error while reading result cell...`);
            }
        }

        if (!matched) {
            const tableText = await this.page.locator(this.tableRow).first().innerText().catch(() => '[No Row]');
            throw new Error(`❌ ${label} search failed: "${inputValue}" not found in results.\nFirst Row Content:\n${tableText}`);
        }
    }
}

module.exports = { LiveStreamingSearch };
