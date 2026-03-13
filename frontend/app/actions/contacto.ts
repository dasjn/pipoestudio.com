"use server";

import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.CONTACTO_FROM_EMAIL ?? "onboarding@resend.dev";

async function getToEmail(): Promise<string> {
  try {
    const settings = await client.fetch(settingsQuery);
    if (settings?.contactEmail) return settings.contactEmail;
  } catch {
    // fall through to env fallback
  }
  return process.env.CONTACTO_TO_EMAIL ?? "hola@fugu.studio";
}

export type ContactoState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function enviarContacto(
  _prev: ContactoState,
  formData: FormData,
): Promise<ContactoState> {
  const idea = formData.get("idea") as string;
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;
  const fotoFiles = formData.getAll("fotos") as File[];

  // Basic validation
  if (!idea?.trim() || !nombre?.trim() || !email?.trim() || !telefono?.trim()) {
    return { status: "error", message: "Faltan campos obligatorios." };
  }

  // Build attachments from uploaded images
  const attachments: { filename: string; content: Buffer }[] = [];
  for (const file of fotoFiles) {
    if (file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer });
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="background:#00A750;color:#fff;padding:12px 16px;border-radius:6px 6px 0 0;margin:0">
        Nueva idea de ${nombre}
      </h2>
      <div style="background:#E4E5E0;padding:16px;border-radius:0 0 6px 6px">
        <p style="margin:0 0 8px"><strong>IDEA:</strong></p>
        <p style="margin:0 0 16px;white-space:pre-wrap">${idea}</p>
        <p style="margin:0 0 4px"><strong>NOMBRE:</strong> ${nombre}</p>
        <p style="margin:0 0 4px"><strong>EMAIL:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin:0"><strong>TELÉFONO:</strong> ${telefono}</p>
        ${attachments.length > 0 ? `<p style="margin:8px 0 0;color:#6F6F6F">${attachments.length} foto(s) adjunta(s)</p>` : ""}
      </div>
    </div>
  `;

  const toEmail = await getToEmail();

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: email,
      subject: `Nueva idea de ${nombre}`,
      html,
      attachments,
    });

    return { status: "success" };
  } catch (err) {
    console.error("[contacto] Resend error:", err);
    return {
      status: "error",
      message: "Error al enviar. Inténtalo de nuevo.",
    };
  }
}
