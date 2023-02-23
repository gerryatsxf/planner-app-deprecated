import {Model, model, property} from '@loopback/repository';
import {TransactionDetail} from './transaction-detail.model';

@model()
export class SantanderInputFileResult extends Model {

  constructor(data?: Partial<SantanderInputFileResult>) {
    super(data);
  }

  @property.array(TransactionDetail)
  saved: TransactionDetail[]
}

export interface SantanderInputFileResultRelations {
  // describe navigational properties here
}

export type SantanderInputFileResultWithRelations = SantanderInputFileResult & SantanderInputFileResultRelations;
