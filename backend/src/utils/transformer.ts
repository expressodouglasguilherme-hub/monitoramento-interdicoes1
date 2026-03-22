import { createHash } from 'crypto';
import { Event, RawEvent } from '../types';
import { logger } from './logger';

export class DataTransformer {
  private static readonly BRAZIL_LAT_MIN = -33.75;
  private static readonly BRAZIL_LAT_MAX = 5.27;
  private static readonly BRAZIL_LNG_MIN = -73.99;
  private static readonly BRAZIL_LNG_MAX = -34.79;

  static transform(rawEvents: RawEvent[]): Event[] {
    const validEvents: Event[] = [];

    for (const raw of rawEvents) {
      try {
        if (!this.validate(raw)) {
          continue;
        }

        const event: Event = {
          id: this.generateId(raw),
          cidade: raw.cidade!,
          uf: raw.uf!.toUpperCase(),
          local: raw.local!,
          observacao: raw.observacao!,
          latitude: this.parseCoordinate(raw.latitude!),
          longitude: this.parseCoordinate(raw.longitude!),
          dataAtualizacao: this.parseDate(raw.dataAtualizacao!),
        };

        validEvents.push(event);
      } catch (error) {
        logger.warn('Failed to transform event', { raw, error: (error as Error).message });
      }
    }

    logger.info(`Transformed ${validEvents.length} of ${rawEvents.length} events`);
    return validEvents;
  }

  static validate(raw: RawEvent): boolean {
    // Check required fields
    if (!raw.cidade || !raw.uf || !raw.local || !raw.observacao) {
      logger.debug('Event missing required fields', { raw });
      return false;
    }

    // Validate UF format (2 characters)
    if (typeof raw.uf !== 'string' || raw.uf.length !== 2) {
      logger.debug('Invalid UF format', { uf: raw.uf });
      return false;
    }

    // Validate coordinates
    if (raw.latitude === undefined || raw.longitude === undefined) {
      logger.debug('Missing coordinates', { raw });
      return false;
    }

    try {
      const lat = this.parseCoordinate(raw.latitude);
      const lng = this.parseCoordinate(raw.longitude);

      if (lat < this.BRAZIL_LAT_MIN || lat > this.BRAZIL_LAT_MAX) {
        logger.debug('Latitude out of Brazil bounds', { lat });
        return false;
      }

      if (lng < this.BRAZIL_LNG_MIN || lng > this.BRAZIL_LNG_MAX) {
        logger.debug('Longitude out of Brazil bounds', { lng });
        return false;
      }
    } catch {
      logger.debug('Invalid coordinate format', { raw });
      return false;
    }

    return true;
  }

  static generateId(raw: RawEvent): string {
    const key = `${raw.cidade}-${raw.uf}-${raw.latitude}-${raw.longitude}`;
    return createHash('md5').update(key).digest('hex');
  }

  static parseCoordinate(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error(`Invalid coordinate: ${value}`);
    }
    return parsed;
  }

  static parseDate(value: string | Date): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    // Try to parse as date
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      // If invalid, return current date
      return new Date().toISOString();
    }
    return date.toISOString();
  }
}
