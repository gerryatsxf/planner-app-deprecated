import {Model, model, property} from '@loopback/repository';
import {defaultPourConfigEntry} from '../services/config';
@model()
export class PourConfigEntry extends Model {

  constructor(data?: Partial<PourConfigEntry>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true,
  })
  pourExcelFilePath: string = defaultPourConfigEntry.pourExcelFilePath;

  @property({
    type: 'number',
    required: true,
  })
  hourOffset: number = defaultPourConfigEntry.hourOffset;

  @property.array(String, {
    required: false,
  })
  includes?: string[] = defaultPourConfigEntry.includes;

}

export interface PourConfigEntryRelations {
  // describe navigational properties here
}

export type PourConfigEntryWithRelations = PourConfigEntry & PourConfigEntryRelations;
