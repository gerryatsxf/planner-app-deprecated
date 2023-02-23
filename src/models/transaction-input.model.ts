import {Model, model, property} from '@loopback/repository';

@model()
export class TransactionInput extends Model {

  constructor(data?: Partial<TransactionInput>) {
    super(data);
  }

  @property({
    type: 'string',
    required: false,
  })
  serial: string;

  @property({
    type: 'string',
    required: false,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  memo: string;

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

}

export interface TransactionInputRelations {
  // describe navigational properties here
}

export type TransactionInputWithRelations = TransactionInput & TransactionInputRelations;
