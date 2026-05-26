import { test, expect } from "@playwright/test";

test.describe("Email Admin Dashboard E2E Smoke Test", () => {
  const uniqueEmail = `test-${Math.random().toString(36).substring(2, 11)}@example.com`;
  const testPassword = "Password123!";

  test("should sign up, navigate to emails dashboard, and verify previews and forms", async ({ page }) => {
    // 1. Sign up a new user to gain dashboard access
    await page.goto("/auth/sign-up");
    await expect(page).toHaveTitle(/Create Account/);

    await page.fill('input[id="name"]', "E2E Tester");
    await page.fill('input[id="email"]', uniqueEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL("**/dashboard");
    await expect(page.locator("h1")).toContainText("Welcome back");

    // 2. Navigate to the Email Administration Dashboard
    await page.goto("/dashboard/emails");
    await page.waitForURL("**/dashboard/emails");

    // Verify the page title/header
    await expect(page.locator("h1")).toContainText("Email System");

    // 3. Verify templates list elements
    const welcomeTemplateButton = page.locator("button:has-text('Welcome Email')");
    const notifTemplateButton = page.locator("button:has-text('Transactional Alert')");
    await expect(welcomeTemplateButton).toBeVisible();
    await expect(notifTemplateButton).toBeVisible();

    // 4. Verify preview mode switcher tabs
    const desktopTab = page.locator("button:has-text('Desktop')");
    const mobileTab = page.locator("button:has-text('Mobile')");
    const htmlTab = page.locator("button:has-text('HTML Source')");
    await expect(desktopTab).toBeVisible();
    await expect(mobileTab).toBeVisible();
    await expect(htmlTab).toBeVisible();

    // Verify default preview iframe (Desktop) is present
    const desktopIframe = page.locator('iframe[title="Desktop Email Preview"]');
    await expect(desktopIframe).toBeVisible();

    // Switch to Mobile view and verify mobile iframe
    await mobileTab.click();
    const mobileIframe = page.locator('iframe[title="Mobile Email Preview"]');
    await expect(mobileIframe).toBeVisible();

    // Switch to HTML Source view and verify source view elements
    await htmlTab.click();
    await expect(page.locator("button:has-text('Copy Code')")).toBeVisible();
    await expect(page.locator("pre")).toBeVisible();

    // 5. Verify the Test Delivery forms
    // Go back to desktop view
    await desktopTab.click();

    // Check common email recipient field is pre-populated
    const recipientInput = page.locator('input[id="test-email"]');
    await expect(recipientInput).toBeVisible();
    await expect(recipientInput).toHaveValue(uniqueEmail);

    // Verify test send button exists
    const sendButton = page.locator("button:has-text('Send Test Email')");
    await expect(sendButton).toBeVisible();

    // Click on Transactional Alert template and verify fields update
    await notifTemplateButton.click();

    // Check title/subject and message textareas are shown for notifications
    const subjectInput = page.locator('input[id="notif-title"]');
    const messageTextarea = page.locator('textarea[id="notif-message"]');
    await expect(subjectInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
    await expect(subjectInput).toHaveValue("Security Alert: New Sign-in");
  });
});
