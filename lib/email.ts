import "server-only";
import { appOrigin } from "./security";
import { escapeHtml as esc } from "./email-text";
import { boundedJson, object } from "./http";
// Resend ile işlem e-postaları (hoş geldin, sipariş onayı, kargo/durum bildirimi).
// Gönderim yapılandırılmadıysa veya sağlayıcı reddederse çağıran işlem haberdar olur.
//
// Kurulum: https://resend.com → API Key → .env / Vercel'e RESEND_API_KEY ekle.
// Alan adı doğrulanana kadar Resend yalnızca hesap sahibinin adresine gönderir;
// alan adı doğrulanınca MAIL_FROM "Gri Akvaryum <siparis@griakvaryum.com>" yapılmalı.

import {
  ORDER_STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
} from "./order-types";
import { formatPrice } from "./product-display";
import { SITE_URL } from "./site";

const RESEND_API = "https://api.resend.com/emails";

function mailFrom(): string {
  return process.env.MAIL_FROM!;
}

function adminEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS ?? ""
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
};
export async function sendEmail(opts: EmailMessage, delivery?: { key: string; from: string }): Promise<void> {
  if (!emailConfigured()) {
    throw new Error("Email service is not configured");
  }
  if (!opts.to.length || !opts.subject || !opts.html) throw new Error("Email recipient and content required");
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      redirect: "error",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        ...(delivery ? { "Idempotency-Key": delivery.key } : {}),
      },
      body: JSON.stringify({
        from: delivery?.from ?? mailFrom(),
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      throw new Error("Email provider rejected the request");
    }
    const receipt = object(await boundedJson(res, 8192));
    if (typeof receipt.id !== "string" || !/^[a-f0-9-]{36}$/i.test(receipt.id)) throw new Error("Missing email acknowledgement");
  } catch {
    console.error("Email delivery failed; provider details redacted");
    throw new Error("Email delivery failed");
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
        <td style="padding:6px 0;color:#b8cbd9;font-size:13px;">${esc(i.name)}</td>
        <td style="padding:6px 0;color:#b8cbd9;font-size:13px;text-align:right;white-space:nowrap;">${i.qty} × ${formatPrice(i.price)}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0;border-top:1px solid rgba(34,211,238,0.15);border-bottom:1px solid rgba(34,211,238,0.15);">
    ${rows}
    ${order.shippingFee !== undefined ? `<tr><td style="padding:6px 0;color:#b8cbd9;">Kargo</td><td style="text-align:right;color:#b8cbd9;">${order.shippingFee === 0 ? "Ücretsiz" : formatPrice(order.shippingFee)}</td></tr>` : ""}
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
    subject: "Gri Akvaryum'a Hoş Geldiniz!",
    html: layout(
      `Hoş geldiniz, ${esc(name)}!`,
      p("Gri Akvaryum ailesine katıldığınız için teşekkür ederiz.") +
        p(
          "1.900'den fazla ürün, canlı balıklar, premium yemler ve profesyonel ekipmanlar sizi bekliyor. Hesabınızdan adreslerinizi kaydedebilir, siparişlerinizi takip edebilirsiniz."
        ) +
        `<a href="${SITE_URL}/urunler" style="display:inline-block;margin-top:8px;background:linear-gradient(90deg,#06b6d4,#14b8a6);color:#04101c;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">Alışverişe Başla</a>`
    ),
  });
}

export function orderReceivedMessage(order: OrderRecord): EmailMessage {
  return {
    to: order.email,
    subject: `Siparişiniz Alındı — ${order.id}`,
    html: layout(
      "Siparişiniz Alındı!",
      p(`Sayın ${esc(order.customerName)},`) +
        p(
          `<strong style="color:#ffffff;">${order.id}</strong> numaralı siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp durum güncellemeleri bu adrese iletilecek.`
        ) +
        orderTable(order) +
        p(`<strong style="color:#ffffff;">Teslimat adresi:</strong> ${esc(order.addressText)}`)
    ),
  };
}

export function adminNewOrderMessage(order: OrderRecord): EmailMessage {
  return {
    to: adminEmails(),
    subject: `Yeni Sipariş — ${order.id} (${formatPrice(order.total)})`,
    html: layout(
      "Yeni Sipariş Geldi",
      p(`<strong style="color:#ffffff;">Müşteri:</strong> ${esc(order.customerName)} — ${esc(order.phone)} — ${esc(order.email)}`) +
        p(`<strong style="color:#ffffff;">Adres:</strong> ${esc(order.addressText)}`) +
        orderTable(order) +
        `<a href="${SITE_URL}/admin" style="display:inline-block;margin-top:8px;background:linear-gradient(90deg,#06b6d4,#14b8a6);color:#04101c;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;">Yönetim Paneli</a>`
    ),
  };
}

export function orderStatusMessage(
  order: OrderRecord,
  status: OrderStatus,
  note?: string
): EmailMessage {
  const label = ORDER_STATUS_LABELS[status];
  let extra = "";
  if (status === "kargoda" && order.cargo?.firma) {
    extra = p(
      `<strong style="color:#ffffff;">Kargo firması:</strong> ${esc(order.cargo.firma)}` +
        (order.cargo.takipNo
          ? `<br/><strong style="color:#ffffff;">Takip numarası:</strong> ${esc(order.cargo.takipNo)}`
          : "")
    );
  }
  return {
    to: order.email,
    subject: `Sipariş Durumu: ${label} — ${order.id}`,
    html: layout(
      `Siparişiniz: ${label}`,
      p(`Sayın ${esc(order.customerName)},`) +
        p(
          `<strong style="color:#ffffff;">${order.id}</strong> numaralı siparişinizin durumu <strong style="color:#22d3ee;">${label}</strong> olarak güncellendi.`
        ) +
        extra +
        (note ? p(`<strong style="color:#ffffff;">Not:</strong> ${esc(note)}`) : "") +
        orderTable(order)
    ),
  };
}

export async function sendAccountEmail(email: string, token: string, purpose: "verify" | "reset"): Promise<void> {
  if (!emailConfigured()) throw new Error("Email delivery is not configured");
  const label = purpose === "verify" ? "E-posta Adresini Doğrula" : "Parolayı Yenile";
  const url = `${appOrigin()}/kimlik#${purpose}:${token}`;
  await sendEmail({ to: email, subject: label, html: layout(label,
    p("Bu bağlantı 30 dakika geçerlidir ve yalnızca bir kez kullanılabilir. İşlemi siz başlatmadıysanız bu e-postayı yok sayın.") +
    `<a href="${esc(url)}">${label}</a>`) });
}
