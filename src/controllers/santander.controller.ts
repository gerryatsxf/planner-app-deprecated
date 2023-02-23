
import {inject} from '@loopback/core'
import {getModelSchemaRef, param, post, Request, requestBody, Response, RestBindings} from '@loopback/rest'
import {SantanderFileParseConfig, SantanderFileParseResponse, UploadTransactionsResponse} from '../models'
import {DateService, FileReadService, SantanderFileService, SantanderInputService, YnabAccountsService} from '../services'


export class SantanderController {
  constructor(
    @inject('services.FileReadService') private fileReadService: FileReadService,
    @inject('services.SantanderFileService') private santanderFileService: SantanderFileService,
    @inject('services.DateService') private dateService: DateService,
    @inject('services.SantanderInputService') private santanderInputService: SantanderInputService,
    @inject('services.YnabAccountsService') private ynabAccountsService: YnabAccountsService,

  ) { }


  @post('/santander/{fileAccountType}', {
    tags: ['Santander File Handler'],
    responses: {
      '200': {
        description: 'Santander file transactions were successfully parsed',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SantanderFileParseResponse, {includeRelations: true}),
          },
        },
      }
    }
  })
  async inputFromFile(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('fileAccountType') fileAccountType: string,
    @param.query.string('sinceDate') sinceDate?: string,
    @param.query.string('untilDate') untilDate?: string
  ): Promise<SantanderFileParseResponse> {
    const fileContentResult = await this.fileReadService.getContent(request, response)
    const parseResponse = new SantanderFileParseResponse()
    const parseConfig = new SantanderFileParseConfig()
    parseConfig.fileAccountType = fileAccountType
    parseConfig.sinceDate = sinceDate ? sinceDate : parseConfig.sinceDate
    parseConfig.untilDate = untilDate ? untilDate : parseConfig.untilDate
    parseResponse.data = this.santanderFileService.asTransactions(fileContentResult.data, parseConfig)
    return parseResponse
  }


  @post('/budget/{budget_id}/account/{account_name}/santander/upload', {
    tags: ['Santander File Handler'],
    responses: {
      '200': {
        description: 'Santander\'s transactions were successfully uploaded',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UploadTransactionsResponse, {includeRelations: true}),
          },
        },
      },
      '406': {
        description: 'Input parameters are partially or fully non compliant, please try again'
      },
      '422': {
        description: 'Input file is not compliant with completeness requirements. Please update it.'
      }
    }
  })
  async inputFromFileByAccountName(
    @param.path.string('budget_id', {default: 'last-used'}) budgetId: string,
    @param.path.string('account_name') accountName: string,
    @param.query.string('month') month: string = this.dateService.getCurrentMonth(),
    @param.query.string('year') year: number = +this.dateService.getCurrentYear(),
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<UploadTransactionsResponse> {
    const monthIdx: number = this.dateService.pipeMonth(month)
    const accountId: string = await this.ynabAccountsService.getAccountByName(budgetId, accountName).then(res => res.data.account.id)
    const fileContent = await this.fileReadService.getContent(request, response).then(result => result.data)
    const inputResult = await this.santanderInputService.inputFile(fileContent, year, monthIdx, budgetId, accountId)
    const uploadResponse = new UploadTransactionsResponse()
    uploadResponse.uploaded = inputResult.saved
    return uploadResponse
  }
}
