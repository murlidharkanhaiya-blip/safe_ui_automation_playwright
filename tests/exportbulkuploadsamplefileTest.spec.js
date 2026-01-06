const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { ExportBulkUploadSampleFile } = require('../pages/ExportBulkUploadSampleFile');
const credentials = require('../config/Credential');

test('exportbulkuploadsamplefileTest', async ({ browser }) => {
    test.setTimeout(120000); // Extend timeout for slower environments

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
    const exportbulkuploadsamplefile = new ExportBulkUploadSampleFile(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant); 

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    // Step 4: Run bulkupload export   verification
    await  exportbulkuploadsamplefile.verifyexportreportonbulkuploadsamplefile();

    console.log("✅ Test completed and browser closed after search.");

    await context.close();
});