// Invitación a una charla (Charlas, #invitar): evento, fecha, ciudad, audiencia, presupuesto y
// correo, como el prototipo. La casilla de autorización se agrega como en los demás formularios.
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  Autorizacion,
  BotonEnviar,
  Campo,
  clasesControles,
  TarjetaFormulario,
  type MensajesFormulario,
  type TextosAutorizacion,
} from './partes';

export interface TextosSpeaker {
  evento: string;
  fecha: string;
  ciudad: string;
  audiencia: string;
  audienciaEjemplo: string;
  presupuesto: string;
  presupuestos: { valor: string; texto: string }[];
  correo: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  recibido: string;
  error: string;
}

interface Props {
  textos: TextosSpeaker;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
}

export function FormularioSpeaker({ textos, mensajes, idioma, pagina, politicaHref }: Props) {
  const clases = clasesControles('raised');
  return (
    <TarjetaFormulario
      formulario="speaker"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="raised"
    >
      <Campo id="speaker-evento" etiqueta={textos.evento}>
        <Input
          id="speaker-evento"
          name="evento"
          type="text"
          required
          minLength={2}
          maxLength={160}
          className={clases.input}
        />
      </Campo>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3.5">
        <Campo id="speaker-fecha" etiqueta={textos.fecha}>
          <Input id="speaker-fecha" name="fecha" type="date" required className={clases.input} />
        </Campo>
        <Campo id="speaker-ciudad" etiqueta={textos.ciudad}>
          <Input
            id="speaker-ciudad"
            name="ciudad"
            type="text"
            required
            minLength={2}
            maxLength={120}
            className={clases.input}
          />
        </Campo>
      </div>
      <Campo id="speaker-audiencia" etiqueta={textos.audiencia}>
        <Input
          id="speaker-audiencia"
          name="audiencia"
          type="text"
          placeholder={textos.audienciaEjemplo}
          maxLength={300}
          className={clases.input}
        />
      </Campo>
      <Campo id="speaker-presupuesto" etiqueta={textos.presupuesto}>
        <NativeSelect id="speaker-presupuesto" name="presupuesto" className={clases.select}>
          {textos.presupuestos.map((opcion) => (
            <NativeSelectOption key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>
      <Campo id="speaker-correo" etiqueta={textos.correo}>
        <Input
          id="speaker-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={clases.input}
        />
      </Campo>
      <Autorizacion id="speaker-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
