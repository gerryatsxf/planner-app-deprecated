import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SantanderFileParseConfig, ScriptResult} from '../models';
import {SantanderParseType} from '../models/santander-parse-type.enum';
import {TransactionInput} from '../models/transaction-input.model';
import {PythonService} from './python.service';

@injectable({scope: BindingScope.TRANSIENT})
export class SantanderFileService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
  ) { }

  asTransactions(fileContent: string, parseConfig: SantanderFileParseConfig): TransactionInput[] {
    if (!Object.values(SantanderParseType).includes(parseConfig.fileAccountType as SantanderParseType)) {
      throw new HttpErrors.UnprocessableEntity(`Account of type ${parseConfig.fileAccountType} not valid`)
    }
    const scriptResult: ScriptResult = this.pythonService.runScript('parse-santander-transactions', [fileContent, parseConfig])
    const transactions: TransactionInput[] = [];
    if (scriptResult.success) {
      transactions.push(...scriptResult.result.map((rawTransaction: any) => {
        const transaction = new TransactionInput
        transaction.date = rawTransaction.dateExecuted
        transaction.serial = rawTransaction.serial
        transaction.memo = rawTransaction.description
        transaction.inflow = rawTransaction.inflow
        transaction.outflow = rawTransaction.outflow
        return transaction
      }))
    }
    return transactions
  }
}
