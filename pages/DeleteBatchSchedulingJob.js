const { expect } = require('@playwright/test');

class DeleteBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        this.batchschedulingnavbar = "//div[contains(@class,'fixed-left-sidebar')]//li[@data-tip='Batch Scheduling']//a[@data-testid='nav-link']";
       this.deletebatchschdulinhg = this.page.locator("(//img[@title='Delete Schedule'])[1]");
        this.deleteconfirmation=this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");

       
        
    }

    async DeleteBatchschedulejob() {
        // batch scheduling nav view click
         /* Step 1: Click batch scheduling (sidebar only) */
   const batchschedulingnav = this.page.locator(this.batchschedulingnavbar);
  await batchschedulingnav.waitFor({ state: 'visible', timeout: 15000 });
  await batchschedulingnav.click();

        await this.deletebatchschdulinhg.click();
        await this.page.waitForTimeout(2000);

         await this.deleteconfirmation.click();
        await this.page.waitForTimeout(2000);


// Optionally, wait for navigation or success message
await this.page.waitForTimeout(2000);
    }
}

module.exports = { DeleteBatchSchedulingJob };