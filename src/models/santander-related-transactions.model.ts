import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from '.';

@model()
export class SantanderRelatedTransactions extends Model {

  constructor(data?: Partial<SantanderRelatedTransactions>) {
    super(data);
  }
  @property.array(TransactionDetail)
  credit: TransactionDetail[]

  @property.array(TransactionDetail)
  debit: TransactionDetail[]

  @property.array(TransactionDetail)
  cash: TransactionDetail[]
}

export interface SantanderRelatedTransactionsRelations {
  // describe navigational properties here
}

export type SantanderRelatedTransactionsWithRelations = SantanderRelatedTransactions & SantanderRelatedTransactionsRelations;
