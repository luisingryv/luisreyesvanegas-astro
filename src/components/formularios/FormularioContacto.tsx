// Formulario general de contacto. Funciona sin JavaScript (POST a /api/solicitudes y vuelta
// a la página con el resultado). Con JavaScript, formulario.ts lo mejora: valida antes de
// enviar, muestra el error de cada campo sin recargar y agrega las UTM de la visita.
import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { NOMBRES_UTM } from '@/lib/utm';
import { cn } from '@/lib/utils';

export interface TextosFormulario {
  nombre: string;
  correo: string;
  tema: string;
  mensaje: string;
  temas: { valor: string; texto: string }[];
  autorizacion: { antes: string; enlace: string; despues: string };
  enviar: string;
  enviado: string;
  error: string;
}

/** Textos que usa formulario.ts en el navegador (van en data-mensajes). */
export interface MensajesFormulario {
  enviando: string;
  revisa: string;
  demasiadas: string;
  errores: {
    requerido: string;
    invalido: string;
    emailInvalido: string;
    muyCorto: string;
    muyLargo: string;
    debeAceptar: string;
  };
}

interface Props {
  textos: TextosFormulario;
  mensajes: MensajesFormulario;
  idioma: string;
  /** Ruta de la página, para volver a ella después de enviar sin JavaScript. */
  pagina: string;
  politicaHref: string;
  className?: string;
}

const control =
  'h-12 rounded-[12px] border-gray-700 bg-surface px-3.5 text-body aria-invalid:border-error aria-invalid:ring-0';

// Etiqueta, control y su mensaje de error (vacío hasta que haga falta).
function Campo({ id, etiqueta, children }: { id: string; etiqueta: string; children: ReactNode }) {
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

export function FormularioContacto({
  textos,
  mensajes,
  idioma,
  pagina,
  politicaHref,
  className,
}: Props) {
  return (
    <form
      method="post"
      action="/api/solicitudes"
      className={cn(
        'relative flex flex-col gap-3.5 rounded-lg border border-hairline bg-surface-raised p-7',
        className,
      )}
      data-formulario="general"
      data-mensajes={JSON.stringify(mensajes)}
    >
      <p
        id="formulario-enviado"
        tabIndex={-1}
        className="formulario-aviso font-bold text-link outline-none"
      >
        {textos.enviado}
      </p>
      <p
        id="formulario-error"
        tabIndex={-1}
        className="formulario-aviso font-bold text-error outline-none"
        data-aviso-error
      >
        {textos.error}
      </p>
      {/* Lo que cambia sin recargar se anuncia aquí a los lectores de pantalla. */}
      <p className="sr-only" aria-live="polite" data-anuncio />

      <input type="hidden" name="formulario" value="general" />
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

      <Campo id="contacto-nombre" etiqueta={textos.nombre}>
        <Input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={control}
        />
      </Campo>
      <Campo id="contacto-correo" etiqueta={textos.correo}>
        <Input
          id="contacto-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={control}
        />
      </Campo>
      <Campo id="contacto-tema" etiqueta={textos.tema}>
        <NativeSelect
          id="contacto-tema"
          name="puerta"
          className="w-full [&_select]:h-12 [&_select]:rounded-[12px] [&_select]:border-gray-700 [&_select]:bg-surface [&_select]:pl-3.5 [&_select]:text-body"
        >
          {textos.temas.map((tema) => (
            <NativeSelectOption key={tema.valor} value={tema.valor}>
              {tema.texto}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>
      <Campo id="contacto-mensaje" etiqueta={textos.mensaje}>
        <Textarea
          id="contacto-mensaje"
          name="mensaje"
          rows={4}
          required
          minLength={10}
          maxLength={5000}
          className="min-h-28 resize-y rounded-[12px] border-gray-700 bg-surface px-3.5 py-3 text-body aria-invalid:border-error aria-invalid:ring-0"
        />
      </Campo>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3 text-small">
          <input
            id="contacto-acepta"
            name="acepta"
            type="checkbox"
            required
            className="mt-0.5 size-5 shrink-0 accent-primary"
          />
          <label htmlFor="contacto-acepta" className="text-text-secondary-on-dark">
            {textos.autorizacion.antes}{' '}
            <a href={politicaHref} className="font-bold text-link underline underline-offset-2">
              {textos.autorizacion.enlace}
            </a>{' '}
            {textos.autorizacion.despues}
          </label>
        </div>
        <p
          id="contacto-acepta-error"
          className="text-small font-bold text-error"
          data-error-de="contacto-acepta"
          hidden
        />
      </div>
      <button
        type="submit"
        className="mt-1 rounded-pill bg-primary px-6 py-4 font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-80"
      >
        {textos.enviar}
      </button>
    </form>
  );
}
