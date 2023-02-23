import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class UploadTransactionsResponse extends Model {

  constructor(data?: Partial<UploadTransactionsResponse>) {
    super(data);
  }

  @property.array(TransactionDetail)
  uploaded: TransactionDetail[];
}

export interface UploadTransactionsResponseRelations {
  // describe navigational properties here
}

export type UploadTransactionsResponseWithRelations = UploadTransactionsResponse & UploadTransactionsResponseRelations;
