import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface RegistrationNotificationRequest {
  naam: string;
  email: string;
  telefoon: string;
  aantalKaarten: number;
  totaalPrijs: number;
  eventTitle: string;
  eventDate: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { naam, email, telefoon, aantalKaarten, totaalPrijs, eventTitle, eventDate }: RegistrationNotificationRequest = await req.json();

    const safeNaam = escapeHtml(naam);
    const safeEmail = escapeHtml(email);
    const safeTelefoon = escapeHtml(telefoon);
    const safeEventTitle = escapeHtml(eventTitle || "De Grote Bingo Sing a Long Show");
    const safeEventDate = escapeHtml(eventDate || "");

    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #ec489933;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#ec4899,#8b5cf6);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Nieuwe Aanmelding!</h1>
          <p style="margin:8px 0 0;color:#ffffffcc;font-size:14px;">${safeEventTitle}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">

          <!-- Summary card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:12px;border:1px solid #ffffff15;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;width:140px;">Naam</td>
                  <td style="padding:8px 0;color:#fff;font-size:15px;font-weight:600;">${safeNaam}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #ffffff10;"></td></tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#ec4899;text-decoration:none;font-size:15px;">${safeEmail}</a></td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #ffffff10;"></td></tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Telefoon</td>
                  <td style="padding:8px 0;"><a href="tel:${safeTelefoon}" style="color:#ec4899;text-decoration:none;font-size:15px;">${safeTelefoon}</a></td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #ffffff10;"></td></tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Event</td>
                  <td style="padding:8px 0;color:#fff;font-size:15px;">${safeEventTitle}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #ffffff10;"></td></tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Datum</td>
                  <td style="padding:8px 0;color:#fff;font-size:15px;">${safeEventDate}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Tickets & total -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#ec489915,#8b5cf615);border-radius:12px;border:1px solid #ec489933;">
            <tr><td style="padding:20px 24px;text-align:center;">
              <span style="color:#999;font-size:13px;">Aantal kaarten</span><br>
              <span style="color:#fff;font-size:28px;font-weight:800;">${aantalKaarten}</span>
              <span style="color:#999;font-size:13px;margin:0 12px;">|</span>
              <span style="color:#999;font-size:13px;">Totaal</span><br>
              <span style="color:#ec4899;font-size:28px;font-weight:800;">&euro;${totaalPrijs}</span>
            </td></tr>
          </table>

          <!-- Reminder -->
          <p style="margin:24px 0 0;padding:16px 20px;background:#fbbf2415;border:1px solid #fbbf2433;border-radius:10px;color:#fbbf24;font-size:13px;line-height:1.5;">
            Vergeet niet om een betaallink te sturen naar ${safeEmail}
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #ffffff10;text-align:center;">
          <p style="margin:0;color:#666;font-size:11px;">De Grote Bingo Sing a Long Show &mdash; automatisch bericht</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "De Grote Bingo Sing a Long Show <info@singalongbingoshow.nl>",
        to: ["info@singalongbingoshow.nl"],
        subject: `Nieuwe aanmelding: ${safeNaam} (${aantalKaarten} kaart${aantalKaarten > 1 ? "en" : ""} — €${totaalPrijs})`,
        html: adminHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
    }

    console.log("Notification email sent:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in notify-registration function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
