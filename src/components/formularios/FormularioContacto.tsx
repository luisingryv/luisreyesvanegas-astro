// Formulario general de contacto. Funciona sin JavaScript (POST a /api/solicitudes y vuelta
// a la página con el resultado); el paso de motion e interacción lo mejora con fetch.
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
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

interface Props {
  textos: TextosFormulario;
  idioma: string;
  /** Ruta de la página, para volver a ella después de enviar sin JavaScript. */
  pagina: string;
  politicaHref: string;
  className?: string;
}

const campo = 'h-12 rounded-[12px] border-gray-700 bg-surface px-3.5 text-body';

export function FormularioContacto({ textos, idioma, pagina, politicaHref, className }: Props) {
  return (
    <form
      method="post"
      action="/api/solicitudes"
      className={cn(
        'relative flex flex-col gap-3.5 rounded-lg border border-hairline bg-surface-raised p-7',
        className,
      )}
      data-formulario="general"
    >
      <p id="formulario-enviado" role="status" className="formulario-aviso text-link font-bold">
        {textos.enviado}
      </p>
      <p id="formulario-error" role="alert" className="formulario-aviso text-error font-bold">
        {textos.error}
      </p>

      <input type="hidden" name="formulario" value="general" />
      <input type="hidden" name="idioma" value={idioma} />
      <input type="hidden" name="pagina" value={pagina} />
      {/* Campo trampa: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          sitio web
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contacto-nombre" className="text-[13px] font-bold">
          {textos.nombre}
        </Label>
        <Input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={campo}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contacto-correo" className="text-[13px] font-bold">
          {textos.correo}
        </Label>
        <Input
          id="contacto-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={campo}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contacto-tema" className="text-[13px] font-bold">
          {textos.tema}
        </Label>
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
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contacto-mensaje" className="text-[13px] font-bold">
          {textos.mensaje}
        </Label>
        <Textarea
          id="contacto-mensaje"
          name="mensaje"
          rows={4}
          required
          minLength={10}
          maxLength={5000}
          className="min-h-28 resize-y rounded-[12px] border-gray-700 bg-surface px-3.5 py-3 text-body"
        />
      </div>
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
      <button
        type="submit"
        className="mt-1 rounded-pill bg-primary px-6 py-4 font-bold text-on-primary transition-colors hover:bg-primary-hover"
      >
        {textos.enviar}
      </button>
    </form>
  );
}
