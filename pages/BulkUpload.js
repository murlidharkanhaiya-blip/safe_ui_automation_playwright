const { expect } = require('@playwright/test');
const path = require('path');

class BulkUpload {
  constructor(page) {
    this.page = page;

    // Sidebar icon for Bulk Upload
   this.bulkUploadNavbar =
      "(//a[@data-testid='nav-link' and @href='/bulk-upload'])[2]";

    // Container that wraps the drag/drop area and the real <input type="file">
    this.dropBlock = page.getByTestId('drop-block_input');

    // The actual file input inside the drop block (enabled one)
    this.fileInput = this.dropBlock.locator("input[type='file']:not([disabled])").first();

    // (Optional) the visible label button, if you ever need to click it
    this.chooseFileLabel = page.locator("//label[contains(@class,'custom-file-upload') and normalize-space()='Choose File']");
  }

  async Bulkuploadfile() {
    // Open Bulk Upload page/section
    await this.page.locator(this.bulkUploadNavbar).click();

   
    await this.dropBlock.waitFor({ state: 'visible', timeout: 15000 });
    await this.dropBlock.scrollIntoViewIfNeeded();

   
    await this.fileInput.waitFor({ state: 'attached', timeout: 15000 });

    // File to upload
    const filePath = path.resolve('tests/TestData_File/sample_file_bulkupload_sample (1).csv');

    // Try to set the file on the scoped input
    try {
      await this.fileInput.setInputFiles(filePath);
    } catch (err) {
      // Fallback: if the input was moved/detached, grab the first enabled file input on the page
      const fallbackInput = this.page.locator("input[type='file']:not([disabled])").first();
      await fallbackInput.waitFor({ state: 'attached', timeout: 5000 });
      await fallbackInput.setInputFiles(filePath);
    }

    // Small wait to let UI react (toast/progress etc.)
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { BulkUpload };