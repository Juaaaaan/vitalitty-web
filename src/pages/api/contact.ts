import type { APIRoute } from 'astro';
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  RESEND_API_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { Resend } from 'resend';
import { buildEmail, singleLine, validateContact } from '../../lib/contact';

export const prerender = false;

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const antiSpamError = () =>
  json(403, { success: false, error: 'Verificación anti-spam fallida.' });

async function verifyTurnstile(token: string, ip: string | null) {
  if (!TURNSTILE_SECRET_KEY) {
    // Local development without keys: skip the challenge. Production must set it.
    return import.meta.env.DEV;
  }
  if (!token) return false;

  const form = new FormData();
  form.append('secret', TURNSTILE_SECRET_KEY);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
    });
    const outcome = (await res.json()) as { success?: boolean };
    return outcome.success === true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { success: false, error: 'Solicitud no válida.' });
  }

  // 1. Honeypot — reject silently, no detail for bots.
  const honey = (body as Record<string, unknown> | null)?._honey;
  if (typeof honey === 'string' && honey.length > 0) {
    return antiSpamError();
  }

  // 2. Turnstile
  const token = (body as Record<string, unknown> | null)?.turnstile_token;
  // clientAddress throws when the adapter can't provide it.
  const ip = (() => {
    try {
      return clientAddress;
    } catch {
      return null;
    }
  })();
  if (!(await verifyTurnstile(typeof token === 'string' ? token : '', ip))) {
    return antiSpamError();
  }

  // 3. Input validation
  const result = validateContact(body);
  if (!result.ok) {
    return json(400, { success: false, error: result.error });
  }

  // 4. Send
  const sendError = () =>
    json(500, {
      success: false,
      error: 'Error al enviar el mensaje. Inténtalo de nuevo.',
    });

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[api/contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
    return sendError();
  }

  const { subject, text } = buildEmail(result.data);
  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: singleLine(result.data.email),
      subject,
      text,
    });
    if (error) {
      // Log only the error type — never personal data from the submission.
      console.error('[api/contact] Resend error:', error.name);
      return sendError();
    }
  } catch (err) {
    console.error('[api/contact] Resend request failed:', (err as Error).name);
    return sendError();
  }

  return json(200, {
    success: true,
    message: 'Mensaje enviado correctamente.',
  });
};
