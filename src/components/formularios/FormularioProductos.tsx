// Inversionistas de Trama (Productos, #invertir): tipo de inversionista, nombre, correo,
// teléfono y la casilla de autorización. El aviso de que no es una oferta de valores va debajo
// del botón. Nombre y teléfono desde el 21 nov 2026, para validar a la persona (Luis). Desde el
// 27 nov 2026 el país es el del teléfono, con su indicativo.
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import {
  Autorizacion,
  BotonEnviar,
  Campo,
  clasesControles,
  TarjetaFormulario,
  CampoTelefono,
  type MensajesFormulario,
  type TextosContacto,
  type TextosAutorizacion,
} from './partes';

export interface TextosProductos {
  eyebrow: string;
  titulo: string;
  texto: string;
  tipo: string;
  tipos: { valor: string; texto: string }[];
  nombre: string;
  correo: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  aviso: string;
  recibido: string;
  error: string;
}

interface Props {
  /** Nombre y teléfono: los piden todos los formularios (27 nov 2026). */
  contacto: TextosContacto;
  textos: TextosProductos;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
  /** false: el título va en la tarjeta que abre el formulario (Productos, 27 nov 2026). */
  encabezado?: boolean;
}

export function FormularioProductos({
  textos,
  contacto,
  mensajes,
  idioma,
  pagina,
  politicaHref,
  encabezado = true,
}: Props) {
  const clases = clasesControles('base');
  return (
    <TarjetaFormulario
      formulario="productos"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="raised"
      className="border-accent p-8"
    >
      {encabezado && (
        <>
          <span className="text-[12px] font-bold tracking-[0.12em] text-link uppercase">
            {textos.eyebrow}
          </span>
          <h3 className="text-[26px] leading-[1.2] font-bold">{textos.titulo}</h3>
          <p className="text-text-secondary-on-dark">{textos.texto}</p>
        </>
      )}
      <Campo id="invertir-tipo" etiqueta={textos.tipo}>
        <NativeSelect id="invertir-tipo" name="inversionista" required className={clases.select}>
          {textos.tipos.map((t) => (
            <NativeSelectOption key={t.valor} value={t.valor}>
              {t.texto}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>
      <Campo id="invertir-nombre" etiqueta={textos.nombre}>
        <Input
          id="invertir-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={clases.input}
        />
      </Campo>
      <Campo id="invertir-correo" etiqueta={textos.correo}>
        <Input
          id="invertir-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={clases.input}
        />
      </Campo>
      <CampoTelefono prefijo="invertir" textos={contacto} idioma={idioma} variante="base" />
      <Autorizacion id="invertir-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
      <span className="text-[12px] text-text-tertiary-on-dark">{textos.aviso}</span>
    </TarjetaFormulario>
  );
}
