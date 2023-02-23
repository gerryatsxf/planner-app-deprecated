import {inject} from '@loopback/core'
import {getModelSchemaRef, param, patch} from '@loopback/rest'
import {SetTransfersResponse, SetupCategoriesResponse} from '../models'
import {CategorizationService, DateService} from '../services'
import {ITransactionDetail} from '../ynab-api'

export class CategorizationController {
  constructor(
    @inject('services.DateService') private dateService: DateService,
    @inject('services.CategorizationService') private categorizationService: CategorizationService,

  ) { }

  @patch('/budget/{budget_id}/transactions/categorize', {
    tags: ['Transaction Categories Handler'],
    responses: {
      '200': {
        description: 'Transactions successfuly categorized',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SetupCategoriesResponse, {includeRelations: true}),
          },
        },
      }
    }
  })
  async setupTransactionCategories(
    @param.path.string('budget_id', {default: 'last-used'}) budgetId: string,
    @param.query.string('month') month: string = this.dateService.getCurrentMonth(),
    @param.query.string('year') year: number = +this.dateService.getCurrentYear(),
  ): Promise<SetTransfersResponse> {
    const categorized: ITransactionDetail[] = await this.categorizationService.getCategorizedTransactions(budgetId, year, this.dateService.pipeMonth(month))
    const result = new SetTransfersResponse()
    result.updated = await this.categorizationService.resolveTransactionsCategorization(budgetId, categorized)
    return result
  }
}
