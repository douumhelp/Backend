import * as moment from 'moment-timezone';
import { ValueTransformer } from 'typeorm';

export class DateTransformer implements ValueTransformer {
  to(value: Date): Date {
    return value ? moment(value).tz('America/Sao_Paulo').toDate() : value;
  }

  from(value: Date): string {
    return value ? moment.utc(value).tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss') : '';
  }
}
