import { describe, expect, it, vi } from 'vitest';
import { crearAvisoResend } from '../../src/lib/servicios/resend';
import type { Solicitud } from '../../db/schema';

describe('crearAvisoResend', () => {
  const solicitudBase: Solicitud = {
    id: 1,
    creadoEn: new Date('2026-11-22T20:00:00Z'),
    formulario: 'general',
    puerta: null,
    idioma: 'es',
    nombre: 'Juan Perez',
    email: 'juan@ejemplo.com',
    whatsapp: '+573001234567',
    mensaje: 'Mensaje de prueba',
    datos: null,
    pagina: '/es/contacto',
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
    politicaVersion: '2026-11-13',
    autorizadoEn: new Date('2026-11-22T20:00:00Z'),
    crmPageId: null,
    crmSincronizadoEn: null,
    avisoEnviadoEn: null,
    intentos: 0,
    ultimoError: null,
  };

  it('envía correo a través de la API de Resend y devuelve true si la respuesta es exitosa', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'resend_123' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const servicio = crearAvisoResend('key_test', 'remitente@test.com', 'destino@test.com');
    const resultado = await servicio.avisar(solicitudBase);

    expect(resultado).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer key_test',
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('Juan Perez'),
    });

    vi.unstubAllGlobals();
  });

  it('devuelve false si la API de Resend responde con error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Invalid domain',
    });
    vi.stubGlobal('fetch', fetchMock);

    const servicio = crearAvisoResend('key_test', 'remitente@test.com', 'destino@test.com');
    const resultado = await servicio.avisar(solicitudBase);

    expect(resultado).toBe(false);

    vi.unstubAllGlobals();
  });
});
