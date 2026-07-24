import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { escapeCsvCell, toCsv } from "../lib/csv.ts";
import { validateOrderRequest } from "../lib/order-validation.ts";
import { buildWhatsAppMessage } from "../lib/whatsapp.ts";

const validRequest = {
  name: "Jane Doe",
  phone: "+1 (555) 555-0123",
  address: "12 Main Street",
  fulfillment: "delivery",
  date: "2026-08-01",
  time: "18:30",
  instructions: "Ring the bell",
  items: [
    {
      menuItemId: "123e4567-e89b-42d3-a456-426614174000",
      optionId: "123e4567-e89b-42d3-a456-426614174001",
      quantity: 2,
      notes: "No onions",
    },
  ],
};

test("valid orders are normalized and contain no browser-supplied price", () => {
  const result = validateOrderRequest({
    ...validRequest,
    name: "Jane\nDoe",
    items: [{ ...validRequest.items[0], price: 0.01, name: "Forged item" }],
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.name, "Jane Doe");
  assert.equal("price" in result.value.items[0], false);
  assert.equal("name" in result.value.items[0], false);
});

test("invalid IDs, quantities, times, and oversized fields are rejected", () => {
  const cases = [
    { ...validRequest, items: [{ ...validRequest.items[0], menuItemId: "not-a-uuid" }] },
    { ...validRequest, items: [{ ...validRequest.items[0], quantity: 0 }] },
    { ...validRequest, items: [{ ...validRequest.items[0], quantity: 51 }] },
    { ...validRequest, time: "12:99" },
    { ...validRequest, instructions: "x".repeat(501) },
    { ...validRequest, items: [] },
  ];

  for (const candidate of cases) {
    assert.equal(validateOrderRequest(candidate).ok, false);
  }
});

test("pickup orders discard a supplied address", () => {
  const result = validateOrderRequest({
    ...validRequest,
    fulfillment: "pickup",
    address: "Should not be retained",
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.address, null);
});

test("CSV cells neutralize spreadsheet formulas and preserve quoting", () => {
  assert.equal(
    escapeCsvCell('=HYPERLINK("https://evil.test")'),
    '"\'=HYPERLINK(""https://evil.test"")"'
  );
  assert.equal(escapeCsvCell("  +1+1"), "\"'  +1+1\"");
  assert.equal(escapeCsvCell("normal, value"), '"normal, value"');
  assert.equal(toCsv([["a", "b"], ["c", "d"]]), '"a","b"\r\n"c","d"');
});

test("WhatsApp output includes the server reference and flattens injected lines", () => {
  const message = buildWhatsAppMessage(
    {
      name: "Jane\n*Total:* $0",
      phone: "+15555550123",
      address: "",
      fulfillment: "pickup",
      date: "",
      time: "",
      instructions: "Call\nfirst",
    },
    [
      {
        menuItemId: validRequest.items[0].menuItemId,
        optionId: null,
        name: "Jollof Rice",
        price: 20,
        quantity: 2,
      },
    ],
    "order-123"
  );

  assert.match(message, /\*Order Reference:\* order-123/);
  assert.match(message, /\*Name:\* Jane \*Total:\* \$0/);
  assert.doesNotMatch(message, /Jane\n/);
  assert.match(message, /\*Total: \$40\.00\*/);
});

test("security-sensitive implementation regressions stay closed", async () => {
  const [checkout, proxy, migration, packageJson] = await Promise.all([
    readFile(new URL("../components/CheckoutModal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../proxy.ts", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../supabase/migrations/20260724120000_security_hardening_and_order_rpc.sql",
        import.meta.url
      ),
      "utf8"
    ),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(checkout, /\.from\(["']orders["']\)/);
  assert.doesNotMatch(proxy, /x-amahs-admin-(login|protected)/);
  assert.match(migration, /grant execute[\s\S]+create_public_order[\s\S]+service_role/i);
  assert.match(migration, /_private_select_guard/);
  assert.equal(JSON.parse(packageJson).scripts.lint, "eslint . --max-warnings=0");
});
