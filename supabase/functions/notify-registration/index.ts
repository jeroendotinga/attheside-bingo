import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationNotificationRequest {
  naam: string;
  email: string;
  telefoon: string;
  aantalKaarten: number;
  totaalPrijs: number;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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

    const { naam, email, telefoon, aantalKaarten, totaalPrijs }: RegistrationNotificationRequest = await req.json();

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "De Grote Bingo Sing a Long Show <onboarding@resend.dev>",
        to: ["jeroen@attheside.nl"],
        subject: `Nieuwe aanmelding: ${naam} (${aantalKaarten} kaart${aantalKaarten > 1 ? 'en' : ''})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ec4899;">Nieuwe Aanmelding!</h1>
            <p>Er is een nieuwe aanmelding binnengekomen voor De Grote Bingo Sing a Long Show:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Naam:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${naam}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Telefoon:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${telefoon}">${telefoon}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Aantal kaarten:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${aantalKaarten}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Totaal bedrag:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #ec4899; font-weight: bold;">€${totaalPrijs}</td>
              </tr>
            </table>
            
            <p style="color: #666; font-size: 14px;">
              Vergeet niet om een betaallink te sturen naar ${email}!
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">
              Dit is een automatisch bericht van De Grote Bingo Sing a Long Show
            </p>
          </div>
        `,
      }),
    });

    const result = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({ error: result }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Notification email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-registration function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
