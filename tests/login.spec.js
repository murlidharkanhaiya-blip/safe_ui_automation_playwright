const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/SafeLoginPage');
const credentials = require('../config/Credential');

test('Example Login Test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.enterTenant('iLabs');
  await loginPage.login(credentials.username, credentials.password);

  await expect(page).toHaveURL(/dashboard|home|main/i);
});
