class ReleaseNote {
    constructor(page) {
        this.page = page;

        this.sidebar = this.page.locator(".fixed-left-sidebar").first();

// Settings icon (inside correct container)
this.settingsIcon = this.page
    .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
    .first();
        this.releasenoteTab = page.locator("(//span[normalize-space()='Release Notes'])[1]");
        this.viewupdatetyab=page.locator("(//button[@type='button'])[1]");
        
        
    }

    async Verifyreleasenote() {
        await this.page.waitForLoadState("domcontentloaded");
        //await this.waitForLoaderToDisappear();

        // --- Scroll Sidebar to show settings icon ---
       await this.sidebar.waitFor({ state: 'visible', timeout: 20000 });

// Scroll sidebar container
await this.sidebar.evaluate(el => el.scrollTop = el.scrollHeight);

// Small wait for DOM repaint
await this.page.waitForTimeout(500);

// step 1:Force click settings icon
await this.settingsIcon.click({ force: true });

        // Step 2: Open Audit Settings tab
        await this.releasenoteTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.releasenoteTab.click();

        // Step 3: Open Audit others Settings tab
        await this.viewupdatetyab.waitFor({ state: 'visible', timeout: 10000 });
        await this.viewupdatetyab.click();


        
        await this.page.waitForTimeout(1000);

    }
}

module.exports = { ReleaseNote };