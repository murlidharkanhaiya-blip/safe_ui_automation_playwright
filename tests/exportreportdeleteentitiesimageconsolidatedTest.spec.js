const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { ExportReportDeleteEntitiesImageConsolidated } = require('../pages/ExportReportDeleteEntitiesImageConsolidated');
const credentials = require('../config/Credential');

test('exportreportdeleteentitiesimageconsolidatedTest', async ({ browser }) => {
    test.setTimeout(120000); // Extend timeout for slower environments

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
   const exportreportdeleteentitiesimageconsolidated = new ExportReportDeleteEntitiesImageConsolidated(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant); 

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    // Step 4: Run  delete entities  export  verification
    await  exportreportdeleteentitiesimageconsolidated.verifyexportreportondeleteentitiesimagepage();

    console.log("✅ Test completed and browser closed after export.");

    await context.close();
});