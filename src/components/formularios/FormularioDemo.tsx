// Demo de un producto (Productos, #usar), pedido de Luis el 21 nov 2026: la persona elige si
// quiere conocer Trama, Ofilix u otro producto y deja sus datos. Se guarda como "demo".
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

export interface TextosDemo {
  eyebrow: string;
  titulo: string;
  texto: string;
  producto: string;
  productos: { valor: string; texto: string }[];
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  mensaje: string;
  autorizacion: TextosAutorizacion;
  enviar: string;
  recibido: string;
  error: string;
}

interface Props {
  textos: TextosDemo;
  mensajes: MensajesFormulario;
  idioma: string;
  pagina: string;
  politicaHref: string;
}

export function FormularioDemo({ textos, mensajes, idioma, pagina, politicaHref }: Props) {
  const clases = clasesControles('base');
  return (
    <TarjetaFormulario
      formulario="demo"
      idioma={idioma}
      pagina={pagina}
      mensajes={mensajes}
      enviado={textos.recibido}
      error={textos.error}
      variante="raised"
      className="p-8"
    >
      <span className="text-[12px] font-bold tracking-[0.12em] text-link uppercase">
        {textos.eyebrow}
      </span>
      <h3 className="text-[26px] leading-[1.2] font-bold">{textos.titulo}</h3>
      <p className="text-text-secondary-on-dark">{textos.texto}</p>
      <Campo id="demo-producto" etiqueta={textos.producto}>
        <NativeSelect id="demo-producto" name="producto" required className={clases.select}>
          {textos.productos.map((p) => (
            <NativeSelectOption key={p.valor} value={p.valor}>
              {p.texto}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Campo>
      <Campo id="demo-nombre" etiqueta={textos.nombre}>
        <Input
          id="demo-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          className={clases.input}
        />
      </Campo>
      <Campo id="demo-empresa" etiqueta={textos.empresa}>
        <Input
          id="demo-empresa"
          name="empresa"
          type="text"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={160}
          className={clases.input}
        />
      </Campo>
      <Campo id="demo-correo" etiqueta={textos.correo}>
        <Input
          id="demo-correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={clases.input}
        />
      </Campo>
      <Campo id="demo-telefono" etiqueta={textos.telefono}>
        <Input
          id="demo-telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          pattern="\+?[0-9][0-9 ()\-]{6,19}"
          maxLength={20}
          className={clases.input}
        />
      </Campo>
      <Campo id="demo-mensaje" etiqueta={textos.mensaje}>
        <Textarea id="demo-mensaje" name="mensaje" maxLength={3000} className={clases.textarea} />
      </Campo>
      <Autorizacion id="demo-acepta" textos={textos.autorizacion} politicaHref={politicaHref} />
      <BotonEnviar texto={textos.enviar} />
    </TarjetaFormulario>
  );
}
