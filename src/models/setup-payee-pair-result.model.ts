import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class SetupPayeePairsResult extends Model {

  constructor(data?: Partial<SetupPayeePairsResult>) {
    super(data);
  }

  @property.array(TransactionDetail)
  updated: TransactionDetail[]
}

export interface SetupPayeePairsResultRelations {
  // describe navigational properties here
}

export type SetupPayeePairsResultWithRelations = SetupPayeePairsResult & SetupPayeePairsResultRelations;
