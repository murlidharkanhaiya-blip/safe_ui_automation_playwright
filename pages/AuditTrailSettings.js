class AuditTrailSettings {
    constructor(page) {
        this.page = page;

        this.sidebar = this.page.locator(".fixed-left-sidebar").first();

// Settings icon (inside correct container)
this.settingsIcon = this.page
    .locator('.fixed-left-sidebar a[data-testid="nav-link"][href="/settings/image_general_setting"]')
    .first();
        this.AuditTrailTab = page.locator("(//span[@class='MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock'][normalize-space()='Audit Trail'])[1]");
        this.auditviewmore1=page.locator("(//img[@title='View Details'])[1]");
        this.auditviewmore2=page.locator("(//img[@title='View Details'])[1]");
        
    }

    async Verifyaudittrailsetting() {
        await this.page.waitForLoadState("domcontentloaded");
        //await this.waitForLoaderToDisappear();

        // --- Scroll Sidebar to show settings icon ---
       await this.sidebar.waitFor({ state: 'visible', timeout: 20000 });

// Scroll sidebar container
await this.sidebar.evaluate(el => el.scrollTop = el.scrollHeight);

// Small wait for DOM repaint
await this.page.waitForTimeout(500);

// Force click settings icon
await this.settingsIcon.click({ force: true });

        // Step 2: Open Audit Settings tab
        await this.AuditTrailTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.AuditTrailTab.click();

        // Click on viewmore icon
        await this.auditviewmore1.waitFor({ state: 'visible', timeout: 10000 });
        await this.auditviewmore1.click();
       // click on viewmore icon2
       await this.auditviewmore2.waitFor({ state: 'visible', timeout: 10000 });
        await this.auditviewmore2.click();
        await this.page.waitForTimeout(1000); 
    }
}

module.exports = { AuditTrailSettings };