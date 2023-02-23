import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {PythonService} from '.';
// import {ICategory, ITransactionDetail} from '../ynab-api';
// import {defaultCategoryTransactionContainsConfig} from './config';
@injectable({scope: BindingScope.TRANSIENT})
export class YnabHandleService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
  ) { }

  // categorizeTransactions(transactions: ITransactionDetail[], categories: ICategory[], config: any) {
  //   config = defaultCategoryTransactionContainsConfig
  //   const categorizedTransactions: ITransactionDetail[] = []
  //   const transactionsFiltered = transactions.map((transaction) => {
  //     return {
  //       id: transaction.id,
  //       memo: transaction.memo,
  //       category_id: transaction.category_id,
  //       category_name: transaction.category_name
  //     }
  //   })
  //   const categoriesFiltered = categories.map((category) => {
  //     return {
  //       id: category.id,
  //       name: category.name
  //     }
  //   })
  //   const scriptResponse = this.pythonService.runScript('ynab-categorize-transactions', [transactionsFiltered, categoriesFiltered, config])
  //   if (scriptResponse.success) {
  //     const categorized = scriptResponse.result
  //     for (let i = 0; i < transactions.length; i++) {
  //       if (categorized[i].category_modified) {
  //         const toUpdate: ITransactionDetail = {
  //           id: transactions[i].id,
  //           date: transactions[i].date,
  //           amount: transactions[i].amount,
  //           cleared: transactions[i].cleared,
  //           approved: transactions[i].approved,
  //           account_id: transactions[i].account_id,
  //           deleted: transactions[i].deleted,
  //           account_name: transactions[i].account_name,
  //           subtransactions: transactions[i].subtransactions,
  //           category_id: categorized[i].category_id,
  //           memo: transactions[i].memo
  //         }
  //         categorizedTransactions.push(toUpdate)
  //       }
  //     }
  //   }


  //   return categorizedTransactions
  // }
}
