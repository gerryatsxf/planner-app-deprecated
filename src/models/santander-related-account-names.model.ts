import {Model, model, property} from '@loopback/repository';

@model()
export class SantanderRelatedAccountNames extends Model {

  constructor(data?: Partial<SantanderRelatedAccountNames>) {
    super(data);
  }
  @property({
    type: 'string',
    required: true
  })
  credit: string = 'santander-credit'

  @property({
    type: 'string',
    required: true
  })
  debit: string = 'santander-debit'

  @property({
    type: 'string',
    required: true
  })
  cash: string = 'cash'
}

export interface SantanderRelatedAccountNamesRelations {
  // describe navigational properties here
}

export type SantanderRelatedAccountNamesWithRelations = SantanderRelatedAccountNames & SantanderRelatedAccountNamesRelations;
