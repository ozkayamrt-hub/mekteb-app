import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? 'Mekteb <onboarding@resend.dev>'

export async function sendGroupApplicationEmail({
  leaderEmail, leaderName, groupTitle, applicantName,
}: { leaderEmail: string; leaderName: string; groupTitle: string; applicantName: string }) {
  await resend.emails.send({
    from: FROM,
    to: leaderEmail,
    subject: `Yeni başvuru: ${groupTitle}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#1a3a2a">Mekteb — Yeni Grup Başvurusu</h2>
        <p>Merhaba <strong>${leaderName}</strong>,</p>
        <p><strong>${applicantName}</strong> adlı psikolog <em>${groupTitle}</em> grubunuza katılmak için başvurdu.</p>
        <p>Başvuruyu incelemek için panele giriş yapın:</p>
        <a href="https://mekteb.vercel.app/panel/supervizyon"
           style="display:inline-block;background:#1a3a2a;color:#c9a96e;padding:12px 24px;text-decoration:none;font-family:Georgia,serif;margin:16px 0">
          Başvuruyu İncele →
        </a>
        <p style="color:#666;font-size:.85rem">Mekteb · Türkiye'nin Psikoloji Okulu</p>
      </div>
    `,
  })
}

export async function sendApplicationResultEmail({
  applicantEmail, applicantName, groupTitle, approved,
}: { applicantEmail: string; applicantName: string; groupTitle: string; approved: boolean }) {
  await resend.emails.send({
    from: FROM,
    to: applicantEmail,
    subject: approved ? `Başvurunuz onaylandı — ${groupTitle}` : `Başvurunuz hakkında — ${groupTitle}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#1a3a2a">Mekteb — Başvuru Sonucu</h2>
        <p>Merhaba <strong>${applicantName}</strong>,</p>
        ${approved
          ? `<p><em>${groupTitle}</em> grubuna başvurunuz <strong style="color:#1a7a3a">onaylandı</strong>. Artık grup kanalına erişebilirsiniz.</p>
             <a href="https://mekteb.vercel.app/panel/supervizyon"
                style="display:inline-block;background:#1a3a2a;color:#c9a96e;padding:12px 24px;text-decoration:none;font-family:Georgia,serif;margin:16px 0">
               Kanala Git →
             </a>`
          : `<p><em>${groupTitle}</em> grubuna başvurunuz bu kez kabul edilemedi. Diğer gruplara başvurabilirsiniz.</p>
             <a href="https://mekteb.vercel.app/panel/supervizyon"
                style="display:inline-block;background:#1a3a2a;color:#c9a96e;padding:12px 24px;text-decoration:none;font-family:Georgia,serif;margin:16px 0">
               Gruplara Bak →
             </a>`
        }
        <p style="color:#666;font-size:.85rem">Mekteb · Türkiye'nin Psikoloji Okulu</p>
      </div>
    `,
  })
}
