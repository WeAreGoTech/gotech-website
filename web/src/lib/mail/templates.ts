import type { LeadTopic, TicketCategory, TicketPriority } from "@/db/schema";
import { TOPIC_LABELS } from "@/features/leads/labels";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/features/tickets/labels";
import { env } from "@/lib/env";
import type { Mail } from "./send";

const SIGNATURE = "GoTech ekibi";
const join = (...lines: (string | false | null | undefined)[]) => lines.filter((l) => l !== false && l != null).join("\n");
const staffTicketUrl = (number: number) => `${env.siteUrl}/yonetim/talep/${number}`;
const customerTicketUrl = (number: number) => `${env.siteUrl}/panel/talep/${number}`;

type TicketRef = { number: number; subject: string };

export function newLeadMail(lead: { name: string; company: string | null; email: string; phone: string | null; topics: string[]; message: string | null }): Mail {
  const topics = lead.topics.map((t) => TOPIC_LABELS[t as LeadTopic] ?? t).join(", ");
  return {
    to: env.notifyEmail,
    subject: `Yeni başvuru: ${lead.name}${lead.company ? `, ${lead.company}` : ""}`,
    text: join(
      "Web sitesindeki formdan yeni bir başvuru geldi.",
      "",
      `Ad soyad: ${lead.name}`,
      lead.company && `Şirket: ${lead.company}`,
      `E-posta: ${lead.email}`,
      lead.phone && `Telefon: ${lead.phone}`,
      topics && `İlgilendiği konular: ${topics}`,
      "",
      lead.message ? `Mesaj:\n${lead.message}` : "Mesaj bırakılmadı.",
      "",
      `Tüm başvurular: ${env.siteUrl}/yonetim/basvurular`,
    ),
  };
}

export function newTicketMail(t: TicketRef & { companyName: string; authorName: string; category: TicketCategory; priority: TicketPriority; body: string }): Mail {
  return {
    to: env.notifyEmail,
    subject: `[#${t.number}] Yeni destek talebi: ${t.subject}`,
    text: join(
      `${t.companyName} firmasından ${t.authorName} yeni bir destek talebi açtı.`,
      "",
      `Konu: ${t.subject}`,
      `Tür: ${CATEGORY_LABELS[t.category]}`,
      `Öncelik: ${PRIORITY_LABELS[t.priority]}`,
      "",
      t.body,
      "",
      `Talebi açın: ${staffTicketUrl(t.number)}`,
    ),
  };
}

export function customerReplyMail(t: TicketRef & { to: string; customerName: string; companyName: string; body: string }): Mail {
  return {
    to: t.to,
    subject: `[#${t.number}] Müşteri yanıtı: ${t.subject}`,
    text: join(`${t.companyName} firmasından ${t.customerName} talebe yanıt yazdı:`, "", t.body, "", `Talebi açın: ${staffTicketUrl(t.number)}`),
  };
}

export function staffReplyMail(t: TicketRef & { to: string; recipientName: string; staffName: string; body: string }): Mail {
  return {
    to: t.to,
    subject: `[#${t.number}] Talebinize yanıt: ${t.subject}`,
    text: join(
      `Merhaba ${t.recipientName},`,
      "",
      `${t.staffName}, #${t.number} numaralı talebinize yanıt yazdı:`,
      "",
      t.body,
      "",
      `Yanıtlamak için panelinize girin: ${customerTicketUrl(t.number)}`,
      "",
      SIGNATURE,
    ),
  };
}

export function inviteMail(i: { to: string; name: string; companyName: string; link: string; validHours: number }): Mail {
  return {
    to: i.to,
    subject: "GoTech müşteri paneline davet edildiniz",
    text: join(
      `Merhaba ${i.name},`,
      "",
      `${i.companyName} için GoTech müşteri panelinde bir hesap oluşturduk. Panelden destek talebi açabilir ve yanıtları takip edebilirsiniz.`,
      "",
      "Şifrenizi belirlemek için aşağıdaki bağlantıyı kullanın:",
      i.link,
      "",
      `Bağlantı ${i.validHours} saat geçerlidir.`,
      "",
      SIGNATURE,
    ),
  };
}

export function staffInviteMail(i: { to: string; name: string; invitedBy: string; link: string; validHours: number }): Mail {
  return {
    to: i.to,
    subject: "GoTech yönetim paneline davet edildiniz",
    text: join(
      `Merhaba ${i.name},`,
      "",
      `${i.invitedBy} sizi GoTech yönetim paneline ekip üyesi olarak ekledi.`,
      "",
      "Şifrenizi belirlemek için aşağıdaki bağlantıyı kullanın:",
      i.link,
      "",
      `Bağlantı ${i.validHours} saat geçerlidir.`,
    ),
  };
}
