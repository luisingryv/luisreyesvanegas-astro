// Archivo .zip mínimo, sin dependencias: guarda las imágenes tal cual (ya vienen comprimidas) y
// comprime el texto. Formato PKZIP 2.0 con nombres en UTF-8.
import { crc32, deflateRawSync } from 'node:zlib';

export interface EntradaZip {
  nombre: string;
  datos: Uint8Array;
}

const YA_COMPRIMIDOS = /\.(jpe?g|png|webp|avif|zip|pdf)$/i;

/** Fecha y hora en el formato de MS-DOS que usa ZIP. */
function fechaDos(fecha: Date) {
  const hora = (fecha.getHours() << 11) | (fecha.getMinutes() << 5) | (fecha.getSeconds() >> 1);
  const dia =
    ((Math.max(fecha.getFullYear(), 1980) - 1980) << 9) |
    ((fecha.getMonth() + 1) << 5) |
    fecha.getDate();
  return { hora, dia };
}

export function crearZip(entradas: EntradaZip[], fecha = new Date()): Uint8Array {
  const { hora, dia } = fechaDos(fecha);
  const locales: Buffer[] = [];
  const centrales: Buffer[] = [];
  let desplazamiento = 0;

  for (const { nombre, datos } of entradas) {
    const nombreBytes = Buffer.from(nombre, 'utf8');
    const original = Buffer.from(datos);
    const guardar = YA_COMPRIMIDOS.test(nombre);
    const contenido = guardar ? original : deflateRawSync(original, { level: 9 });
    const metodo = guardar ? 0 : 8;
    const crc = crc32(original);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // versión necesaria
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(metodo, 8);
    local.writeUInt16LE(hora, 10);
    local.writeUInt16LE(dia, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(contenido.length, 18);
    local.writeUInt32LE(original.length, 22);
    local.writeUInt16LE(nombreBytes.length, 26);
    local.writeUInt16LE(0, 28);
    locales.push(local, nombreBytes, contenido);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4); // versión que lo creó
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(metodo, 10);
    central.writeUInt16LE(hora, 12);
    central.writeUInt16LE(dia, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(contenido.length, 20);
    central.writeUInt32LE(original.length, 24);
    central.writeUInt16LE(nombreBytes.length, 28);
    central.writeUInt32LE(desplazamiento, 42);
    centrales.push(central, nombreBytes);

    desplazamiento += local.length + nombreBytes.length + contenido.length;
  }

  const directorio = Buffer.concat(centrales);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(directorio.length, 12);
  fin.writeUInt32LE(desplazamiento, 16);
  return Buffer.concat([...locales, directorio, fin]);
}
