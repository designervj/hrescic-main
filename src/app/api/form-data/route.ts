import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { proxyRequest } from "@/lib/apiProxy";

export async function POST(req: NextRequest) {
  try {
    // Clone the request to read its body for emails, preserving the original for proxyRequest
    const clonedReq = req.clone();
    
    const bodyText = await clonedReq.text();
    let body: any = {};
    try {
      body = JSON.parse(bodyText);
    } catch {
      // Ignored
    }

    if (process.env.LEAD_EMAIL_NOTIFICATIONS_ENABLED === "true" || process.env.LEAD_EMAIL_NOTIFICATIONS_ENABLED === "1") {
      console.log("Attempting to send email. SMTP_HOST:", process.env.SMTP_HOST);
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const formTypeFormatted = body.formType === 'demo' ? 'Demo Request' : body.formType === 'ask' ? 'Ask Request' : (body.formType || 'Website Submission');

        let emailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div style="background-color: #0F0F3D; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Lead from Hrescic</h1>
                <p style="color: #a0a0c0; margin: 10px 0 0 0; font-size: 15px;">You have received a new <strong>${formTypeFormatted}</strong></p>
              </div>
              <div style="padding: 30px 40px;">
                <table style="width: 100%; border-collapse: collapse;">
        `;

        const addRow = (label: string, value: any) => {
          if (!value) return;
          emailHtml += `
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; width: 30%; color: #666; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${label}</td>
              <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; width: 70%; color: #222; font-size: 15px; line-height: 1.5;">${String(value).replace(/\n/g, '<br>')}</td>
            </tr>
          `;
        };

        addRow("Name", body.name);
        
        if (body.email) {
          addRow("Email", `<a href="mailto:${body.email}" style="color: #37C100; text-decoration: none; font-weight: 500;">${body.email}</a>`);
        }
        
        addRow("Company", body.company);
        
        if (body.website) {
          addRow("Website", `<a href="${body.website.startsWith('http') ? body.website : 'https://' + body.website}" target="_blank" style="color: #37C100; text-decoration: none; font-weight: 500;">${body.website}</a>`);
        }
        
        addRow("Message", body.message);

        if (body.submission) {
          Object.entries(body.submission).forEach(([key, value]) => {
            addRow(key, value);
          });
        }

        emailHtml += `
                </table>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="margin: 0; font-size: 13px; color: #888;">This email was automatically generated from your website's contact form.</p>
              </div>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
          to: process.env.LEAD_NOTIFY_TO?.split(",").map(e => e.trim()),
          subject: `New Lead from ${body.name || body.formType || "Website"}`,
          html: emailHtml,
          replyTo: body.email,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully.");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    // Forward the original submission to the proxy target
    const targetPath = "form-data/";
    return proxyRequest(req, targetPath);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: "Server error processing submission" }, { status: 500 });
  }
}
