const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { ManageEmployeeSearch } = require('../pages/ManageEmployeeSearch');
const credentials = require('../config/Credential');

test('manageemployeesearchTest', async ({ browser }) => {
    test.setTimeout(120000); // Extend timeout for slower environments

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
    const manageemployeesearch = new ManageEmployeeSearch(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant); 

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    // Step 4: Run Manage Employee search verification
    await manageemployeesearch.verifySearchOnmanageemployeePage();

    console.log("✅ Test completed and browser closed after search.");

    await context.close();
});