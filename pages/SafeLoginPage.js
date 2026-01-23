const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    // Improved Locators
    this.tenantInput = page.locator('input#tenant');
    this.signInButton = page.locator("button:has-text('SIGN IN')").first();
    this.usernameInput = page.locator('input#username');
    this.passwordInput = page.locator('input#password');
    this.loader = page.locator('#global-loader-container .loading');
    this.dashboard = page.locator('text=Dashboard, h1:has-text("Dashboard")');
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

  async gotoLoginPage() {
    console.log("🌐 Navigating to login page...");
    await this.page.goto('https://fd-mprod.tisa.ai/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
    console.log("✅ Login page loaded");
  }

  async enterTenant(tenant) {
    console.log(`🏢 Entering tenant: ${tenant}`);
    
    await this.tenantInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.tenantInput.clear();
    await this.tenantInput.fill(tenant);
    await expect(this.tenantInput).toHaveValue(tenant);
    console.log(`✅ Tenant entered: ${tenant}`);

    await this.page.waitForTimeout(300);

    await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
    const isEnabled = await this.signInButton.isEnabled({ timeout: 3000 }).catch(() => false);
    
    if (!isEnabled) {
      throw new Error("❌ Sign In button is disabled after entering tenant");
    }

    await this.signInButton.click();
    console.log("✅ Clicked Sign In (tenant step)");

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);
  }

  async login(username, password) {
    console.log(`👤 Logging in as: ${username}`);
    
    // ✅ Enter username
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
    await expect(this.usernameInput).toHaveValue(username);
    console.log(`✅ Username entered`);

    await this.page.waitForTimeout(300);

    // ✅ Enter password
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    // Don't verify password value for security
    console.log(`✅ Password entered`);

    await this.page.waitForTimeout(300);

    // ✅ Click Sign In
    await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
    const isEnabled = await this.signInButton.isEnabled({ timeout: 3000 }).catch(() => false);
    
    if (!isEnabled) {
      throw new Error("❌ Sign In button is disabled");
    }

    await this.signInButton.click();
    console.log("✅ Clicked Sign In");

    // ✅ Wait for login to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoader();
    
    // ✅ Wait for dashboard to appear
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 20000 });
      console.log("✅ Redirected to dashboard");
    } catch {
      console.log("⚠️ URL didn't change to dashboard, checking for dashboard elements...");
      
      // Check if dashboard loaded anyway
      const isDashboardVisible = await this.dashboard.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isDashboardVisible) {
        console.log("✅ Dashboard loaded");
      } else {
        await this.page.screenshot({ path: 'debug-login-failed.png', fullPage: true });
        throw new Error("❌ Login failed - dashboard not loaded. Check debug-login-failed.png");
      }
    }

    await this.page.waitForTimeout(3000); // Allow dashboard to fully load

    console.log("🎉 Login successful!");
  }

  // ✅ Combined login flow
  async performLogin(tenant, username, password) {
    await this.gotoLoginPage();
    await this.enterTenant(tenant);
    await this.login(username, password);
  }
}

module.exports = { LoginPage };