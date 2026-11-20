// Formulario general de contacto (Home y Contacto). Funciona sin JavaScript (POST a
// /api/solicitudes y vuelta a la página con el resultado). Con JavaScript, formulario.ts lo
// mejora: valida antes de enviar, muestra el error de cada campo y agrega las UTM de la visita.
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import {
  Autorizacion,
  BotonEnviar,
  Campo,
  clasesControles,
  TarjetaFormulario,
  type MensajesFormulario,
  type TextosAutorizacion,
  type VarianteFormulario,
} from './partes';

export type { MensajesFormulario } from './partes';

export interface TextosFormulario {
  nombre: string;
  correo: string;
  tema: string;
  mensaje: string;
  temas: { valor: string; texto: string }[];
  autorizacion: TextosAutorizacion;
  enviar: string;
  enviado: string;
  error: string;
}

interface Props {
  textos: TextosFormulario;
  mensajes: MensajesFormulario;
  idioma: string;
  /** Ruta de la página, para volver a ella después de enviar sin JavaScript. */
  pagina: string;
  politicaHref: string;
  variante?: VarianteFormulario;
  filasMensaje?: number;
  className?: string;
}

export function FormularioContacto({
  textos,
  mensajes,
  idioma,
  pagina,
  politicaHref,
  variante = 'raised',
  filasMensaje = 4,
  className,
}: Props) {
  const clases = clasesControles(variante);
  return (
    <TarjetaFormulario
      formulario="general"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.enviado}
      error={textos.error}
      variante={variante}
      className={className}
    >
      <Campo id="contacto-nombre" etiqueta={textos.nombre}>
        <Input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={clases.input}
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
          className={clases.input}
        />
      </Campo>
      <Campo id="contacto-tema" etiqueta={textos.tema}>
        <NativeSelect id="contacto-tema" name="puerta" className={clases.select}>
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
          rows={filasMensaje}
          required
          minLength={10}
          maxLength={5000}
          className={clases.textarea}
        />
      </Campo>
      <Autorizacion id="contacto-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
