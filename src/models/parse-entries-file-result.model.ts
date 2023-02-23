import {Model, model, property} from '@loopback/repository';
import {EntryInput} from './entry-input.model';

@model()
export class ParseEntriesFileResult extends Model {

  constructor(data?: Partial<ParseEntriesFileResult>) {
    super(data);
  }

  @property.array(EntryInput)
  entries: EntryInput[]
}

export interface ParseEntriesFileResultRelations {
  // describe navigational properties here
}

export type ParseEntriesFileResultWithRelations = ParseEntriesFileResult & ParseEntriesFileResultRelations;
