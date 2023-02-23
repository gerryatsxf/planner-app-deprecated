import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SantanderFileParseConfig, TransactionDetail} from '../models';
import {EntryInput} from '../models/entry-input.model';
import {SelectEntriesInputResult} from '../models/select-entries-input-result.model';
import {TransactionInput} from '../models/transaction-input.model';

@injectable({scope: BindingScope.TRANSIENT})
export class ConcealerService {
  constructor(
  ) { }

  selectEntriesInput(rawInput: EntryInput[]): SelectEntriesInputResult {
    const result = new SelectEntriesInputResult()
    result.toBeCreated = this.selectEntriesToCreate(rawInput)
    result.toBeUpdated = this.selectEntriesToUpdate(rawInput)
    return result
  }

  selectEntriesToCreate(input: EntryInput[]): EntryInput[] {
    return input.filter(entry => (typeof entry.idEntry !== 'string') || (entry.idEntry == ''))
  }

  selectEntriesToUpdate(input: EntryInput[]): EntryInput[] {
    return input.filter(entry => entry.modify == true)
  }

  selectYnabInput(input: TransactionInput[], sinceDate: string, history: TransactionDetail[], parseConfig: SantanderFileParseConfig): TransactionInput[] {
    if (parseConfig.fileAccountType == 'credit') {
      history = history.filter(trans => !trans.memo.includes('credit-payment'))
    }
    const thresholdTransactionMemo = history.length > 0 ? this.selectLastTransaction(history).memo : '00000'
    return this.selectTransactionInput(input, sinceDate, thresholdTransactionMemo)
  }

  /**
   * This checks that there is at least one transaction before the given date
   * It helps in determining if there may be missing month transactions in file input
   */
  public inputBeforeDateExists(input: TransactionInput[], sinceDate: string): boolean {return input.filter(a => a.date < sinceDate).length > 0}



  private selectLastTransaction(transactions: TransactionDetail[]) {
    return transactions
      .sort((a, b) => {                                                             // sort in ascending alphanumeric order of memos
        const textA = a.memo ? a.memo.toUpperCase() : ''
        const textB = b.memo ? b.memo.toUpperCase() : ''
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      .slice(-1)[0]
  }

  private selectTransactionInput(input: TransactionInput[], sinceDate: string, thresholdTransactionMemo: string) {
    return input
      .filter(transactionInput => transactionInput.date >= sinceDate)
      .filter(transactionInput => transactionInput.serial > thresholdTransactionMemo)
  }

  getAccountTypeMap(ynabAccountType: string): string {
    const parserAccountType: string | undefined = {
      checking: 'debit',
      creditCard: 'credit',
      savings: 'debit',
      cash: 'cash',
      lineOfCredit: 'lineOfCredit',
      otherAsset: 'otherAsset',
      otherLiability: 'otherLiability',
      payPal: 'payPal',
      merchantAccount: 'merchantAccount',
      investmentAccount: 'investmentAccount',
      mortgage: 'mortgage'
    }[ynabAccountType]
    if (!parserAccountType) {
      throw new HttpErrors.UnprocessableEntity(`Parser account of type ${parserAccountType} not found`)
    }
    return parserAccountType
  }

}
