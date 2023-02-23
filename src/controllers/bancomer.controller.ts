import {inject} from '@loopback/core'
import {getModelSchemaRef, param, post, Request, requestBody, Response, RestBindings} from '@loopback/rest'
import {BancomerFileParseConfig, BancomerFileParseResponse, UploadTransactionsResponse} from '../models'
import {BancomerFileService, BancomerInputService, DateService, FileReadService, YnabAccountsService} from '../services'

export class BancomerController {
  constructor(
    @inject('services.FileReadService') private fileReadService: FileReadService,
    @inject('services.BancomerFileService') private bancomerFileService: BancomerFileService,
    @inject('services.DateService') private dateService: DateService,
    @inject('services.BancomerInputService') private bancomerInputService: BancomerInputService,
    @inject('services.YnabAccountsService') private ynabAccountsService: YnabAccountsService,
  ) { }


  @post('/bancomer/{fileAccountType}', {
    tags: ['Bancomer File Handler'],
    responses: {
      '200': {
        description: 'Bancomer file transactions were successfully parsed',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BancomerFileParseResponse, {includeRelations: true}),
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
  ): Promise<BancomerFileParseResponse> {
    const fileContentResult = await this.fileReadService.getContent(request, response)
    const parseResponse = new BancomerFileParseResponse()
    const parseConfig = new BancomerFileParseConfig()
    parseConfig.fileAccountType = fileAccountType
    parseConfig.sinceDate = sinceDate ? sinceDate : parseConfig.sinceDate
    parseConfig.untilDate = untilDate ? untilDate : parseConfig.untilDate
    parseResponse.data = this.bancomerFileService.asTransactions(fileContentResult.data, parseConfig)
    return parseResponse
  }


  @post('/budget/{budget_id}/account/{account_name}/bancomer/upload', {
    tags: ['Bancomer File Handler'],
    responses: {
      '200': {
        description: 'Bancomer\'s transactions were successfully uploaded',
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
        description: 'Input file is not compliant with completess requirements. Please update it.'
      }
    }
  })
  async inputFromFileByAccountName(
    @param.path.string('budget_id') budgetId: string,
    @param.path.string('account_name') accountName: string,
    @param.query.string('month') month: string = this.dateService.getCurrentMonth(),
    @param.query.string('year') year: number = +this.dateService.getCurrentYear(),
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<UploadTransactionsResponse> {
    const monthIdx: number = this.dateService.pipeMonth(month)
    const accountId: string = await this.ynabAccountsService.getAccountByName(budgetId, accountName).then(res => res.data.account.id)
    const fileReadResult = await this.fileReadService.getContent(request, response) // this will store file in .sandbox directory
    const filePath = `${this.fileReadService.getSandboxPath()}/${fileReadResult.file.files[0].originalname}`
    const inputResult = await this.bancomerInputService.inputFile(filePath, year, monthIdx, budgetId, accountId)
    const uploadResponse = new UploadTransactionsResponse()
    uploadResponse.uploaded = inputResult.saved
    return uploadResponse
  }
}
