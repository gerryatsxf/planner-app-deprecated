import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class SetupPayeeTransactionsResult extends Model {

  constructor(data?: Partial<SetupPayeeTransactionsResult>) {
    super(data);
  }
  @property.array(TransactionDetail)
  updated: TransactionDetail[]
}

export interface SetupPayeeTransactionsResultRelations {
  // describe navigational properties here
}

export type SetupPayeeTransactionsResultWithRelations = SetupPayeeTransactionsResult & SetupPayeeTransactionsResultRelations;
