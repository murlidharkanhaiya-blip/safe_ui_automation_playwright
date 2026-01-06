class LoginPage {
  constructor(page) {
    this.page = page;
    this.tenantInput = page.locator('#tenant');
    this.signInBtn = page.locator("(//button[normalize-space()='SIGN IN'])[1]");
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
  }

  async gotoLoginPage() {
    await this.page.goto('https://fd-mqa.xavlab.xyz/');
  }

  async enterTenant(tenant) {
    await this.tenantInput.fill(tenant);
    await this.signInBtn.click();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }
}

module.exports = { LoginPage };