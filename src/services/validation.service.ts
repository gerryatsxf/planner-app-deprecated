import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {TransactionDetail} from '../models';
import {ICategory} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class ValidationService {
  constructor(/* Add @inject to inject parameters */) { }

  filterValidHistory(history: TransactionDetail[], sinceDate: string, untilDate: string, filterSerial: boolean = true): TransactionDetail[] {
    let hist = history
      .filter(transaction => transaction.date >= sinceDate)                                            // only consider transactions from the given date onwards)
      .filter(transaction => transaction.date <= untilDate)                                            // only consider transactions until the day before the given date)
      .filter(transaction => transaction.memo !== '' || transaction.memo !== null)                     // remove empty memos
    if (filterSerial) {
      hist = hist.filter(transaction => transaction.memo ? /^[0-9]+$/.test(transaction.memo.slice(0, 5)) : false) // remove memos that do not have a serial number
    }
    return hist
  }

  simplifyTransactionMap(transaction: TransactionDetail) {
    return {
      id: transaction.id,
      account_id: transaction.account_id,
      memo: transaction.memo,
      amount: transaction.amount,
      date: transaction.date,
      category_id: transaction.category_id,
      category_name: transaction.category_name
    }
  }

  simplifyCategoryMap(category: ICategory) {
    return {
      id: category.id,
      name: category.name
    }
  }
}
