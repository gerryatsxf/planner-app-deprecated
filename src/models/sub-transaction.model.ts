import {Model, model, property} from '@loopback/repository';

@model()
export class SubTransaction extends Model {

  constructor(data?: Partial<SubTransaction>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  transaction_id: string;

  @property({
    type: 'number',
    required: true
  })
  amount: number;

  @property({
    type: 'string',
    required: false
  })
  memo?: string;

  @property({
    type: 'string',
    required: false
  })
  payee_id?: string;

  @property({
    type: 'string',
    required: false
  })
  payee_name?: string;

  @property({
    type: 'string',
    required: false
  })
  category_id?: string;

  @property({
    type: 'string',
    required: false
  })
  category_name?: string;

  @property({
    type: 'string',
    required: false
  })
  transfer_account_id?: string;

  @property({
    type: 'string',
    required: false
  })
  transfer_transaction_id?: string;

  @property({
    type: 'boolean',
    required: true
  })
  deleted: boolean;
}

export interface SubTransactionRelations {
  // describe navigational properties here
}

export type SubTransactionWithRelations = SubTransaction & SubTransactionRelations;
