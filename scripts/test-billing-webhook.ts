import { argv } from "node:process";

// Configuration
const DEFAULT_TARGET_URL = "http://localhost:5173/api/webhooks/billing";
const targetUrl = argv[2] || process.env.TEST_WEBHOOK_URL || DEFAULT_TARGET_URL;

// Test user email
const TEST_EMAIL = "rahul@example.com";

// Colors for beautiful CLI output
const reset = "\x1b[0m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const cyan = "\x1b[36m";
const red = "\x1b[31m";
const bold = "\x1b[1m";

interface WebhookTestCase {
  name: string;
  provider: "stripe" | "polar" | "lemonsqueezy";
  headers: Record<string, string>;
  payload: any;
}

// Definition of Mock Payloads
const testCases: WebhookTestCase[] = [
  // --- STRIPE ---
  {
    name: "Stripe - Checkout Session Completed (Upgrade to Pro)",
    provider: "stripe",
    headers: {
      "stripe-signature": "t=123456,v1=mock_signature_for_testing",
    },
    payload: {
      id: "evt_stripe_checkout_completed",
      type: "checkout.session.completed",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "cs_test_stripe_session_99238",
          customer: "cus_stripe_rahul_10293",
          customer_details: {
            email: TEST_EMAIL,
            name: "Rahul Jangir",
          },
          status: "complete",
        },
      },
    },
  },
  {
    name: "Stripe - Subscription Updated (Downgrade/Reset)",
    provider: "stripe",
    headers: {
      "stripe-signature": "t=123456,v1=mock_signature_for_testing",
    },
    payload: {
      id: "evt_stripe_subscription_updated",
      type: "customer.subscription.updated",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "sub_stripe_active_id",
          customer: "cus_stripe_rahul_10293",
          status: "past_due", // Will result in Starter tier
        },
      },
    },
  },
  {
    name: "Stripe - Subscription Deleted (Cancellation)",
    provider: "stripe",
    headers: {
      "stripe-signature": "t=123456,v1=mock_signature_for_testing",
    },
    payload: {
      id: "evt_stripe_subscription_deleted",
      type: "customer.subscription.deleted",
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: "sub_stripe_active_id",
          customer: "cus_stripe_rahul_10293",
          status: "canceled",
        },
      },
    },
  },

  // --- POLAR ---
  {
    name: "Polar - Subscription Created (Upgrade to Pro)",
    provider: "polar",
    headers: {
      "x-polar-signature": "mock_polar_sig_abc_123",
    },
    payload: {
      event: "subscription.created",
      data: {
        id: "sub_polar_xyz_7726",
        user_id: "usr_polar_rahul_8923",
        status: "active",
        email: TEST_EMAIL,
        user: {
          email: TEST_EMAIL,
          name: "Rahul Jangir",
        },
      },
    },
  },
  {
    name: "Polar - Subscription Revoked (Cancellation)",
    provider: "polar",
    headers: {
      "x-polar-signature": "mock_polar_sig_abc_123",
    },
    payload: {
      event: "subscription.revoked",
      data: {
        id: "sub_polar_xyz_7726",
        user_id: "usr_polar_rahul_8923",
        status: "revoked",
        email: TEST_EMAIL,
        user: {
          email: TEST_EMAIL,
        },
      },
    },
  },

  // --- LEMONSQUEEZY ---
  {
    name: "LemonSqueezy - Subscription Created (Upgrade to Pro)",
    provider: "lemonsqueezy",
    headers: {
      "x-lemon-squeezy-signature": "mock_lemon_squeezy_sig_123",
    },
    payload: {
      meta: {
        event_name: "subscription_created",
      },
      data: {
        id: "sub_lemon_99283",
        type: "subscriptions",
        attributes: {
          customer_id: 882931,
          user_email: TEST_EMAIL,
          status: "active",
        },
      },
    },
  },
  {
    name: "LemonSqueezy - Subscription Cancelled (Downgrade)",
    provider: "lemonsqueezy",
    headers: {
      "x-lemon-squeezy-signature": "mock_lemon_squeezy_sig_123",
    },
    payload: {
      meta: {
        event_name: "subscription_cancelled",
      },
      data: {
        id: "sub_lemon_99283",
        type: "subscriptions",
        attributes: {
          customer_id: 882931,
          user_email: TEST_EMAIL,
          status: "cancelled",
        },
      },
    },
  },
];

async function runTest(testCase: WebhookTestCase) {
  console.log(`\n${bold}${cyan}Running test: ${testCase.name}${reset}`);
  console.log(`${blue}Target URL:${reset} ${targetUrl}`);
  console.log(`${blue}Headers:${reset}`, JSON.stringify(testCase.headers, null, 2));

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...testCase.headers,
      },
      body: JSON.stringify(testCase.payload),
    });

    const statusText = response.status >= 200 && response.status < 300 
      ? `${green}${response.status} ${response.statusText}${reset}` 
      : `${red}${response.status} ${response.statusText}${reset}`;

    console.log(`${blue}Response Status:${reset} ${statusText}`);

    const text = await response.text();
    let json: any;
    try {
      json = JSON.parse(text);
      console.log(`${blue}Response JSON:${reset}`, JSON.stringify(json, null, 2));
    } catch {
      console.log(`${blue}Response Text:${reset}`, text);
    }
  } catch (error: any) {
    console.error(`${red}Fetch Error:${reset}`, error.message || error);
  }
}

async function main() {
  console.log(`${bold}${yellow}====================================================${reset}`);
  console.log(`${bold}${yellow}      BILLING WEBHOOK SIMULATION TEST RUNNER        ${reset}`);
  console.log(`${bold}${yellow}====================================================${reset}`);
  console.log(`Using target webhook endpoint: ${bold}${targetUrl}${reset}`);
  console.log(`Simulating events targeting user: ${bold}${TEST_EMAIL}${reset}`);

  // Run all tests sequentially
  for (const tc of testCases) {
    await runTest(tc);
    // Pause briefly between requests
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.log(`\n${bold}${green}====================================================${reset}`);
  console.log(`${bold}${green}              SIMULATION RUN COMPLETED              ${reset}`);
  console.log(`${bold}${green}====================================================${reset}`);
}

main().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
