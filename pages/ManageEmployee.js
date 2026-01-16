const { expect } = require('@playwright/test');
const path = require('path');

class ManageEmployee {
    constructor(page) {
        this.page = page;

        this.manageemployeenavbar =
            "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Manage Employees']//a[@data-testid='nav-link']";

        this.addemployeeButton =
            "(//button[@class='btn btn-outline-success btn-spacing invite '])[1]";

        this.empIdInput = page.locator("(//input[@name='emp_id'])[1]");
        this.empNameInput = page.locator("(//input[@name='name'])[1]");
        this.empEmailInput = page.locator("(//input[@name='email'])[1]");
        this.reportingmanagernameinput =
            page.locator("(//input[@name='reporting_manager'])[1]");
        this.reportingmanageremailinput =
            page.locator("(//input[@name='reporting_manager_email'])[1]");

        this.devicetypeDropdown = page.locator("(//input[@placeholder='Select'])[3]");
        this.nexttButton = page.getByRole('button', { name: /next/i });

        this.imageUpload = page.locator('//input[@type="file" and not(@disabled)]');
        this.addemployeebutton = page.locator("(//button[@name='Add Employee'])[1]");
    }

    // 🔑 Universal stable typing helper
    async typeAndCommit(locator, value) {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click();
        await locator.fill(''); // clear safely
        await locator.pressSequentially(value, { delay: 80 });
        await locator.press('Tab'); // commit value
    }

    async AddEmployee() {
        // Navigate
        await this.page.locator(this.manageemployeenavbar).click();
        await this.page.locator(this.addemployeeButton).click();

        // Generate unique data
        const random = Math.floor(1000 + Math.random() * 9000);
        const id = `xav${random}`;
        const name = `PlayWright_test1${random}`;
        const email = `PlayWright_test${random}@telusinternational.com`;

        console.log({ id, name, email });

        // ✅ Fill fields (STABLE)
        await this.typeAndCommit(this.empIdInput, id);
        await this.typeAndCommit(this.empNameInput, name);
        await this.typeAndCommit(this.empEmailInput, email);

        await this.typeAndCommit(this.reportingmanagernameinput, "rohit");
        await this.typeAndCommit(
            this.reportingmanageremailinput,
            "rohit.bhadouriya@telusinternational.com"
        );

        // Device Type dropdown
        await this.devicetypeDropdown.click();
        const windowsOption = this.page.locator("text=Windows");

        for (let i = 0; i < 25; i++) {
            if (await windowsOption.isVisible()) {
                await windowsOption.click();
                break;
            }
            await this.page.keyboard.press("ArrowDown");
            await this.page.waitForTimeout(150);
        }

        await this.devicetypeDropdown.press('Tab');

        // 🔑 Wait for NEXT to be enabled by app logic
        await this.page.waitForFunction(
            btn => !btn.disabled,
            await this.nexttButton.elementHandle(),
            { timeout: 20000 }
        );

        await this.nexttButton.click();

        // Upload image
        const filePath = path.resolve('tests/TestData_File/rsz_11img20240621130926.jpg');
        await this.imageUpload.setInputFiles(filePath);

        // Submit
        await this.addemployeebutton.click();
    }
}

module.exports = { ManageEmployee };
