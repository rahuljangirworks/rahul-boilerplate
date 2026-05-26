import { describe, it, expect } from "vitest";
import { render } from "@react-email/components";
import React from "react";
import { WelcomeEmail } from "./welcome";
import { NotificationEmail } from "./notification";

describe("React Email Templates", () => {
  it("renders the WelcomeEmail template with custom name and contains key sections", async () => {
    const testName = "Sarah Connor";
    const html = await render(React.createElement(WelcomeEmail, { name: testName }));

    expect(html).toBeDefined();
    expect(html).toContain("Welcome,");
    expect(html).toContain(testName);
    expect(html).toContain("Explore your dashboard");
    expect(html).toContain("Create your first project");
    expect(html).toContain("Connect your integrations");
    expect(html).toContain("⚡ BOILERPLATE");
  });

  it("renders the NotificationEmail template with customized placeholders and links", async () => {
    const testTitle = "Invoice Paid Successfully";
    const testMessage = "Thank you for your payment of $29.00. Your subscription has been renewed.";
    const testActionLabel = "View Invoice";
    const testActionUrl = "https://example.com/invoices/123";

    const html = await render(
      React.createElement(NotificationEmail, {
        title: testTitle,
        message: testMessage,
        actionLabel: testActionLabel,
        actionUrl: testActionUrl,
      })
    );

    expect(html).toBeDefined();
    expect(html).toContain(testTitle);
    expect(html).toContain(testMessage);
    expect(html).toContain(testActionLabel);
    expect(html).toContain(testActionUrl);
  });
});
