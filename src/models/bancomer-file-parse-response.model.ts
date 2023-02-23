import {Model, model, property} from '@loopback/repository';
import {TransactionInput} from './transaction-input.model';

@model()
export class BancomerFileParseResponse extends Model {

  constructor(data?: Partial<BancomerFileParseResponse>) {
    super(data);
  }

  @property.array(TransactionInput)
  data: TransactionInput[];
}

export interface BancomerFileParseResponseRelations {
  // describe navigational properties here
}

export type BancomerFileParseResponseWithRelations = BancomerFileParseResponse & BancomerFileParseResponseRelations;
