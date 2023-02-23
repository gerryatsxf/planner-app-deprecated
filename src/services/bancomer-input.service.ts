import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {BancomerFileService, ConcealerService, DateService, ValidationService, YnabAccountsService, YnabTransactionsService} from '.';
import {SantanderFileParseConfig, SantanderInputFileResult, TransactionDetail} from '../models';
import {TransactionInput} from '../models/transaction-input.model';
import {IAccount, ISaveTransaction, ISaveTransactionClearedEnum, ISaveTransactionsWrapper, ITransactionsResponse} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class BancomerInputService {
  constructor(
    @inject('services.DateService') private dateService: DateService,
    @inject('services.ConcealerService') private concealerService: ConcealerService,
    @inject('services.ValidationService') private validationService: ValidationService,
    @inject('services.YnabAccountsService') private ynabAccountsService: YnabAccountsService,
    @inject('services.BancomerFileService') private bancomerFileService: BancomerFileService,
    @inject('services.YnabTransactionsService') private ynabTransactionsService: YnabTransactionsService,
  ) { }

  async inputFile(filePath: string, year: number, monthIdx: number, budgetId: string, accountId: string): Promise<SantanderInputFileResult> {

    const account: IAccount = await this.ynabAccountsService.getAccountById(budgetId, accountId).then(res => res.data.account)
    const sinceDate = this.dateService.getMonthStart(year, monthIdx).toISOString().split('T')[0]
    const untilDate = this.dateService.getMonthEnd(year, monthIdx).toISOString().split('T')[0]

    const serializedTransactions: TransactionDetail[] = await this.ynabTransactionsService.getTransactionsByAccount(budgetId, accountId, sinceDate, undefined, undefined)
      .then((response: ITransactionsResponse) => {
        return this.validationService.filterValidHistory(response.data.transactions as any, sinceDate, untilDate)
      })

    const parseConfig = new SantanderFileParseConfig(); parseConfig.fileAccountType = this.concealerService.getAccountTypeMap(account?.type)
    const rawInput: TransactionInput[] = this.bancomerFileService.asTransactions(filePath, parseConfig)

    if (!this.concealerService.inputBeforeDateExists(rawInput, sinceDate)) {
      throw new HttpErrors.UnprocessableEntity('Cannot process this file since it may not have all transactions of month')
    }
    console.log(rawInput)
    throw Error()
    const toBeSaved: ISaveTransaction[] = await this.concealerService.selectYnabInput(rawInput, sinceDate, serializedTransactions, parseConfig)
      .map(transactionInput => this.inputToPayloadMap(transactionInput, accountId))

    const inputResult = new SantanderInputFileResult()

    if (toBeSaved.length > 0) {
      const _requestBody: ISaveTransactionsWrapper = {transactions: toBeSaved}
      inputResult.saved = await this.ynabTransactionsService.createTransaction(budgetId, _requestBody).then(response => response.data?.transactions ? response.data?.transactions as any : [])
    } else {
      inputResult.saved = []
    }

    return inputResult

  }

  public inputToPayloadMap(transactionInput: TransactionInput, accountId: string): ISaveTransaction {
    const transaction: ISaveTransaction = {
      account_id: accountId,
      date: transactionInput.date,
      amount: Math.round((transactionInput.inflow > 0 ? transactionInput.inflow : -transactionInput.outflow) * 1000),
      memo: `${transactionInput.serial} ${transactionInput.memo}`,
      cleared: ISaveTransactionClearedEnum.Cleared,
      approved: true
    }
    console.log(transaction.memo)
    return transaction
  }
}
