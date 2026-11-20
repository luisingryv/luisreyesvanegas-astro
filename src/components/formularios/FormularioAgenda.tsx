// Agenda de Consultoría: preguntas previas (tema, nubes, gasto y correo) que se guardan antes
// de abrir la página de reservas de Google Calendar. Sin nombre, como el prototipo (Luis,
// 20 nov 2026). Sin URL de agenda, guarda y muestra el aviso "recibido".
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

export interface TextosAgenda {
  tema: string;
  temas: { valor: string; texto: string }[];
  nubes: string;
  nubesEjemplo: string;
  gasto: string;
  gastoEjemplo: string;
  correo: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  recibido: string;
  error: string;
}

interface Props {
  textos: TextosAgenda;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
}

export function FormularioAgenda({ textos, mensajes, idioma, pagina, politicaHref }: Props) {
  const clases = clasesControles('raised');
  return (
    <TarjetaFormulario
      formulario="consultoria"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="raised"
    >
      <Campo id="agenda-tema" etiqueta={textos.tema}>
        <NativeSelect id="agenda-tema" name="puerta" required className={clases.select}>
          {textos.temas.map((tema) => (
            <NativeSelectOption key={tema.valor} value={tema.valor}>
              {tema.texto}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>
      <Campo id="agenda-nubes" etiqueta={textos.nubes}>
        <Input
          id="agenda-nubes"
          name="nubes"
          type="text"
          placeholder={textos.nubesEjemplo}
          maxLength={200}
          className={clases.input}
        />
      </Campo>
      <Campo id="agenda-gasto" etiqueta={textos.gasto}>
        <Input
          id="agenda-gasto"
          name="gasto"
          type="text"
          inputMode="decimal"
          placeholder={textos.gastoEjemplo}
          maxLength={60}
          className={clases.input}
        />
      </Campo>
      <Campo id="agenda-correo" etiqueta={textos.correo}>
        <Input
          id="agenda-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={clases.input}
        />
      </Campo>
      <Autorizacion id="agenda-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
