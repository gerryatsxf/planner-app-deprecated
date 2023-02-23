import {Model, model, property} from '@loopback/repository';
import {ITransactionDetailClearedEnum, ITransactionDetailFlagColorEnum} from '../ynab-api';
import {SubTransaction} from './sub-transaction.model';

@model()
export class TransactionDetail extends Model {

  constructor(data?: Partial<TransactionDetail>) {
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
  date: string;

  @property({
    type: 'number',
    required: true
  })
  amount: number;

  @property({
    type: 'string',
    required: true
  })
  memo: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(ITransactionDetailClearedEnum),
    }
  })
  cleared: ITransactionDetailClearedEnum;

  @property({
    type: 'boolean',
    required: true
  })
  approved: boolean;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      enum: Object.values(ITransactionDetailFlagColorEnum),
    }
  })
  flag_color?: ITransactionDetailFlagColorEnum;

  @property({
    type: 'string',
    required: true
  })
  account_id: string;

  @property({
    type: 'string',
    required: true
  })
  payee_id?: string;

  @property({
    type: 'string',
    required: false
  })
  category_id?: string;

  @property({
    type: 'string',
    required: true
  })
  transfer_account_id?: string;

  @property({
    type: 'string',
    required: false
  })
  transfer_transaction_id?: string;

  @property({
    type: 'string',
    required: false
  })
  matched_transaction_id?: string;

  @property({
    type: 'string',
    required: false
  })
  import_id?: string;

  @property({
    type: 'boolean',
    required: true
  })
  deleted: boolean;

  @property({
    type: 'string',
    required: true
  })
  account_name: string;

  @property({
    type: 'string',
    required: false
  })
  payee_name?: string;

  @property({
    type: 'string',
    required: false
  })
  category_name?: string;

  @property.array(SubTransaction)
  subtransactions: SubTransaction[];
}

export interface TransactionDetailRelations {
  // describe navigational properties here
}

export type TransactionDetailWithRelations = TransactionDetail & TransactionDetailRelations;
