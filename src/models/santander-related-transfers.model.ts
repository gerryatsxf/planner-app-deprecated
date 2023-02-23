import {Model, model, property} from '@loopback/repository';
import {SantanderRelatedAccounts, TransactionDetail, TransferPair} from '.';

@model()
export class SantanderRelatedTransfers extends Model {

  constructor(data?: Partial<SantanderRelatedTransfers>) {
    super(data);
  }

  @property.array(TransferPair)
  debitToCredit: TransferPair[]

  @property.array(TransactionDetail)
  creditToCash: TransactionDetail[]

  @property.array(TransactionDetail)
  cashToDebit: TransactionDetail[]

  @property(SantanderRelatedAccounts)
  accounts: SantanderRelatedAccounts
}

export interface SantanderRelatedTransfersRelations {
  // describe navigational properties here
}

export type SantanderRelatedTransfersWithRelations = SantanderRelatedTransfers & SantanderRelatedTransfersRelations;
