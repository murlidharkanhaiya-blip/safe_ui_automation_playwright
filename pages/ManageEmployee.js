const { expect } = require('@playwright/test');
const path = require('path');

class ManageEmployee {
    constructor(page) {
        this.page = page;

        // ✅ Existing locators
        this.manageemployeenavbar = "(//*[name()='svg'])[11]";
        this.addemployeeButton = "(//button[@class='btn btn-outline-success btn-spacing invite '])[1]";
        this.empIdInput = page.locator("(//input[@name='emp_id'])[1]");
        this.empNameInput = page.locator("(//input[@name='name'])[1]");
        this.empEmailInput = page.locator("(//input[@name='email'])[1]");
        this.reportingmanagernameinput = page.locator("(//input[@name='reporting_manager'])[1]");
        this.reportingmanageremailinput = page.locator("(//input[@name='reporting_manager_email'])[1]");

        // ✅ Device Type dropdown trigger
        this.devicetypeDropdown = page.locator("(//input[@placeholder='Select'])[3]");

        this.imageUpload = page.locator("//input[@type='file']");
        this.addemployeebutton = page.locator("(//button[@name='Add Employee'])[1]");
        this.nexttButton = page.locator("//button[normalize-space()='Next']");
    }

    async AddEmployee() {
        await this.page.locator(this.manageemployeenavbar).click();
        await this.page.waitForTimeout(2000);

        await this.page.locator(this.addemployeeButton).click();
        await this.page.waitForTimeout(2000);

        // Generate unique name and email
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const id = `xav${randomNumber}`;
        const name = `PlayWright_test1${randomNumber}`;
        const email = `PlayWright_test${randomNumber}@telusinternational.com`;

        console.log('Generated unique employee name:', name);
        console.log('Generated unique email:', email);
        console.log('Generated unique id:', id);

        // Fill basic details
        await this.empIdInput.fill(id);
        await this.empNameInput.fill(name);
        await this.empEmailInput.fill(email);

        await this.reportingmanagernameinput.fill("rohit");
        await this.reportingmanageremailinput.fill("rohit.bhadouriya@telusinternational.com");

        // ✅ Select Device Type = Windows
await this.devicetypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
await this.devicetypeDropdown.click(); // open dropdown

// Directly target the Windows option anywhere on page
const windowsOption = this.page.locator("text=Windows");

// Try to scroll down until Windows becomes visible
let found = false;
for (let i = 0; i < 25; i++) {
    if (await windowsOption.isVisible()) {
        await windowsOption.scrollIntoViewIfNeeded();
        await windowsOption.click();
        found = true;
        break;
    }
    await this.page.keyboard.press("ArrowDown");
    await this.page.waitForTimeout(200);
}

if (!found) {
    throw new Error("❌ Windows option not found in Device Type dropdown");
}

// ✅ Verify selection
await expect(this.devicetypeDropdown).toHaveValue(/windows/i);

        

// ✅ Click NEXT
this.nexttButton = this.page.getByRole('button', { name: /next/i });
await this.nexttButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(this.nexttButton).toBeEnabled();
await this.nexttButton.click();
        
        // ✅ Upload image
const filePathImage = path.resolve('tests/TestData_File/rsz_11img20240621130926.jpg');

// Pick the first enabled input[type=file]
this.imageUpload = this.page.locator('//input[@type="file" and not(@disabled)]');

await this.imageUpload.setInputFiles(filePathImage);
await this.page.waitForTimeout(2000);

        // ✅ Final submit
        await this.addemployeebutton.click();
    }
}

module.exports = { ManageEmployee };