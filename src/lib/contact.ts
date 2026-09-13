export const ORIGENES = [
  'contacto',
  'nutricion',
  'fisioterapia',
  'colaboraciones',
] as const;

export type Origen = (typeof ORIGENES)[number];

export const LIMITES = {
  nombre: 100,
  apellido: 100,
  email: 250,
  telefono: 20,
  mensaje: 2000,
} as const;

export interface ContactPayload {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  mensaje: string;
  origen: Origen;
  consentimiento: true;
  turnstile_token: string;
  _honey?: string;
}

export type ValidationResult =
  { ok: true; data: ContactPayload } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,63}$/;
const TELEFONO_RE = /^[+]?[\d\s().-]{6,20}$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Validates the contact form body per contracts/api-contact.md. */
export function validateContact(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Solicitud no válida.' };
  }
  const raw = body as Record<string, unknown>;

  if (raw.consentimiento !== true) {
    return { ok: false, error: 'Debes aceptar la política de privacidad.' };
  }

  const nombre = text(raw.nombre);
  const apellido = text(raw.apellido);
  const email = text(raw.email);
  const telefono = text(raw.telefono);
  const mensaje = text(raw.mensaje);
  const origen = text(raw.origen);
  const turnstile_token = text(raw.turnstile_token);

  if (!nombre || nombre.length > LIMITES.nombre) {
    return {
      ok: false,
      error: 'El nombre es obligatorio (máx. 100 caracteres).',
    };
  }
  if (apellido.length > LIMITES.apellido) {
    return { ok: false, error: 'El apellido no puede superar 100 caracteres.' };
  }
  if (!email || email.length > LIMITES.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Introduce un email válido.' };
  }
  if (
    telefono &&
    (telefono.length > LIMITES.telefono || !TELEFONO_RE.test(telefono))
  ) {
    return { ok: false, error: 'Introduce un teléfono válido.' };
  }
  if (!mensaje || mensaje.length > LIMITES.mensaje) {
    return {
      ok: false,
      error: 'El mensaje es obligatorio (máx. 2000 caracteres).',
    };
  }
  if (!(ORIGENES as readonly string[]).includes(origen)) {
    return { ok: false, error: 'Origen no válido.' };
  }

  return {
    ok: true,
    data: {
      nombre,
      apellido: apellido || undefined,
      email,
      telefono: telefono || undefined,
      mensaje,
      origen: origen as Origen,
      consentimiento: true,
      turnstile_token,
    },
  };
}

/** Removes line breaks so user input can't alter email headers. */
export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function buildEmail(data: ContactPayload) {
  const nombreCompleto = [data.nombre, data.apellido].filter(Boolean).join(' ');
  return {
    subject: singleLine(
      `[Vitalitty] Nuevo mensaje desde ${data.origen} — ${nombreCompleto}`,
    ),
    text: [
      `Origen: ${data.origen}`,
      `Nombre: ${nombreCompleto}`,
      `Email: ${data.email}`,
      `Teléfono: ${data.telefono ?? '—'}`,
      `Consentimiento RGPD: sí`,
      '',
      'Mensaje:',
      data.mensaje,
    ].join('\n'),
  };
}
