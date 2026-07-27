// Resend ile işlem e-postaları (hoş geldin, sipariş onayı, kargo/durum bildirimi).
// RESEND_API_KEY tanımlı değilse gönderim sessizce atlanır (loglanır) —
// site akışı asla e-posta yüzünden kırılmaz.
//
// Kurulum: https://resend.com → API Key → .env / Vercel'e RESEND_API_KEY ekle.
// Alan adı doğrulanana kadar Resend yalnızca hesap sahibinin adresine gönderir;
// alan adı doğrulanınca MAIL_FROM "Gri Akvaryum <siparis@griakvaryum.com>" yapılmalı.

import {
  ORDER_STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
} from "./orders";
import { formatPrice } from "./easytrade";

const RESEND_API = "https://api.resend.com/emails";

function mailFrom(): string {
  return process.env.MAIL_FROM ?? "Gri Akvaryum <onboarding@resend.dev>";
}

function adminEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS ?? "cihanelibol47@gmail.com,griakvaryum@gmail.com"
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  if (!emailConfigured()) {
    console.log(`[email atlandı - RESEND_API_KEY yok] ${opts.subject}`);
    return;
  }
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mailFrom(),
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("Resend hatası:", res.status, await res.text());
    }
  } catch (err) {
    console.error("E-posta gönderilemedi:", err);
  }
}

/* ---------------- Şablon parçaları ---------------- */

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;padding:0;background:#04101c;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;padding-bottom:24px;">
      <span style="font-size:22px;font-weight:800;color:#ffffff;">Gri<span style="color:#22d3ee;">Akvaryum</span></span>
    </div>
    <div style="background:#0a1f33;border:1px solid rgba(34,211,238,0.2);border-radius:16px;padding:28px;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#ffffff;">${title}</h1>
      ${body}
    </div>
    <p style="text-align:center;color:#64809a;font-size:11px;margin-top:20px;">
      GRİ AKVARYUM &amp; BALIK GALERİSİ — İstanbul<br/>
      Bu e-posta işlem bilgilendirmesidir; pazarlama iletisi değildir.
    </p>
  </div>
</body>
</html>`;
}

const p = (text: string) =>
  `<p style="margin:0 0 12px;color:#b8cbd9;font-size:14px;line-height:1.6;">${text}</p>`;

function orderTable(order: OrderRecord): string {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:6px 0;color:#b8cbd9;font-size:13px;">${i.name}</td>
        <td style="padding:6px 0;color:#b8cbd9;font-size:13px;text-align:right;white-space:nowrap;">${i.qty} × ${formatPrice(i.price)}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0;border-top:1px solid rgba(34,211,238,0.15);border-bottom:1px solid rgba(34,211,238,0.15);">
    ${rows}
    <tr>
      <td style="padding:10px 0;color:#ffffff;font-weight:700;font-size:14px;">Toplam</td>
      <td style="padding:10px 0;color:#22d3ee;font-weight:700;font-size:14px;text-align:right;">${formatPrice(order.total)}</td>
    </tr>
  </table>`;
}

/* ---------------- Gönderimler ---------------- */

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Gri Akvaryum'a Hoş Geldiniz! 🐠",
    html: layout(
      `Hoş geldiniz, ${name}!`,
      p("Gri Akvaryum ailesine katıldığınız için teşekkür ederiz.") +
        p(
          "1.900'den fazla ürün, canlı balıklar, premium yemler ve profesyonel ekipmanlar sizi bekliyor. Hesabınızdan adreslerinizi kaydedebilir, siparişlerinizi takip edebilirsiniz."
        ) +
        `<a href="https://griakvaryum.vercel.app/urunler" style="display:inline-block;margin-top:8px;background:linear-gradient(90deg,#06b6d4,#14b8a6);color:#04101c;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">Alışverişe Başla</a>`
    ),
  });
}

export async function sendOrderReceivedEmail(order: OrderRecord): Promise<void> {
  await sendEmail({
    to: order.email,
    subject: `Siparişiniz Alındı — ${order.id}`,
    html: layout(
      "Siparişiniz Alındı! 🎉",
      p(`Sayın ${order.customerName},`) +
        p(
          `<strong style="color:#ffffff;">${order.id}</strong> numaralı siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp durum güncellemeleri bu adrese iletilecek.`
        ) +
        orderTable(order) +
        p(`<strong style="color:#ffffff;">Teslimat adresi:</strong> ${order.addressText}`)
    ),
  });
}

export async function sendAdminNewOrderEmail(order: OrderRecord): Promise<void> {
  await sendEmail({
    to: adminEmails(),
    subject: `🔔 Yeni Sipariş — ${order.id} (${formatPrice(order.total)})`,
    html: layout(
      "Yeni Sipariş Geldi",
      p(`<strong style="color:#ffffff;">Müşteri:</strong> ${order.customerName} — ${order.phone} — ${order.email}`) +
        p(`<strong style="color:#ffffff;">Adres:</strong> ${order.addressText}`) +
        orderTable(order) +
        `<a href="https://griakvaryum.vercel.app/admin" style="display:inline-block;margin-top:8px;background:linear-gradient(90deg,#06b6d4,#14b8a6);color:#04101c;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">Yönetim Paneli</a>`
    ),
  });
}

export async function sendOrderStatusEmail(
  order: OrderRecord,
  status: OrderStatus,
  note?: string
): Promise<void> {
  const label = ORDER_STATUS_LABELS[status];
  let extra = "";
  if (status === "kargoda" && order.cargo?.firma) {
    extra = p(
      `<strong style="color:#ffffff;">Kargo firması:</strong> ${order.cargo.firma}` +
        (order.cargo.takipNo
          ? `<br/><strong style="color:#ffffff;">Takip numarası:</strong> ${order.cargo.takipNo}`
          : "")
    );
  }
  await sendEmail({
    to: order.email,
    subject: `Sipariş Durumu: ${label} — ${order.id}`,
    html: layout(
      `Siparişiniz: ${label}`,
      p(`Sayın ${order.customerName},`) +
        p(
          `<strong style="color:#ffffff;">${order.id}</strong> numaralı siparişinizin durumu <strong style="color:#22d3ee;">${label}</strong> olarak güncellendi.`
        ) +
        extra +
        (note ? p(`<strong style="color:#ffffff;">Not:</strong> ${note}`) : "") +
        orderTable(order)
    ),
  });
}
