const { expect } = require("@playwright/test");

class LiveStreaming {
  constructor(page) {
    this.page = page;

    // ✅ Locators
    this.livestreamnav = this.page.locator("(//*[name()='svg'])[14]");
    this.employeeList = this.page.locator("//ul[@id='employee-list']/li");
    this.loader = this.page.locator("//div[contains(@class,'loader')]");
    this.liveStreamingIcon = this.page.locator("//div[@class='live-stream-shadow']");
  }

  async waitForLoaderToDisappear(timeout = 20000) {
    try {
      if (await this.loader.isVisible({ timeout: 3000 })) {
        await this.loader.waitFor({ state: "hidden", timeout });
      }
    } catch {
      console.log("ℹ️ Loader not visible or already gone.");
    }
  }

 async employeelivestreaming() {
  console.log("▶️ Starting live streaming test...");

  // 1️⃣ Open Live Streaming page
  await this.livestreamnav.waitFor({ state: "attached", timeout: 15000 });
  await this.livestreamnav.click();

  // 2️⃣ Wait for employee list
  await this.employeeList.first().waitFor({ state: "attached", timeout: 20000 });

  const rowCount = await this.employeeList.count();
  if (rowCount === 0) {
    throw new Error("❌ No employees found in the list.");
  }

  console.log(`ℹ️ Found ${rowCount} employees.`);

  // 3️⃣ Pick random employee
  const randomIndex = Math.floor(Math.random() * rowCount);
  const employeeLocator = this.employeeList.nth(randomIndex);

  await employeeLocator.scrollIntoViewIfNeeded();
  await employeeLocator.click({ force: true });
  console.log(`✅ Clicked employee at index ${randomIndex}`);

  // 4️⃣ Wait for backend / UI load
  await this.waitForLoaderToDisappear(30000);

  // 5️⃣ HARD STABLE WAIT FOR LIVE STREAM ICON
  await this.page.waitForFunction(() => {
    const el = document.querySelector("div.live-stream-shadow");
    return el && el.offsetParent !== null;
  }, { timeout: 30000 });

  // Re-locate AFTER render (important)
  const liveIcon = this.page.locator("//div[@class='live-stream-shadow']").first();

  await liveIcon.scrollIntoViewIfNeeded();

  // 6️⃣ Final safe click
  await liveIcon.click({ force: true, timeout: 15000 });

  console.log("✅ Clicked live streaming icon successfully.");
}
}
module.exports = { LiveStreaming };