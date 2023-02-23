import {Model, model, property} from '@loopback/repository';
import {EntryInput} from './entry-input.model';

@model()
export class SelectEntriesInputResult extends Model {

  constructor(data?: Partial<SelectEntriesInputResult>) {
    super(data);
  }

  @property.array(EntryInput)
  toBeUpdated: EntryInput[]

  @property.array(EntryInput)
  toBeCreated: EntryInput[]
}

export interface SelectEntriesInputResultRelations {
  // describe navigational properties here
}

export type SelectEntriesInputResultWithRelations = SelectEntriesInputResult & SelectEntriesInputResultRelations;
