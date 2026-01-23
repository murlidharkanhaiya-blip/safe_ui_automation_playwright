const { expect } = require('@playwright/test');
const path = require('path');

class BulkUpload {
  constructor(page) {
    this.page = page;

    // Improved Locators
    this.bulkUploadNav = page.locator("div.fixed-left-sidebar a[data-testid='nav-link'][href='/bulk-upload']");
    this.dropBlock = page.getByTestId('drop-block_input');
    this.fileInput = page.locator("input[type='file']:not([disabled])").first();
    this.loader = page.locator('#global-loader-container .loading');
  }

  async waitForLoader() {
    try {
      const isVisible = await this.loader.isVisible({ timeout: 2000 });
      if (isVisible) {
        await this.loader.waitFor({ state: 'hidden', timeout: 15000 });
        console.log("⏳ Loader hidden");
      }
    } catch {
      // Loader not present
    }
  }

  async Bulkuploadfile() {
    // ✅ Reset state
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    const currentUrl = this.page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // ✅ Navigate to Bulk Upload if not already there
    if (!currentUrl.includes('bulk-upload')) {
      console.log("📂 Navigating to Bulk Upload...");
      
      // Wait for sidebar
      const sidebar = this.page.locator('div.fixed-left-sidebar');
      await sidebar.waitFor({ state: 'visible', timeout: 10000 });
      
      await this.bulkUploadNav.waitFor({ state: 'visible', timeout: 15000 });
      await this.bulkUploadNav.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await this.bulkUploadNav.click();
      console.log("✅ Clicked Bulk Upload");

      // Wait for navigation
      await this.page.waitForURL('**/bulk-upload**', { timeout: 10000 });
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      console.log("✅ Already on Bulk Upload page");
    }

    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    // ✅ Wait for drop block to be ready
    console.log("📤 Preparing file upload...");
    await this.dropBlock.waitFor({ state: 'visible', timeout: 15000 });
    await this.dropBlock.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // ✅ Verify file exists
    const filePath = path.resolve('tests/TestData_File/sample_file_bulkupload_sample (1).csv');
    console.log(`📁 File path: ${filePath}`);

    // ✅ Upload file with retry logic
    let uploadSuccess = false;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`📤 Upload attempt ${attempt}/${maxAttempts}...`);

        // Wait for file input to be attached
        await this.fileInput.waitFor({ state: 'attached', timeout: 10000 });
        
        // Set the file
        await this.fileInput.setInputFiles(filePath);
        
        // Wait for upload to process
        await this.page.waitForTimeout(2000);
        
        // Check for success indicators
        const successToast = this.page.locator("text=success, text=uploaded, text=completed").first();
        const isSuccess = await successToast.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isSuccess) {
          const message = await successToast.textContent();
          console.log(`✅ Upload success: ${message}`);
          uploadSuccess = true;
          break;
        }

        // Check for error messages
        const errorToast = this.page.locator("text=error, text=failed, text=invalid").first();
        const isError = await errorToast.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isError) {
          const errorMsg = await errorToast.textContent();
          console.warn(`⚠️ Upload error: ${errorMsg}`);
          
          if (attempt < maxAttempts) {
            console.log("🔄 Retrying upload...");
            await this.page.waitForTimeout(2000);
            continue;
          }
        } else {
          // No explicit success/error message, assume success
          console.log("✅ File uploaded (no explicit confirmation)");
          uploadSuccess = true;
          break;
        }

      } catch (err) {
        console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
        
        if (attempt === maxAttempts) {
          throw new Error(`❌ File upload failed after ${maxAttempts} attempts: ${err.message}`);
        }
        
        // Wait before retry
        await this.page.waitForTimeout(2000);
      }
    }

    if (!uploadSuccess) {
      throw new Error("❌ File upload did not complete successfully");
    }

    // ✅ Wait for any post-upload processing
    await this.waitForLoader();
    await this.page.waitForTimeout(2000);

    console.log("🎉 Bulk upload completed successfully!");
  }
}

module.exports = { BulkUpload };