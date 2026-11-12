"use server";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";
import { updateOrderStatus, reconcileOrder, recordManualPayment, ORDER_STATUS_FLOW, type OrderStatus } from "@/lib/orders";
import { dispatchOrderNotifications } from "@/lib/order-outbox";
import { guardRate, safeError, textField, InputError } from "@/lib/security";
import { moderateReview } from "@/lib/reviews";
export type AdminActionState = { ok?: boolean; error?: string; emailSent?: boolean; emailQueued?: boolean };
export async function updateOrderStatusAction(input: { orderId: string; status: OrderStatus; cargoFirma?: string; cargoTakipNo?: string; note?: string; notifyCustomer: boolean }): Promise<AdminActionState> {
  try {
    const admin = await getAdminUser(); if (!admin) throw new InputError("Bu işlem için yönetici doğrulaması gerekir.");
    await guardRate("admin-order", 30, 60, admin.id);
    if (!input || !ORDER_STATUS_FLOW.includes(input.status) || typeof input.notifyCustomer !== "boolean") throw new InputError("Geçersiz işlem.");
    const note = textField(input.note ?? "", 500);
    const firma = textField(input.cargoFirma ?? "", 80), takipNo = textField(input.cargoTakipNo ?? "", 80);
    const order = await updateOrderStatus(textField(input.orderId, 40, 1), input.status, { notify: input.notifyCustomer, note: note || undefined, cargo: firma || takipNo ? { firma, takipNo } : undefined });
    if (!order) throw new InputError("Sipariş bulunamadı.");
    if (input.notifyCustomer) await dispatchOrderNotifications(order.id, 3).catch(() => undefined);
    revalidatePath("/admin"); revalidatePath("/hesap/siparisler"); return { ok: true, emailQueued: input.notifyCustomer };
  } catch (error) { return { error: safeError(error) }; }
}
export async function moderateReviewAction(data: FormData) {
  const admin = await getAdminUser(); if (!admin) throw new InputError("Yönetici doğrulaması gerekir.");
  await guardRate("moderation", 30, 60, admin.id);
  const decision = data.get("decision");
  if (decision !== "approved" && decision !== "rejected") throw new InputError("Geçersiz karar.");
  const productId = await moderateReview(textField(data.get("id"), 36, 36), decision);
  revalidatePath("/admin/yorumlar"); revalidatePath(`/urunler/${productId}`);
}
export async function reconcileAction(_previous: AdminActionState, data: FormData): Promise<AdminActionState> {
  try {
    const admin = await getAdminUser(); if (!admin) throw new InputError("Yönetici doğrulaması gerekir.");
    await guardRate("admin-reconcile", 10, 60, admin.id);
    const id = textField(data.get("id"), 40, 1), reference = textField(data.get("reference"), 120, 3), note = textField(data.get("note"), 500, 10);
    if (data.get("confirmed") !== "on") throw new InputError("Harici kaydı kontrol ettiğinizi onaylayın.");
    if (data.get("kind") === "payment") await recordManualPayment(id, Number(data.get("total")), reference, note);
    else if (data.get("kind") === "submission") await reconcileOrder(id, reference, note);
    else throw new InputError("Geçersiz işlem.");
    revalidatePath("/admin"); revalidatePath("/hesap/siparisler"); return { ok: true };
  } catch (error) { return { error: safeError(error) }; }
}
