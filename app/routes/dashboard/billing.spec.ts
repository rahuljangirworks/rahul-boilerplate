import { test, expect } from "@playwright/test";

test.describe("Billing Dashboard E2E Smoke Test", () => {
  test("should sign up, navigate to billing page, and verify subscription UI", async ({ page }) => {
    const uniqueEmail = `billing-e2e-${Date.now()}@example.com`;

    // 1. Register a fresh user
    await page.goto("/auth/sign-up");
    await page.fill("#name", "Billing Tester");
    await page.fill("#email", uniqueEmail);
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');

    // 2. Wait for redirect to dashboard
    await page.waitForURL("**/dashboard");

    // 3. Navigate to billing page
    await page.goto("/dashboard/billing");
    await page.waitForURL("**/dashboard/billing");

    // 4. Verify page heading
    await expect(page.locator("h1")).toContainText(/billing|subscription|plan/i);

    // 5. Verify subscription tiers are displayed (Starter / Pro)
    const starterTier = page.locator("text=/starter/i").first();
    const proTier = page.locator("text=/pro/i").first();
    await expect(starterTier).toBeVisible();
    await expect(proTier).toBeVisible();
  });

  test("should have an upgrade/subscribe button that is clickable", async ({ page }) => {
    const uniqueEmail = `billing-upgrade-${Date.now()}@example.com`;

    // Sign up
    await page.goto("/auth/sign-up");
    await page.fill("#name", "Upgrade Tester");
    await page.fill("#email", uniqueEmail);
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    // Go to billing
    await page.goto("/dashboard/billing");
    await page.waitForURL("**/dashboard/billing");

    // Find the upgrade button
    const upgradeBtn = page.locator("button:has-text(/upgrade|subscribe|get pro/i), a:has-text(/upgrade|subscribe|get pro/i)").first();
    await expect(upgradeBtn).toBeVisible();
    await expect(upgradeBtn).toBeEnabled();
  });

  test("billing page should not crash with 500 error", async ({ page }) => {
    const uniqueEmail = `billing-nocrash-${Date.now()}@example.com`;

    await page.goto("/auth/sign-up");
    await page.fill("#name", "No Crash");
    await page.fill("#email", uniqueEmail);
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    // Navigate to billing and check for no errors
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes("/dashboard/billing")),
      page.goto("/dashboard/billing"),
    ]);

    // Status should be 200 (OK)
    expect(response.status()).toBe(200);

    // Ensure no crash screen is shown
    const errorHeading = page.locator("text=/application error|unexpected error|500/i");
    await expect(errorHeading).not.toBeVisible();
  });
});
