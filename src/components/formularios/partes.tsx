// Partes comunes de los formularios: tarjeta, avisos, campos ocultos (formulario, idioma,
// página, UTM y campo trampa), campo con su error, casilla de autorización y botón.
// Todo funciona sin JavaScript; formulario.ts lo mejora.
import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { NOMBRES_UTM } from '@/lib/utm';
import { cn } from '@/lib/utils';

/** Textos que usa formulario.ts en el navegador (van en data-mensajes). */
export interface MensajesFormulario {
  enviando: string;
  revisa: string;
  demasiadas: string;
  /** Turnstile no validó el envío (21 nov 2026). */
  verificacion: string;
  errores: {
    requerido: string;
    invalido: string;
    emailInvalido: string;
    muyCorto: string;
    muyLargo: string;
    debeAceptar: string;
  };
}

export interface TextosAutorizacion {
  antes: string;
  enlace: string;
  despues: string;
}

/** raised: tarjeta blue-800 sobre night (Home, Consultoría); base: night sobre blue-800 (Contacto). */
export type VarianteFormulario = 'raised' | 'base';

const base =
  'rounded-[12px] border-gray-700 text-body aria-invalid:border-error aria-invalid:ring-0';

/** Clases de los controles: van en el tono contrario a la tarjeta. */
export function clasesControles(variante: VarianteFormulario) {
  const fondo = variante === 'raised' ? 'bg-surface' : 'bg-surface-raised';
  return {
    input: cn('h-12 px-3.5', base, fondo),
    textarea: cn('min-h-28 resize-y px-3.5 py-3', base, fondo),
    select: cn(
      'w-full [&_select]:h-12 [&_select]:rounded-[12px] [&_select]:border-gray-700 [&_select]:pl-3.5 [&_select]:text-body',
      variante === 'raised' ? '[&_select]:bg-surface' : '[&_select]:bg-surface-raised',
    ),
  };
}

interface PropsTarjeta {
  formulario: string;
  idioma: string;
  pagina: string;
  mensajes: MensajesFormulario;
  enviado: string;
  error: string;
  variante: VarianteFormulario;
  className?: string;
  /** Prefijo de los ids de los avisos; cambia solo si hay dos formularios en la página. */
  avisos?: string;
  children: ReactNode;
}

/** El <form> con sus avisos, la región que anuncia cambios y los campos ocultos. */
export function TarjetaFormulario({
  formulario,
  idioma,
  pagina,
  mensajes,
  enviado,
  error,
  variante,
  className,
  avisos = 'formulario',
  children,
}: PropsTarjeta) {
  return (
    <form
      method="post"
      action="/api/solicitudes"
      className={cn(
        'relative flex flex-col gap-3.5 rounded-lg border border-hairline p-7',
        variante === 'raised' ? 'bg-surface-raised' : 'bg-surface',
        className,
      )}
      data-formulario={formulario}
      data-mensajes={JSON.stringify(mensajes)}
    >
      {/* El endpoint vuelve a #formulario-enviado o #formulario-error (se ven con :target).
          Con dos formularios en la página, el segundo usa otro prefijo (`avisos`). */}
      <p
        id={`${avisos}-enviado`}
        tabIndex={-1}
        className="formulario-aviso font-bold text-link outline-none"
        data-aviso-enviado
      >
        {enviado}
      </p>
      <p
        id={`${avisos}-error`}
        tabIndex={-1}
        className="formulario-aviso font-bold text-error outline-none"
        data-aviso-error
      >
        {error}
      </p>
      {avisos !== 'formulario' && <input type="hidden" name="avisos" value={avisos} />}
      {/* Lo que cambia sin recargar se anuncia aquí a los lectores de pantalla. */}
      <p className="sr-only" aria-live="polite" data-anuncio />

      <input type="hidden" name="formulario" value={formulario} />
      <input type="hidden" name="idioma" value={idioma} />
      <input type="hidden" name="pagina" value={pagina} />
      {NOMBRES_UTM.map((utm) => (
        <input key={utm} type="hidden" name={utm} value="" />
      ))}
      {/* Campo trampa: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          sitio web
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {children}
    </form>
  );
}

/** Etiqueta, control y su mensaje de error (vacío hasta que haga falta). */
export function Campo({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] font-bold">
        {etiqueta}
      </Label>
      {children}
      <p id={`${id}-error`} className="text-small font-bold text-error" data-error-de={id} hidden />
    </div>
  );
}

/** Casilla de autorización de datos (obligatoria en todos los formularios). */
export function Autorizacion({
  id,
  textos,
  politicaHref,
}: {
  id: string;
  textos: TextosAutorizacion;
  politicaHref: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3 text-small">
        <input
          id={id}
          name="acepta"
          type="checkbox"
          required
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <label htmlFor={id} className="text-text-secondary-on-dark">
          {textos.antes}{' '}
          <a href={politicaHref} className="font-bold text-link underline underline-offset-2">
            {textos.enlace}
          </a>
          {/* Sin espacio antes de un signo ("…de datos."). */}
          {/^[.,;:]/.test(textos.despues) ? textos.despues : ` ${textos.despues}`}
        </label>
      </div>
      <p id={`${id}-error`} className="text-small font-bold text-error" data-error-de={id} hidden />
    </div>
  );
}

export function BotonEnviar({ texto }: { texto: string }) {
  return (
    <>
      {/* Cloudflare Turnstile se dibuja aquí solo si está configurado y hace falta. */}
      <div data-turnstile className="empty:hidden" />
      <button
        type="submit"
        className="mt-1 rounded-pill bg-primary px-6 py-4 font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-80"
      >
        {texto}
      </button>
    </>
  );
}
