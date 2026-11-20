import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  formatMonthYear,
  localize,
  summarizeYears,
} from '../../src/lib/content-format';

describe('formato del contenido', () => {
  it('escribe mes y año como en la referencia', () => {
    expect(formatMonthYear(new Date('2025-11-28'), 'es')).toBe('nov 2025');
    expect(formatMonthYear({ anio: 2025, mes: 7 }, 'es')).toBe('jul 2025');
    expect(formatMonthYear({ anio: 2026 }, 'es')).toBe('2026');
  });

  it('escribe la fecha de un evento de uno o varios días', () => {
    const d = (iso: string) => new Date(iso);
    expect(formatEventDate(d('2025-11-29'), undefined, 'es')).toBe('29 nov 2025');
    expect(formatEventDate(d('2025-11-11'), d('2025-11-12'), 'es')).toBe('11 y 12 nov 2025');
    expect(formatEventDate(d('2025-12-03'), d('2025-12-05'), 'es')).toBe('3 al 5 dic 2025');
  });

  it('falla si falta el texto del idioma publicado', () => {
    expect(localize({ es: 'Hola' }, 'es', 'x')).toBe('Hola');
    expect(() => localize({ es: 'Hola' }, 'en', 'hitos/x')).toThrow('hitos/x');
  });

  it('resume los años de los hitos', () => {
    expect(summarizeYears([2016, 2013, 2026])).toEqual({
      hitos: 3,
      desde: 2013,
      hasta: 2026,
      anios: 13,
    });
    expect(() => summarizeYears([])).toThrow();
  });
});
