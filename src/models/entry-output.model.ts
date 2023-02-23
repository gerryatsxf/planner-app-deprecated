import {model, property} from '@loopback/repository';
import {EntryInput} from './entry-input.model';

@model()
export class EntryOutput extends EntryInput {

  constructor(data?: Partial<EntryOutput>) {
    super(data);
  }

  @property({
    type: 'boolean',
    required: true,
  })
  linked: boolean;

}

export interface EntryOutputRelations {
  // describe navigational properties here
}

export type EntryOutputWithRelations = EntryOutput & EntryOutputRelations;
