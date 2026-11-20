// Mejora progresiva de los formularios: sin JavaScript se envían con POST normal y la
// página vuelve con el resultado. Con JavaScript: validación antes de enviar, errores por
// campo sin recargar, envío con fetch, estado "Enviando…" y UTM de la visita.
import { guardarUtmDeLaUrl } from '../../lib/utm';
import type { MensajesFormulario } from './FormularioContacto';

type Codigo = 'requerido' | 'invalido' | 'muy-corto' | 'muy-largo' | 'debe-aceptar';
type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function mejorarFormulario(form: HTMLFormElement) {
  const mensajes = JSON.parse(form.dataset.mensajes ?? '{}') as MensajesFormulario;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const anuncio = form.querySelector<HTMLElement>('[data-anuncio]');
  const avisoEnviado = form.querySelector<HTMLElement>('#formulario-enviado');
  const avisoError = form.querySelector<HTMLElement>('[data-aviso-error]');
  if (!boton || !anuncio || !avisoEnviado || !avisoError) return;

  // Nosotros mostramos los errores, no las burbujas del navegador.
  form.noValidate = true;

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
      const datos = Object.fromEntries(new FormData(form));
      const respuesta = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...datos, acepta: datos.acepta === 'on' }),
      });
      const cuerpo = (await respuesta.json().catch(() => ({}))) as {
        ok?: boolean;
        motivo?: string;
        errores?: Record<string, Codigo>;
      };

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
      mostrarFalla(cuerpo.motivo === 'demasiadas' ? mensajes.demasiadas : undefined);
    } catch {
      mostrarFalla();
    } finally {
      boton.disabled = false;
      boton.textContent = textoBoton;
      form.removeAttribute('aria-busy');
    }
  });
}
