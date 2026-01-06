const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { UserRoleChange } = require('../pages/UserRoleChange');
const credentials = require('../config/Credential');

test('userrolechangeTest', async ({ browser }) => {
    test.setTimeout(120000);

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
    const userrolechange = new UserRoleChange(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant);

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    await userrolechange.updateuserprofile();

    console.log("✅ Test completed and browser closed after verification.");

    await context.close();
});
