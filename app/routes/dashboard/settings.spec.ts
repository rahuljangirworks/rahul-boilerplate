import { test, expect } from "@playwright/test";

test.describe("Settings & Onboarding E2E Smoke Test", () => {
  test("should register a user, trigger onboarding, and modify profile & theme", async ({ page }) => {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomEmail = `tester-${uniqueId}@example.com`;
    const initialName = "E2E Tester";

    // 1. Visit Sign Up page
    await page.goto("/auth/sign-up");
    await expect(page).toHaveTitle(/Create Account/);

    // 2. Register a new user session
    await page.fill("#name", initialName);
    await page.fill("#email", randomEmail);
    await page.fill("#password", "password123");
    await page.click("button:has-text('Create Account')");

    // 3. Wait to be redirected to dashboard layout
    await page.waitForURL("**/dashboard");
    
    // 4. Navigate to Settings page
    await page.goto("/dashboard/settings");
    await page.waitForURL("**/dashboard/settings");

    // 5. Verify onboarding dialog pops up automatically for new user session
    const onboardNameInput = page.locator("#onboardName");
    await expect(onboardNameInput).toBeVisible({ timeout: 5000 });
    
    // Enter display name in onboarding Step 1
    const onboardingDisplayName = `Developer ${uniqueId}`;
    await onboardNameInput.fill(onboardingDisplayName);

    // Click Continue to step 2
    await page.click("button:has-text('Continue Setup')");

    // Select Dark theme in onboarding Step 2
    await page.click("button:has-text('Dark')");

    // Click Complete Setup to proceed to celebration Step 3
    await page.click("button:has-text('Complete Setup')");

    // Click "Let's Go!" to finalize and close onboarding
    await page.click("button:has-text('Let\'s Go!')");

    // 6. Verify onboarding dialog is successfully dismissed and settings page is active
    await expect(onboardNameInput).not.toBeVisible();
    await expect(page.locator("h1:has-text('Account Settings')")).toBeVisible();

    // 7. Verify settings display name matches the onboarded display name
    const settingsNameInput = page.locator("#displayName");
    await expect(settingsNameInput).toHaveValue(onboardingDisplayName);

    // 8. Verify the Light theme preference option on settings page can be selected
    const settingsLightThemeBtn = page.locator("button:has-text('Light')").first();
    await expect(settingsLightThemeBtn).toBeVisible();
    await settingsLightThemeBtn.click();
    
    // 9. Update the settings display name and click Save
    const finalName = `Finished E2E ${uniqueId}`;
    await settingsNameInput.fill(finalName);
    await page.click("button:has-text('Save Profile Changes')");

    // Verify settings input matches the updated value
    await expect(settingsNameInput).toHaveValue(finalName);
  });
});
