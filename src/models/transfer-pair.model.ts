import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class TransferPair extends Model {

  constructor(data?: Partial<TransferPair>) {
    super(data);
  }

  @property(TransactionDetail)
  source: TransactionDetail

  @property(TransactionDetail)
  destination: TransactionDetail

  @property({
    type: 'string',
    required: false
  })
  sourceMessage?: string;

  @property({
    type: 'string',
    required: false
  })
  destinationMessage?: string;
}

export interface TransferPairRelations {
  // describe navigational properties here
}

export type TransferPairWithRelations = TransferPair & TransferPairRelations;
