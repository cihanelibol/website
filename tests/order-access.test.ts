import { it, expect } from "vitest";
import { orderAccessToken, validOrderAccess, grantOrderAccess } from "../lib/order-access";
import { reserveOrder, getCustomerOrder } from "../lib/orders";
import { cookieJar } from "./setup";

it("requires an unexpired receipt capability bound to the requested order", async () => {
  const { order } = await reserveOrder({ userId: null, customerName: "Buyer", email: "buyer@example.test", phone: "05555555555", addressText: "Private delivery address", items: [], total: 10, paymentMethod: "iyzico", paymentStatus: "beklemede" }, "request", "fingerprint");
  const token = orderAccessToken(order.id);
  expect(await getCustomerOrder(order.id)).toBeUndefined();
  expect((await getCustomerOrder(order.id, token))?.addressText).toBe("Private delivery address");
  expect(validOrderAccess("GA-AAAAAAAAAAAAAAAAAAAAAAAA", token)).toBe(false);
  expect(validOrderAccess(order.id, orderAccessToken(order.id, Date.now() - 31 * 86400_000))).toBe(false);
  expect(validOrderAccess(order.id, token.slice(0, -1) + (token.endsWith("a") ? "b" : "a"))).toBe(false);
  await grantOrderAccess(order.id);
  expect((await getCustomerOrder(order.id))?.id).toBe(order.id);
  const cookie = [...cookieJar.values()][0];
  expect(cookie.options).toMatchObject({ httpOnly: true, sameSite: "lax" });
  expect(await getCustomerOrder(order.id)).not.toHaveProperty("requestKey");
});
