import {Model, model, property} from '@loopback/repository';
import {Entry} from '.';

@model()
export class EntriesInputFileResult extends Model {

  constructor(data?: Partial<EntriesInputFileResult>) {
    super(data);
  }

  @property.array(Entry)
  updated: Entry[]

  @property.array(Entry)
  created: Entry[]
}

export interface EntriesInputFileResultRelations {
  // describe navigational properties here
}

export type EntriesInputFileResultWithRelations = EntriesInputFileResult & EntriesInputFileResultRelations;
