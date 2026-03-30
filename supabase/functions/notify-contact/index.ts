import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface ContactRequest {
  naam: string;
  email: string;
  bericht: string;
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

    const { naam, email, bericht }: ContactRequest = await req.json();

    const safeNaam = escapeHtml(naam);
    const safeEmail = escapeHtml(email);
    const safeBericht = escapeHtml(bericht).replace(/\n/g, "<br>");

    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #3b82f633;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Nieuw Contactbericht</h1>
          <p style="margin:8px 0 0;color:#ffffffcc;font-size:14px;">via singalongbingoshow.nl</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">

          <!-- Sender info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:12px;border:1px solid #ffffff15;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;width:100px;">Van</td>
                  <td style="padding:8px 0;color:#fff;font-size:15px;font-weight:600;">${safeNaam}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #ffffff10;"></td></tr>
                <tr>
                  <td style="padding:8px 0;color:#999;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#3b82f6;text-decoration:none;font-size:15px;">${safeEmail}</a></td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Message -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:12px;border:1px solid #ffffff15;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 8px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Bericht</p>
              <p style="margin:0;color:#ddd;font-size:15px;line-height:1.7;">${safeBericht}</p>
            </td></tr>
          </table>

          <!-- Reply button -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr><td align="center">
              <a href="mailto:${safeEmail}?subject=Re: Contactbericht via singalongbingoshow.nl" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:700;">
                Beantwoorden
              </a>
            </td></tr>
          </table>

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
        reply_to: email,
        subject: `Contactbericht van ${safeNaam}`,
        html: adminHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({ error: "Email could not be sent" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Contact notification email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in notify-contact function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
