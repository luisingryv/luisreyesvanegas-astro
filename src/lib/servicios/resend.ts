// Servicio de aviso por correo con Resend.
import type { Solicitud } from '../../../db/schema';
import type { Aviso } from './integraciones';

export function crearAvisoResend(apiKey: string, remitente: string, destinatario: string): Aviso {
  return {
    async avisar(solicitud: Solicitud): Promise<boolean> {
      const asunto = `Nueva solicitud [${solicitud.formulario.toUpperCase()}]: ${solicitud.nombre || solicitud.email}`;

      const lineas: string[] = [
        `Nueva solicitud recibida a través del sitio web luisreyesvanegas.com:`,
        ``,
        `• Formulario: ${solicitud.formulario}`,
        `• Nombre: ${solicitud.nombre || 'No proporcionado'}`,
        `• Correo electrónico: ${solicitud.email}`,
      ];

      if (solicitud.whatsapp) {
        lineas.push(`• Teléfono: ${solicitud.whatsapp}`);
      }
      if (solicitud.puerta) {
        lineas.push(`• Puerta / Servicio: ${solicitud.puerta}`);
      }
      if (solicitud.mensaje) {
        lineas.push(``, `Mensaje:`, `${solicitud.mensaje}`);
      }

      if (solicitud.datos && typeof solicitud.datos === 'object') {
        lineas.push(``, `Detalles adicionales:`);
        for (const [clave, valor] of Object.entries(solicitud.datos)) {
          if (valor !== undefined && valor !== null && valor !== '') {
            lineas.push(`  - ${clave}: ${String(valor)}`);
          }
        }
      }

      lineas.push(
        ``,
        `---`,
        `Idioma: ${solicitud.idioma}`,
        `Página: ${solicitud.pagina || 'Desconocida'}`,
      );

      if (solicitud.utmSource || solicitud.utmCampaign) {
        lineas.push(
          `Origen UTM: ${[solicitud.utmSource, solicitud.utmMedium, solicitud.utmCampaign]
            .filter(Boolean)
            .join(' / ')}`,
        );
      }

      const cuerpo = lineas.join('\n');

      try {
        // El aviso se envía dentro de la solicitud del formulario: si Resend tarda, no se queda
        // esperando. La solicitud ya está guardada y la tarea de sincronización lo reintenta.
        const respuesta = await fetch('https://api.resend.com/emails', {
          signal: AbortSignal.timeout(8_000),
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: remitente,
            to: [destinatario],
            subject: asunto,
            text: cuerpo,
          }),
        });

        if (!respuesta.ok) {
          const err = await respuesta.text().catch(() => '');
          console.error('[resend] error al enviar aviso:', respuesta.status, err);
          return false;
        }

        return true;
      } catch (error) {
        console.error('[resend] excepción al enviar aviso:', (error as Error).message);
        return false;
      }
    },
  };
}
