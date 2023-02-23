import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {DateService, TransferService, ValidationService, YnabAccountsService, YnabTransactionsService} from '.';
import {SantanderRelatedAccountNames, SantanderRelatedAccounts, SantanderRelatedTransactions, SantanderRelatedTransfers, SetupPayeePairsResult, TransactionDetail, TransferPair} from '../models';
import {IAccount, ITransactionsResponse, IUpdateTransaction, IUpdateTransactionsWrapper} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class PayeeSetupService {
  constructor(
    @inject('services.TransferService') private transferService: TransferService,
    @inject('services.YnabTransactionsService') private ynabTransactionsService: YnabTransactionsService,
    @inject('services.YnabAccountsService') private ynabAccountsService: YnabAccountsService,
    @inject('services.DateService') private dateService: DateService,
    @inject('services.ValidationService') private validationService: ValidationService
  ) { }

  async resolvePayeeSetupUpdates(budgetId: string, toBeUpdated: IUpdateTransaction[]): Promise<SetupPayeePairsResult> {
    const _requestBody: IUpdateTransactionsWrapper = {transactions: toBeUpdated}
    const updated: any = await this.ynabTransactionsService.updateTransactions(budgetId, _requestBody)
    const setupResult = new SetupPayeePairsResult()
    if (updated) {
      setupResult.updated = updated as any
    } else {
      setupResult.updated = []
    }
    return setupResult
  }

  buildUpdateTransactionList(transfers: SantanderRelatedTransfers): IUpdateTransaction[] {
    const toBeUpdated: IUpdateTransaction[] = []
    toBeUpdated.push(
      ...this.getUpdateListByPairs(
        transfers.accounts.credit.transfer_payee_id,
        transfers.debitToCredit.map((pair: TransferPair) => {
          pair.sourceMessage = 'credit-payment'
          pair.destinationMessage = 'payment-from-debit'
          return pair
        })
      )
    )
    toBeUpdated.push(
      ...this.getUpdateListByTransactions(
        transfers.accounts.cash.transfer_payee_id,
        transfers.creditToCash,
        'cash-withdrawal'
      )
    )
    toBeUpdated.push(
      ...this.getUpdateListByTransactions(
        transfers.accounts.cash.transfer_payee_id,
        transfers.cashToDebit,
        'cash-deposit'
      )
    )
    return toBeUpdated
  }

  async getSantanderTransfers(budgetId: string, accountNames: SantanderRelatedAccountNames, year: number, monthIdx: number): Promise<SantanderRelatedTransfers> {
    const accounts = await this.fetchSantanderRelatedAccounts(budgetId, accountNames)
    const sinceDate = this.dateService.getMonthStart(year, monthIdx).toISOString().split('T')[0]
    const untilDate = this.dateService.getMonthEnd(year, monthIdx).toISOString().split('T')[0]
    const transactions = await this.fetchSantanderRelatedTransactions(budgetId, accounts, sinceDate, untilDate)
    const transfers = new SantanderRelatedTransfers()
    transfers.debitToCredit = this.transferService.findTransferPairs(
      transactions.debit,
      transactions.credit,
      this.transferService.getTransferConfig(
        accountNames.debit,
        accountNames.credit
      )
    )
    transfers.creditToCash = this.transferService.findTransferTransactions(
      transactions.credit,
      this.transferService.getTransferConfig(
        accountNames.credit,
        accountNames.cash
      )
    )
    transfers.cashToDebit = this.transferService.findTransferTransactions(
      transactions.debit,
      this.transferService.getTransferConfig(
        accountNames.cash,
        accountNames.debit
      )
    )
    transfers.accounts = accounts
    return transfers
  }

  async fetchSantanderRelatedTransactions(budgetId: string, accounts: SantanderRelatedAccounts, sinceDate: string, untilDate: string): Promise<SantanderRelatedTransactions> {
    const all: TransactionDetail[] = await this.ynabTransactionsService.getTransactions(budgetId, sinceDate, undefined, undefined)
      .then((response: ITransactionsResponse) => {
        return this.validationService.filterValidHistory(response.data.transactions as any, sinceDate, untilDate, false)
      })
    const transactions = new SantanderRelatedTransactions()
    transactions.debit = all.filter(trans => trans.account_id == accounts.debit.id)
    transactions.credit = all.filter(trans => trans.account_id == accounts.credit.id)
    transactions.cash = all.filter(trans => trans.account_id == accounts.cash.id)
    return transactions
  }

  async fetchSantanderRelatedAccounts(budgetId: string, santanderRelatedAccountNames: SantanderRelatedAccountNames): Promise<SantanderRelatedAccounts> {
    const accounts: IAccount[] = await this.ynabAccountsService.getAccounts(budgetId, undefined).then(res => res.data?.accounts)
    const santanderRelatedAccounts = new SantanderRelatedAccounts()
    santanderRelatedAccounts.debit = accounts.filter(acc => acc.name == santanderRelatedAccountNames.debit)[0] as any
    santanderRelatedAccounts.credit = accounts.filter(acc => acc.name == santanderRelatedAccountNames.credit)[0] as any
    santanderRelatedAccounts.cash = accounts.filter(acc => acc.name == santanderRelatedAccountNames.cash)[0] as any
    return santanderRelatedAccounts
  }

  getUpdateListByPairs(destinationTransferPayeeId: string, transferPairs: TransferPair[]): any {
    const toBeUpdated: IUpdateTransaction[] = []
    for (const pair of transferPairs) {
      toBeUpdated.push(this.transferService.setupTransferTransaction(pair.source, destinationTransferPayeeId, pair.sourceMessage))
      toBeUpdated.push(this.setupStaleTransaction(pair.destination, pair.destinationMessage))
    }
    return toBeUpdated
  }

  getUpdateListByTransactions(transferPayeeId: string, transactions: TransactionDetail[], message = 'parsed-transfer'): any {
    const toBeUpdated: IUpdateTransaction[] = transactions.map(transaction => this.transferService.setupTransferTransaction(transaction, transferPayeeId, message))
    return toBeUpdated
  }

  getReadyToAssignCategoryId(): string {
    return 'e5d4331b-5a87-4205-b43c-9bfe4b89d9f7'
  }

  setupStaleTransaction(transaction: TransactionDetail, newMemo: string = 'stale-transaction'): IUpdateTransaction {
    return {
      id: transaction.id,
      account_id: transaction.account_id,
      category_id: this.getReadyToAssignCategoryId(),
      date: transaction.date,
      amount: 0,
      memo: `${transaction.memo.slice(0, 5)} ${newMemo}`,
    }
  }

}
