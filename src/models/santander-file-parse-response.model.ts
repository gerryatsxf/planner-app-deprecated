import {Model, model, property} from '@loopback/repository';
import {TransactionInput} from './transaction-input.model';

@model()
export class SantanderFileParseResponse extends Model {

  constructor(data?: Partial<SantanderFileParseResponse>) {
    super(data);
  }

  @property.array(TransactionInput)
  data: TransactionInput[];

}

export interface SantanderFileParseResponseRelations {
  // describe navigational properties here
}

export type SantanderFileParseResponseWithRelations = SantanderFileParseResponse & SantanderFileParseResponseRelations;
