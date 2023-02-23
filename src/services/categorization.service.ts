import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {ConfigService, DateService, PythonService, ValidationService, YnabCategoriesService, YnabTransactionsService} from '.';
import {ScriptResult, TransactionDetail} from '../models';
import {ICategory, ICategoryGroupWithCategories, ITransactionDetail, ITransactionsResponse, IUpdateTransactionsWrapper} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class CategorizationService {
  constructor(
    @inject('services.DateService') private dateService: DateService,
    @inject('services.ConfigService') private configService: ConfigService,

    @inject('services.YnabTransactionsService') private ynabTransactionsService: YnabTransactionsService,
    @inject('services.ValidationService') private validationService: ValidationService,
    @inject('services.YnabCategoriesService') private ynabCategoriesService: YnabCategoriesService,
    @inject('services.PythonService') private pythonService: PythonService,

  ) { }

  async getCategorizedTransactions(budgetId: string, year: number, monthIdx: number): Promise<ITransactionDetail[]> {
    const sinceDate = this.dateService.getMonthStart(year, monthIdx).toISOString().split('T')[0]
    const untilDate = this.dateService.getMonthEnd(year, monthIdx).toISOString().split('T')[0]
    const uncategorized = await this.fetchUncategorizedTransactions(budgetId, sinceDate, untilDate)
    const categories: ICategory[] = []; await this.ynabCategoriesService.getCategories(budgetId, undefined)
      .then(response => response.data.category_groups)
      .then(groups => groups.forEach((group: ICategoryGroupWithCategories) => {categories.push(...group.categories)}));
    const config = {}
    const categorized = await this.categorize(uncategorized, categories, config)
    return categorized
  }

  async fetchUncategorizedTransactions(budgetId: string, sinceDate: string, untilDate: string): Promise<TransactionDetail[]> {
    return this.ynabTransactionsService.getTransactions(budgetId, sinceDate, "uncategorized", undefined)
      .then((response: ITransactionsResponse) => {
        return this.validationService.filterValidHistory(response.data.transactions as any, sinceDate, untilDate, false)
      })
  }

  async resolveTransactionsCategorization(budgetId: string, categorized: ITransactionDetail[]): Promise<any> {
    if (categorized.length > 0) {
      const payload: IUpdateTransactionsWrapper = {transactions: categorized}
      return this.ynabTransactionsService.updateTransactions(budgetId, payload)
    } else {
      return {}
    }
  }

  // setupCategorizedTransaction(rawTransaction: TransactionDetail, newCategoryId: string): IUpdateTransaction {
  //   return {
  //     id: transaction.id,
  //     account_id: transaction.account_id,
  //     category_id: this.getReadyToAssignCategoryId(),
  //     date: transaction.date,
  //     amount: 0,
  //     memo: `${transaction.memo.slice(0, 5)} ${newMemo}`,
  //   }
  // }



  async categorize(transactions: TransactionDetail[], categories: ICategory[], config: any): Promise<ITransactionDetail[]> {
    config = await this.configService.getCategoryContainsConfig()
    console.log('hello')
    console.log(config)
    const categorized: TransactionDetail[] = []
    const simplifiedTransactions = transactions.map(trans => this.validationService.simplifyTransactionMap(trans))
    const simplifiedCategories = categories.map(cat => this.validationService.simplifyCategoryMap(cat))
    const scriptResponse: ScriptResult = this.pythonService.runScript('ynab-categorize-transactions', [simplifiedTransactions, simplifiedCategories, config])
    if (scriptResponse.success) {
      const categorizedRaw: any = scriptResponse.result
      for (let i = 0; i < transactions.length; i++) {
        if (categorizedRaw[i].category_modified) {
          const toUpdate = new TransactionDetail()
          toUpdate.id = transactions[i].id
          toUpdate.date = transactions[i].date
          toUpdate.amount = transactions[i].amount
          toUpdate.cleared = transactions[i].cleared
          toUpdate.approved = transactions[i].approved
          toUpdate.account_id = transactions[i].account_id
          toUpdate.deleted = transactions[i].deleted
          toUpdate.account_name = transactions[i].account_name
          toUpdate.subtransactions = transactions[i].subtransactions
          toUpdate.category_id = categorizedRaw[i].category_id
          toUpdate.memo = transactions[i].memo
          categorized.push(toUpdate)
        }
      }
    }
    return categorized
  }
}
