const { expect } = require('@playwright/test');

class DeleteBatchSchedulingJob {
    constructor(page) {
        this.page = page;

        this.batchschedulingnavbar = this.page.locator("(//*[name()='svg'])[16]");
       this.deletebatchschdulinhg = this.page.locator("(//img[@title='Delete Schedule'])[1]");
        this.deleteconfirmation=this.page.locator("(//button[normalize-space()='CONFIRM'])[1]");

       
        
    }

    async DeleteBatchschedulejob() {
        await this.batchschedulingnavbar.click();
        await this.page.waitForTimeout(2000);

        await this.deletebatchschdulinhg.click();
        await this.page.waitForTimeout(2000);

         await this.deleteconfirmation.click();
        await this.page.waitForTimeout(2000);


// Optionally, wait for navigation or success message
await this.page.waitForTimeout(2000);
    }
}

module.exports = { DeleteBatchSchedulingJob };