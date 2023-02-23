import {Model, model, property} from '@loopback/repository';
import {Account} from './account.model';

@model()
export class SantanderRelatedAccounts extends Model {

  constructor(data?: Partial<SantanderRelatedAccounts>) {
    super(data);
  }

  @property(Account)
  credit: Account

  @property(Account)
  debit: Account

  @property(Account)
  cash: Account
}

export interface SantanderRelatedAccountsRelations {
  // describe navigational properties here
}

export type SantanderRelatedAccountsWithRelations = SantanderRelatedAccounts & SantanderRelatedAccountsRelations;
