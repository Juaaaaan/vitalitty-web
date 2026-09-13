/**
 * Client behaviour for <contact-form>: lazy Turnstile, validation and
 * JSON submission to /api/contact (contracts/api-contact.md).
 */

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      language?: string;
    },
  ) => string;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileLoader: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  turnstileLoader ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error('turnstile'));
    script.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

export function initContactForm(root: HTMLElement) {
  const form = root.querySelector('form');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const widget = root.querySelector<HTMLElement>('[data-turnstile]');
  const button = form?.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (!form || !status || !widget || !button) return;

  const sitekey = root.dataset.sitekey ?? '';
  let token = '';
  let widgetId: string | undefined;

  const setStatus = (message: string, kind: 'ok' | 'error' | 'info') => {
    status.textContent = message;
    status.className = `min-h-6 text-sm ${
      kind === 'error'
        ? 'text-red-700'
        : kind === 'ok'
          ? 'text-primary-darker'
          : ''
    }`;
  };

  const renderWidget = async () => {
    if (!sitekey || widgetId !== undefined) return;
    try {
      const turnstile = await loadTurnstile();
      widgetId = turnstile.render(widget, {
        sitekey,
        language: 'es',
        callback: (t) => (token = t),
        'expired-callback': () => (token = ''),
        'error-callback': () => (token = ''),
      });
    } catch {
      setStatus(
        'No se pudo cargar la verificación anti-spam. Recarga la página.',
        'error',
      );
    }
  };

  // Only pull the third-party script when the form is about to be used.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        renderWidget();
      }
    },
    { rootMargin: '200px' },
  );
  observer.observe(form);
  form.addEventListener('focusin', renderWidget, { once: true });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLInputElement>(':invalid');
      setStatus(
        firstInvalid?.name === 'consentimiento'
          ? 'Debes aceptar la política de privacidad.'
          : 'Revisa los campos obligatorios marcados con *.',
        'error',
      );
      firstInvalid?.focus();
      return;
    }
    if (sitekey && !token) {
      setStatus('Completa la verificación anti-spam antes de enviar.', 'error');
      return;
    }

    const data = new FormData(form);
    const payload = {
      nombre: data.get('nombre'),
      apellido: data.get('apellido'),
      email: data.get('email'),
      telefono: data.get('telefono'),
      mensaje: data.get('mensaje'),
      origen: data.get('origen'),
      consentimiento: data.get('consentimiento') === 'on',
      turnstile_token: token,
      _honey: data.get('_honey'),
    };

    button.disabled = true;
    setStatus('Enviando…', 'info');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (res.ok && body.success) {
        form.reset();
        setStatus(root.dataset.success ?? '¡Gracias por tu mensaje!', 'ok');
      } else {
        setStatus(
          body.error ?? 'Error al enviar el mensaje. Inténtalo de nuevo.',
          'error',
        );
      }
    } catch {
      setStatus('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
      button.disabled = false;
      token = '';
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    }
  });
}
