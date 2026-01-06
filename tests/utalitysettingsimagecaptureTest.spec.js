const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const { UtalitySettingsImageCapture } = require('../pages/UtalitySettingsImageCapture');
const credentials = require('../config/Credential');

test('utalitysettingsimagecaptureTest', async ({ browser }) => {
    test.setTimeout(120000);

    const context = await browser.newContext();
    const page = await context.newPage();

    // Page Object Instances
    const loginPage = new LoginPage(page);
    const utalitysettingsimagecapture = new UtalitySettingsImageCapture(page);

    // Step 1: Go to login page
    await loginPage.gotoLoginPage();

    // Step 2: Enter tenant and proceed to login form
    await loginPage.enterTenant(credentials.tenant);

    // Step 3: Login with username & password
    await loginPage.login(credentials.username, credentials.password);

    await utalitysettingsimagecapture.utalitysettingsImagecapture();

    console.log("✅ Test completed and browser closed after verification.");

    await context.close();
});
