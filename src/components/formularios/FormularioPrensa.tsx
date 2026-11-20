// Contacto de prensa (Prensa, #contacto-prensa): nombre, medio, correo, qué necesita, fecha de
// cierre, detalles y la casilla de autorización con el texto del prototipo.
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
} from './partes';

export interface TextosPrensa {
  nombre: string;
  medio: string;
  correo: string;
  necesidad: string;
  necesidades: { valor: string; texto: string }[];
  cierre: string;
  detalles: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  recibido: string;
  error: string;
}

interface Props {
  textos: TextosPrensa;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
}

export function FormularioPrensa({ textos, mensajes, idioma, pagina, politicaHref }: Props) {
  const clases = clasesControles('raised');
  return (
    <TarjetaFormulario
      formulario="prensa"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="raised"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        <Campo id="prensa-nombre" etiqueta={textos.nombre}>
          <Input
            id="prensa-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            className={clases.input}
          />
        </Campo>
        <Campo id="prensa-medio" etiqueta={textos.medio}>
          <Input
            id="prensa-medio"
            name="medio"
            type="text"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={160}
            className={clases.input}
          />
        </Campo>
      </div>
      <Campo id="prensa-correo" etiqueta={textos.correo}>
        <Input
          id="prensa-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={clases.input}
        />
      </Campo>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        <Campo id="prensa-necesidad" etiqueta={textos.necesidad}>
          <NativeSelect id="prensa-necesidad" name="necesidad" required className={clases.select}>
            {textos.necesidades.map((opcion) => (
              <NativeSelectOption key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Campo>
        <Campo id="prensa-cierre" etiqueta={textos.cierre}>
          <Input id="prensa-cierre" name="cierre" type="date" className={clases.input} />
        </Campo>
      </div>
      <Campo id="prensa-detalles" etiqueta={textos.detalles}>
        <Textarea
          id="prensa-detalles"
          name="mensaje"
          rows={4}
          maxLength={5000}
          className={clases.textarea}
        />
      </Campo>
      <Autorizacion id="prensa-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
