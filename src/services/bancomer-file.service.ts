import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {PythonService} from '.';
import {BancomerFileParseConfig, ScriptResult} from '../models';
import {BancomerParseType} from '../models/bancomer-parse-type.enum';
import {TransactionInput} from '../models/transaction-input.model';

@injectable({scope: BindingScope.TRANSIENT})
export class BancomerFileService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,

  ) { }

  asTransactions(filePath: string, parseConfig: BancomerFileParseConfig): TransactionInput[] {
    if (!Object.values(BancomerParseType).includes(parseConfig.fileAccountType as BancomerParseType)) {
      throw new HttpErrors.UnprocessableEntity(`Account of type ${parseConfig.fileAccountType} not valid`)
    }
    const scriptResult: ScriptResult = this.pythonService.runScript('parse-bancomer-transactions', [filePath, parseConfig])
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
