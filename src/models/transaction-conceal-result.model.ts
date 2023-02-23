import {Model, model, property} from '@loopback/repository';

@model()
export class TransactionConcealResult extends Model {

  constructor(data?: Partial<TransactionConcealResult>) {
    super(data);
  }
}

export interface TransactionConcealResultRelations {
  // describe navigational properties here
}

export type TransactionConcealResultWithRelations = TransactionConcealResult & TransactionConcealResultRelations;
