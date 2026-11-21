// Mejora progresiva de los formularios: sin JavaScript se envían con POST normal y la
// página vuelve con el resultado. Con JavaScript: validación antes de enviar, errores por
// campo sin recargar, envío con fetch, estado "Enviando…" y UTM de la visita.
// Antispam (21 nov 2026): con TURNSTILE_SITE_KEY, el script de Cloudflare Turnstile se descarga
// solo cuando la persona entra al formulario, para no pesar en la carga de la página.
import { TURNSTILE_SITE_KEY } from 'astro:env/client';
import { guardarUtmDeLaUrl } from '../../lib/utm';
import type { MensajesFormulario } from './partes';

type Codigo = 'requerido' | 'invalido' | 'muy-corto' | 'muy-largo' | 'debe-aceptar';
type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface Turnstile {
  render: (contenedor: HTMLElement, opciones: Record<string, unknown>) => string;
  reset: (widget?: string) => void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let cargaTurnstile: Promise<Turnstile> | undefined;
function cargarTurnstile(): Promise<Turnstile> {
  cargaTurnstile ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile'));
    script.onerror = () => reject(new Error('turnstile'));
    document.head.append(script);
  });
  return cargaTurnstile;
}

export function mejorarFormulario(form: HTMLFormElement) {
  const mensajes = JSON.parse(form.dataset.mensajes ?? '{}') as MensajesFormulario;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const anuncio = form.querySelector<HTMLElement>('[data-anuncio]');
  const avisoEnviado = form.querySelector<HTMLElement>('#formulario-enviado');
  const avisoError = form.querySelector<HTMLElement>('[data-aviso-error]');
  if (!boton || !anuncio || !avisoEnviado || !avisoError) return;

  // Nosotros mostramos los errores, no las burbujas del navegador.
  form.noValidate = true;

  // Turnstile: se prepara al entrar al formulario; el token llega por callback.
  const contenedor = form.querySelector<HTMLElement>('[data-turnstile]');
  const conTurnstile = Boolean(TURNSTILE_SITE_KEY && contenedor);
  let widget: string | undefined;
  let token = '';
  let alLlegarToken: ((valor: string) => void) | undefined;
  const prepararTurnstile = async () => {
    if (!conTurnstile || widget !== undefined) return;
    try {
      const turnstile = await cargarTurnstile();
      widget ??= turnstile.render(contenedor!, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: form.closest('[data-theme="dark"]') ? 'dark' : 'light',
        size: 'flexible',
        appearance: 'interaction-only',
        language: 'auto',
        callback: (valor: string) => {
          token = valor;
          alLlegarToken?.(valor);
        },
        'expired-callback': () => (token = ''),
        'error-callback': () => (token = ''),
      });
    } catch {
      // Sin Turnstile (bloqueado o caído): el servidor decide.
    }
  };
  const reiniciarTurnstile = () => {
    token = '';
    if (widget !== undefined) window.turnstile?.reset(widget);
  };
  const esperarToken = () =>
    token || widget === undefined
      ? Promise.resolve(token)
      : new Promise<string>((resolve) => {
          alLlegarToken = resolve;
          setTimeout(() => resolve(token), 10_000);
        });
  if (conTurnstile)
    form.addEventListener('focusin', () => void prepararTurnstile(), { once: true });

  const utm = guardarUtmDeLaUrl();
  for (const [nombre, valor] of Object.entries(utm)) {
    const campo = form.elements.namedItem(nombre);
    if (campo instanceof HTMLInputElement) campo.value = valor;
  }

  const controles = () =>
    [...form.elements].filter(
      (el): el is Control =>
        (el instanceof HTMLInputElement && el.type !== 'hidden' && el.name !== 'sitio_web') ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement,
    );

  const texto = (control: Control, codigo: Codigo) => {
    const e = mensajes.errores;
    switch (codigo) {
      case 'requerido':
        return control.type === 'checkbox' ? e.debeAceptar : e.requerido;
      case 'invalido':
        return control.type === 'email' ? e.emailInvalido : e.invalido;
      case 'muy-corto':
        return e.muyCorto.replace('{min}', String((control as HTMLInputElement).minLength));
      case 'muy-largo':
        return e.muyLargo;
      case 'debe-aceptar':
        return e.debeAceptar;
    }
  };

  const mostrarError = (control: Control, codigo: Codigo | null) => {
    const salida = form.querySelector<HTMLElement>(`[data-error-de="${control.id}"]`);
    if (!salida) return;
    if (!codigo) {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
      salida.hidden = true;
      salida.textContent = '';
      return;
    }
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', salida.id);
    salida.textContent = texto(control, codigo);
    salida.hidden = false;
  };

  // Las mismas reglas del servidor, leídas de los atributos del HTML.
  const validar = (control: Control): Codigo | null => {
    const v = control.validity;
    if (v.valueMissing) return control.type === 'checkbox' ? 'debe-aceptar' : 'requerido';
    if (v.typeMismatch) return 'invalido';
    const largo = control.value.trim().length;
    if ('minLength' in control && control.minLength > 0 && largo > 0 && largo < control.minLength)
      return 'muy-corto';
    if (v.tooLong) return 'muy-largo';
    if (v.valid) return null;
    return 'invalido';
  };

  const mostrarAviso = (aviso: HTMLElement | null) => {
    avisoEnviado.toggleAttribute('data-visible', aviso === avisoEnviado);
    avisoError.toggleAttribute('data-visible', aviso === avisoError);
  };

  // Aviso de error: el general, o uno propio (p. ej. demasiados envíos).
  const textoError = avisoError.textContent ?? '';
  const mostrarFalla = (texto = textoError) => {
    avisoError.textContent = texto;
    mostrarAviso(avisoError);
    avisoError.focus();
    anunciar(texto);
  };

  const anunciar = (texto: string) => {
    anuncio.textContent = '';
    // Un instante después, para que el lector de pantalla note el cambio.
    requestAnimationFrame(() => (anuncio.textContent = texto));
  };

  // El error de un campo se borra en cuanto se corrige.
  form.addEventListener('input', (e) => {
    const control = e.target as Control;
    if (control.getAttribute('aria-invalid') === 'true' && !validar(control)) {
      mostrarError(control, null);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mostrarAviso(null);

    const invalidos = controles().flatMap((control) => {
      const codigo = validar(control);
      mostrarError(control, codigo);
      return codigo ? [control] : [];
    });
    if (invalidos.length > 0) {
      invalidos[0]!.focus();
      anunciar(mensajes.revisa);
      return;
    }

    const textoBoton = boton.textContent;
    boton.disabled = true;
    boton.textContent = mensajes.enviando;
    form.setAttribute('aria-busy', 'true');
    try {
      if (conTurnstile) {
        await prepararTurnstile();
        await esperarToken();
        alLlegarToken = undefined;
      }
      const datos = Object.fromEntries(new FormData(form));
      if (conTurnstile && token) datos['cf-turnstile-response'] = token;
      const respuesta = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...datos, acepta: datos.acepta === 'on' }),
      });
      const cuerpo = (await respuesta.json().catch(() => ({}))) as {
        ok?: boolean;
        motivo?: string;
        errores?: Record<string, Codigo>;
        /** Agenda de Consultoría: página de reservas que se abre después de guardar. */
        agenda?: string;
      };

      // El token de Turnstile sirve una sola vez: el próximo envío pide uno nuevo.
      if (conTurnstile) reiniciarTurnstile();
      if (respuesta.ok && cuerpo.ok && cuerpo.agenda) {
        window.location.assign(cuerpo.agenda);
        return;
      }
      if (respuesta.ok && cuerpo.ok) {
        form.reset();
        controles().forEach((c) => mostrarError(c, null));
        mostrarAviso(avisoEnviado);
        avisoEnviado.focus();
        anunciar(avisoEnviado.textContent ?? '');
        return;
      }
      if (cuerpo.motivo === 'validacion' && cuerpo.errores) {
        const conError = controles().filter((c) => cuerpo.errores![c.name]);
        conError.forEach((c) => mostrarError(c, cuerpo.errores![c.name]!));
        if (conError.length > 0) {
          conError[0]!.focus();
          anunciar(mensajes.revisa);
          return;
        }
      }
      mostrarFalla(
        cuerpo.motivo === 'demasiadas'
          ? mensajes.demasiadas
          : cuerpo.motivo === 'verificacion'
            ? mensajes.verificacion
            : undefined,
      );
    } catch {
      mostrarFalla();
    } finally {
      boton.disabled = false;
      boton.textContent = textoBoton;
      form.removeAttribute('aria-busy');
    }
  });
}
