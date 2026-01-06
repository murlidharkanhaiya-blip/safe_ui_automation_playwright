const { expect } = require('@playwright/test');

class ViewBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        this.batchschedulingnavbar = this.page.locator("(//*[name()='svg'])[16]");
        this.monthalymailbutton = this.page.locator("(//div[contains(text(),'Monthly Mail')])[1]");
        this.viewbatchschedulingjob = this.page.locator("(//img[@title='View Batch Scheduling Details'])[1]");
        
    }

    async viewBatchschedulingjob() {
        // Navigate to batch scheduling
        await this.batchschedulingnavbar.click();
        await this.page.waitForTimeout(2000);

        // Select Monthly Mail scheduler
        await this.monthalymailbutton.click();
        await this.page.waitForTimeout(2000);

        // view scheduler
        await this.viewbatchschedulingjob.click();
        await this.page.waitForTimeout(2000);
        

       
    }
}

module.exports = { ViewBatchSchedulingJob };
