import {inject} from '@loopback/core'
import {getModelSchemaRef, param, patch} from '@loopback/rest'
import {SantanderRelatedAccountNames, SetTransfersResponse} from '../models'
import {DateService, PayeeSetupService} from '../services'
import {IUpdateTransaction} from '../ynab-api'

export class TransfersController {
  constructor(
    @inject('services.DateService') private dateService: DateService,
    @inject('services.PayeeSetupService') private payeeSetupService: PayeeSetupService,
  ) { }

  @patch('/budget/{budget_id}/transfers/santander/setup', {
    tags: ['Transfers Handler'],
    responses: {
      '200': {
        description: 'Transfer transactions successfuly setup',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SetTransfersResponse, {includeRelations: true}),
          },
        },
      }
    }
  })
  async setSantanderTransfers(
    @param.path.string('budget_id', {default: 'last-used'}) budgetId: string,
    @param.query.string('month') month: string = this.dateService.getCurrentMonth(),
    @param.query.string('year') year: number = +this.dateService.getCurrentYear(),
  ): Promise<SetTransfersResponse> {
    const accountNames = new SantanderRelatedAccountNames()
    const transfers = await this.payeeSetupService.getSantanderTransfers(budgetId, accountNames, year, this.dateService.pipeMonth(month))
    const toBeUpdated: IUpdateTransaction[] = this.payeeSetupService.buildUpdateTransactionList(transfers)
    return this.payeeSetupService.resolvePayeeSetupUpdates(budgetId, toBeUpdated)
  }




}
