import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {PythonService, ValidationService} from '.';
import {ScriptResult, TransactionDetail, TransferPair} from '../models';
import {IUpdateTransaction} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class TransferService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
    @inject('services.ValidationService') private validationService: ValidationService,
  ) { }

  setupTransferTransaction(transaction: TransactionDetail, destinationTransferPayeeId: string, newMemo: string = 'parsed-transfer'): IUpdateTransaction {
    return {
      id: transaction.id,
      account_id: transaction.account_id,
      date: transaction.date,
      amount: transaction.amount,
      payee_id: destinationTransferPayeeId,
      memo: `${transaction.memo.slice(0, 5)} ${newMemo}`
    }
  }

  findTransferPairs(source: TransactionDetail[], destination: TransactionDetail[], config: any): TransferPair[] {
    const sourceSimplified = source.map(transaction => this.validationService.simplifyTransactionMap(transaction))
    const destinationSimplified = destination.map(transaction => this.validationService.simplifyTransactionMap(transaction))
    const scriptResponse: ScriptResult = this.pythonService.runScript('ynab-identify-transfers', [sourceSimplified, destinationSimplified, config])
    if (scriptResponse.success) {
      return scriptResponse.result.map((rawPair: {pair: {source: TransactionDetail, destination: TransactionDetail}}) => {
        const pair = new TransferPair()
        pair.source = rawPair.pair.source
        pair.destination = rawPair.pair.destination
        return pair
      })
    } else {
      return [] as any
    }
  }

  findTransferTransactions(transactions: TransactionDetail[], config: any): TransactionDetail[] {
    return transactions.filter(transaction => transaction.memo.includes(config.selector))
  }

  getTransferConfig(sourceAccountName: string, destinationAccountName: string): any {
    if (sourceAccountName == 'santander-debit' && destinationAccountName == 'santander-credit') {
      return {
        source: {
          labelKey: 'CARGO PAGO TARJETA CREDITO'
        },
        destination: {
          labelKey: 'PAGO POR TRANSFERENCIA'
        },
      }
    }
    else if (sourceAccountName == 'cash' && destinationAccountName == 'santander-debit') {
      return {
        selector: 'DEPOSITO EN EFECTIVO'
      }
    }
    else if (sourceAccountName == 'santander-credit' && destinationAccountName == 'cash') {
      return {
        selector: 'BANCO SANTANDER'
      }
    }
  }

}
