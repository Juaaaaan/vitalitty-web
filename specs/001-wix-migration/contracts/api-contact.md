# API Contract: Contact Form Endpoint

**Endpoint**: `POST /api/contact`

**Type**: Vercel serverless function (Astro API route)

## Request

**Content-Type**: `application/json`

### Body

| Field           | Type    | Required | Notes                                                                             |
| --------------- | ------- | -------- | --------------------------------------------------------------------------------- |
| nombre          | string  | yes      | Nombre del remitente. Max 100 chars.                                              |
| apellido        | string  | no       | Primer apellido (campo del formulario Wix original). Max 100 chars.               |
| email           | string  | yes      | Email válido del remitente.                                                       |
| telefono        | string  | no       | Teléfono de contacto. Max 20 chars.                                               |
| mensaje         | string  | yes      | Cuerpo del mensaje. Max 2000 chars.                                               |
| origen          | string  | yes      | Página de origen: `contacto` \| `nutricion` \| `fisioterapia` \| `colaboraciones` |
| consentimiento  | boolean | yes      | Checkbox RGPD. MUST be `true`.                                                    |
| turnstile_token | string  | yes      | Token de Cloudflare Turnstile.                                                    |
| _honey          | string  | no       | Honeypot field. Must be empty.                                                    |

### Example

```json
{
  "nombre": "María",
  "apellido": "López",
  "email": "maria@example.com",
  "telefono": "612345678",
  "mensaje": "Me gustaría pedir cita para nutrición.",
  "origen": "nutricion",
  "consentimiento": true,
  "turnstile_token": "0.abc123...",
  "_honey": ""
}
```

## Response

### 200 OK

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente."
}
```

### 400 Bad Request

Missing/invalid fields or consent not given.

```json
{
  "success": false,
  "error": "Debes aceptar la política de privacidad."
}
```

### 403 Forbidden

Turnstile validation failed or honeypot triggered.

```json
{
  "success": false,
  "error": "Verificación anti-spam fallida."
}
```

### 500 Internal Server Error

Resend API failure.

```json
{
  "success": false,
  "error": "Error al enviar el mensaje. Inténtalo de nuevo."
}
```

## Server-side Logic

1. **Honeypot check**: If `_honey` is non-empty → 403 (silent reject, no error detail to bot)
2. **Turnstile verification**: POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret` + `response` token. If `success: false` → 403
3. **Input validation**: Check required fields, email format, max lengths, `consentimiento === true`. If invalid → 400
4. **Send email**: Via Resend API to `CONTACT_TO_EMAIL` env var. Subject includes `origen`. Reply-to set to submitter's email.
5. **Response**: 200 on success, 500 on Resend failure

## Environment Variables

| Variable             | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| RESEND_API_KEY       | API key for Resend email service                                                |
| TURNSTILE_SECRET_KEY | Cloudflare Turnstile server-side secret                                         |
| TURNSTILE_SITE_KEY   | Cloudflare Turnstile client-side site key (used in frontend)                    |
| CONTACT_TO_EMAIL     | Destination email address for form submissions                                  |
| CONTACT_FROM_EMAIL   | Optional. Sender on a Resend-verified domain. Defaults to Resend sandbox sender |

## Email Template

**To**: `CONTACT_TO_EMAIL`
**Reply-To**: submitter's `email`
**Subject**: `[Vitalitty] Nuevo mensaje desde {origen} — {nombre}`
**Body**: Plain text with all form fields formatted.
