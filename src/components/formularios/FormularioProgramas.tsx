// Evaluación para el programa MAP (Programas AWS, #evaluar), como el prototipo: tipo de empresa,
// infraestructura, consumo mensual (con el anual calculado al lado), qué migrar, quién decide,
// plazo, empresa y país, correo y la casilla de autorización.
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

type Opcion = { valor: string; texto: string };

export interface TextosProgramas {
  tipoEmpresa: string;
  tiposEmpresa: Opcion[];
  infraestructura: string;
  infraestructuras: Opcion[];
  consumo: string;
  consumos: Opcion[];
  consumoInicial: string;
  anual: string;
  anualInicial: string;
  anualAyuda: string;
  migrar: string;
  decide: string;
  decideEjemplo: string;
  plazo: string;
  plazos: Opcion[];
  empresa: string;
  correo: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  recibido: string;
  error: string;
}

interface Props {
  textos: TextosProgramas;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
}

const Opciones = ({ opciones }: { opciones: Opcion[] }) =>
  opciones.map((o) => (
    <NativeSelectOption key={o.valor} value={o.valor}>
      {o.texto}
    </NativeSelectOption>
  ));

export function FormularioProgramas({ textos, mensajes, idioma, pagina, politicaHref }: Props) {
  const clases = clasesControles('base');
  return (
    <TarjetaFormulario
      formulario="programas-aws"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="base"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] [&>*]:col-span-full [&>.campo-medio]:col-span-1"
    >
      <div className="campo-medio">
        <Campo id="programas-tipo" etiqueta={textos.tipoEmpresa}>
          <NativeSelect id="programas-tipo" name="tipoEmpresa" required className={clases.select}>
            <Opciones opciones={textos.tiposEmpresa} />
          </NativeSelect>
        </Campo>
      </div>
      <div className="campo-medio">
        <Campo id="programas-infra" etiqueta={textos.infraestructura}>
          <NativeSelect
            id="programas-infra"
            name="infraestructura"
            required
            className={clases.select}
          >
            <Opciones opciones={textos.infraestructuras} />
          </NativeSelect>
        </Campo>
      </div>
      <div className="campo-medio">
        <Campo id="programas-consumo" etiqueta={textos.consumo}>
          <NativeSelect
            id="programas-consumo"
            name="consumo"
            required
            defaultValue={textos.consumoInicial}
            className={clases.select}
            data-consumo
          >
            <Opciones opciones={textos.consumos} />
          </NativeSelect>
        </Campo>
      </div>
      <div className="campo-medio flex flex-col gap-1.5">
        <span className="text-[13px] font-bold" id="programas-anual-etiqueta">
          {textos.anual}
        </span>
        <output
          htmlFor="programas-consumo"
          aria-labelledby="programas-anual-etiqueta"
          className="rounded-[12px] border border-dashed border-accent bg-surface-raised px-3.5 py-3 text-[18px] font-bold text-link tabular-nums"
          data-anual
        >
          {textos.anualInicial}
        </output>
        <span className="text-[12px] text-text-tertiary-on-dark">{textos.anualAyuda}</span>
      </div>
      <Campo id="programas-migrar" etiqueta={textos.migrar}>
        <Textarea
          id="programas-migrar"
          name="mensaje"
          rows={3}
          maxLength={3000}
          className={clases.textarea}
        />
      </Campo>
      <div className="campo-medio">
        <Campo id="programas-decide" etiqueta={textos.decide}>
          <Input
            id="programas-decide"
            name="decide"
            type="text"
            placeholder={textos.decideEjemplo}
            maxLength={120}
            className={clases.input}
          />
        </Campo>
      </div>
      <div className="campo-medio">
        <Campo id="programas-plazo" etiqueta={textos.plazo}>
          <NativeSelect id="programas-plazo" name="plazo" required className={clases.select}>
            <Opciones opciones={textos.plazos} />
          </NativeSelect>
        </Campo>
      </div>
      <div className="campo-medio">
        <Campo id="programas-empresa" etiqueta={textos.empresa}>
          <Input
            id="programas-empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={160}
            className={clases.input}
          />
        </Campo>
      </div>
      <div className="campo-medio">
        <Campo id="programas-correo" etiqueta={textos.correo}>
          <Input
            id="programas-correo"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={clases.input}
          />
        </Campo>
      </div>
      <Autorizacion
        id="programas-acepta"
        textos={textos.autorizacion}
        politicaHref={politicaHref}
      />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
