const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { ExportReportGlobalSearchSeniorManager } = require('../pages/ExportReportGlobalSearchSeniorManager');
const credentials = require('../config/Credential');

test('exportreportglobalsearchseniormanagerTest', async ({ browser }) => {
    test.setTimeout(120000); // Extend timeout for slower environments

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
    const exportreportglobalsearchseniormanager = new ExportReportGlobalSearchSeniorManager(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant); 

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    // ✅ Step 4: Global search → senior Manager → Random Result → Export
    await exportreportglobalsearchseniormanager.searchEmployeeByName();

    console.log("✅ Test completed and browser closed after export.");

    await context.close();
});