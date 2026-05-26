import { test, expect } from "@playwright/test";

test("AI Chat Dashboard Page", async ({ page }) => {
  const randomEmail = `test-${Date.now()}@example.com`;

  // 1. Sign up to get a session
  await page.goto("/auth/sign-up");
  await page.fill("#name", "Test User");
  await page.fill("#email", randomEmail);
  await page.fill("#password", "password123");
  await page.click('button[type="submit"]');

  // 2. Wait for redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/);

  // 3. Navigate directly to /dashboard/chat
  await page.goto("/dashboard/chat");

  // 4. Verify Chat UI renders
  await expect(page.locator("text=AI Chat Assistant")).toBeVisible();
  
  // Verify that the textarea input placeholder is visible
  const textarea = page.locator("textarea[placeholder='Type your message here...']");
  await expect(textarea).toBeVisible();

  // 5. Verify custom quick start prompt chips exist
  await expect(page.locator("text=Summarize projects")).toBeVisible();
  await expect(page.locator("text=Brainstorm ideas")).toBeVisible();
  await expect(page.locator("text=Explore tech stack")).toBeVisible();

  // 6. Verify text typing is supported
  await textarea.fill("Hello, this is a test message.");
  await expect(textarea).toHaveValue("Hello, this is a test message.");
});
