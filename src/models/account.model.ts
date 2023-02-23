import {Model, model, property} from '@loopback/repository';
import {IAccountTypeEnum} from '../ynab-api';

@model()
export class Account extends Model {

  constructor(data?: Partial<Account>) {
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
  name: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(IAccountTypeEnum),
    }
  })
  type: IAccountTypeEnum;

  @property({
    type: 'string',
    required: true
  })
  on_budget: boolean;

  @property({
    type: 'string',
    required: true
  })
  closed: boolean;

  @property({
    type: 'string',
    required: false
  })
  note?: string;

  @property({
    type: 'string',
    required: true
  })
  balance: number;

  @property({
    type: 'string',
    required: true
  })
  cleared_balance: number;

  @property({
    type: 'string',
    required: true
  })
  uncleared_balance: number;

  @property({
    type: 'string',
    required: true
  })
  transfer_payee_id: string;

  @property({
    type: 'string',
    required: false
  })
  direct_import_linked?: boolean;

  @property({
    type: 'string',
    required: false
  })
  direct_import_in_error?: boolean;

  @property({
    type: 'string',
    required: true
  })
  deleted: boolean;
}


export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
