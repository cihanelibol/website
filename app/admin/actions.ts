"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";
import {
  updateOrderStatus,
  type OrderStatus,
  ORDER_STATUS_FLOW,
} from "@/lib/orders";
import { sendOrderStatusEmail } from "@/lib/email";

export type AdminActionState = { ok?: boolean; error?: string };

export async function updateOrderStatusAction(
  input: {
    orderId: string;
    status: OrderStatus;
    cargoFirma?: string;
    cargoTakipNo?: string;
    note?: string;
    notifyCustomer: boolean;
  }
): Promise<AdminActionState> {
  const admin = await getAdminUser();
  if (!admin) return { error: "Bu işlem için yönetici yetkisi gerekir." };

  if (!ORDER_STATUS_FLOW.includes(input.status))
    return { error: "Geçersiz durum." };

  const order = await updateOrderStatus(input.orderId, input.status, {
    note: input.note?.trim() || undefined,
    cargo:
      input.cargoFirma || input.cargoTakipNo
        ? {
            firma: input.cargoFirma?.trim() ?? "",
            takipNo: input.cargoTakipNo?.trim() ?? "",
          }
        : undefined,
  });
  if (!order) return { error: "Sipariş bulunamadı." };

  if (input.notifyCustomer) {
    sendOrderStatusEmail(order, input.status, input.note?.trim() || undefined).catch(
      () => {}
    );
  }

  revalidatePath("/admin");
  revalidatePath("/hesap/siparisler");
  return { ok: true };
}
