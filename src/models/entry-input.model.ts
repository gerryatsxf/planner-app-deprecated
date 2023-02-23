import {Model, model, property} from '@loopback/repository';

@model()
export class EntryInput extends Model {

  constructor(data?: Partial<EntryInput>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true,
  })
  idEntry: string;

  @property({
    type: 'date',
    required: true,
  })
  datePlanned: Date;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  inflow: number;

  @property({
    type: 'number',
    required: true,
  })
  outflow: number;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
    required: true,
  })
  account: string;

  @property({
    type: 'boolean',
    required: true,
  })
  modify: boolean;

}

export interface EntryInputRelations {
  // describe navigational properties here
}

export type EntryInputWithRelations = EntryInput & EntryInputRelations;
