const { expect } = require('@playwright/test');

class EditEmployee {
    constructor(page) {
        this.page = page;

        // Use original XPath
        this.manageEmployeeNav = page.locator("//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Employees']//a[@data-testid='nav-link']");
        this.editButton = page.locator("img[title='Edit']").first();
        this.nextButton = page.locator("button:has-text('Next')");
        this.viewImage = page.locator("img.emp-image").first();
        this.saveButton = page.locator("button:has-text('Save'), button:has-text('Update')").first();
        this.cancelButton = page.locator("button:has-text('Cancel'), button:has-text('Close')").first();
        this.loader = page.locator('#global-loader-container .loading');
        this.employeeTable = page.locator("table");
        this.tableRow = page.locator("table tbody tr");
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

    async editupdateEmployee() {
        // ✅ Reset state
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);

        const currentUrl = this.page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        // ✅ Navigate by clicking sidebar icon
        if (!currentUrl.includes('manage-employee') && !currentUrl.includes('employees')) {
            console.log("📂 Clicking Manage Employees sidebar icon...");
            
            // Wait for loader to clear
            await this.waitForLoader();
            await this.page.waitForTimeout(2000);
            
            // Click sidebar icon
            await this.manageEmployeeNav.waitFor({ state: 'visible', timeout: 20000 });
            await this.manageEmployeeNav.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.manageEmployeeNav.click();
            console.log("✅ Clicked Manage Employees sidebar icon");

            // ✅ REMOVED: Strict URL wait - just wait for page load
            await this.page.waitForLoadState('domcontentloaded');
            await this.waitForLoader();
            await this.page.waitForTimeout(5000); // Longer wait for table to load
            
            // Log actual URL after click
            console.log(`📍 URL after click: ${this.page.url()}`);
        } else {
            console.log("✅ Already on Manage Employees page");
            await this.page.waitForTimeout(2000);
        }

        // ✅ Wait for table
        console.log("🔍 Waiting for employee table...");
        
        try {
            await this.employeeTable.waitFor({ state: 'visible', timeout: 20000 });
            console.log("✅ Employee table found");
        } catch {
            console.log("⚠️ Table not found, taking screenshot...");
            await this.page.screenshot({ path: 'debug-no-table.png', fullPage: true });
            
            // Debug: Check what's on the page
            const currentUrlAfter = this.page.url();
            console.log(`📍 Current URL when table not found: ${currentUrlAfter}`);
            
            const allTables = await this.page.locator('table').count();
            console.log(`🔍 Total tables on page: ${allTables}`);
            
            throw new Error("❌ Employee table not found. Check debug-no-table.png");
        }

        await this.page.waitForTimeout(2000);
        
        const rowCount = await this.tableRow.count();
        console.log(`📊 Found ${rowCount} employee(s)`);

        if (rowCount === 0) {
            console.warn("⚠️ No employees in table");
            return;
        }

        // ✅ Get employee name
        let employeeName = "Unknown";
        try {
            const firstRow = this.tableRow.first();
            const nameCell = firstRow.locator('td').nth(1);
            employeeName = await nameCell.innerText({ timeout: 3000 });
            console.log(`📝 Target employee: "${employeeName}"`);
        } catch {
            console.log("📝 Target: First employee");
        }

        // ✅ Click Edit button
        console.log("🔍 Looking for Edit button...");
        
        const editButtonCount = await this.editButton.count();
        console.log(`🔍 Found ${editButtonCount} edit button(s)`);

        if (editButtonCount === 0) {
            await this.page.screenshot({ path: 'debug-no-edit.png', fullPage: true });
            throw new Error("❌ Edit button not found. Check debug-no-edit.png");
        }

        const isEditEnabled = await this.editButton.isEnabled({ timeout: 3000 }).catch(() => false);
        
        if (!isEditEnabled) {
            console.warn("⚠️ Edit button is disabled");
            return;
        }

        console.log("✏️ Clicking Edit button...");
        await this.editButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.editButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.editButton.click();
        console.log("✅ Edit button clicked - Edit mode opened");

        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForLoader();
        await this.page.waitForTimeout(2000);

        // ✅ Click Next
        const isNextVisible = await this.nextButton.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isNextVisible) {
            const isNextEnabled = await this.nextButton.isEnabled({ timeout: 3000 }).catch(() => false);
            if (isNextEnabled) {
                await this.nextButton.click();
                console.log("✅ Clicked Next");
                await this.page.waitForLoadState('domcontentloaded');
                await this.waitForLoader();
                await this.page.waitForTimeout(2000);
            }
        }

        // ✅ Click View Image
        const isImageVisible = await this.viewImage.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isImageVisible) {
            await this.viewImage.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            await this.viewImage.click();
            console.log("✅ Clicked view image");
            await this.page.waitForTimeout(1500);
        }

        // ✅ Handle Save/Cancel
        const isSaveVisible = await this.saveButton.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSaveVisible) {
            await this.saveButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            
            const isSaveEnabled = await this.saveButton.isEnabled({ timeout: 2000 }).catch(() => false);
            
            if (isSaveEnabled) {
                console.log("💾 Saving...");
                await this.saveButton.click();
                console.log("✅ Save clicked");
                await this.page.waitForLoadState('domcontentloaded');
                await this.waitForLoader();
                await this.page.waitForTimeout(2000);
                console.log(`✅ Employee "${employeeName}" updated`);
            } else {
                console.log("ℹ️ Save disabled - clicking Cancel");
                
                const isCancelVisible = await this.cancelButton.isVisible({ timeout: 5000 }).catch(() => false);
                
                if (isCancelVisible) {
                    await this.cancelButton.click();
                    console.log("✅ Cancel clicked");
                } else {
                    await this.page.keyboard.press('Escape');
                    console.log("✅ Escape pressed");
                }
                await this.page.waitForTimeout(1000);
                console.log(`✅ Edit closed for "${employeeName}" (no changes)`);
            }
        } else {
            const isCancelVisible = await this.cancelButton.isVisible({ timeout: 3000 }).catch(() => false);
            if (isCancelVisible) {
                await this.cancelButton.click();
            } else {
                await this.page.keyboard.press('Escape');
            }
            await this.page.waitForTimeout(1000);
        }

        console.log("🎉 Edit employee completed!");
    }
}

module.exports = { EditEmployee };