import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class SetTransfersResponse extends Model {

  constructor(data?: Partial<SetTransfersResponse>) {
    super(data);
  }
  @property.array(TransactionDetail)
  updated: TransactionDetail[]
}

export interface SetTransfersResponseRelations {
  // describe navigational properties here
}

export type SetTransfersResponseWithRelations = SetTransfersResponse & SetTransfersResponseRelations;
