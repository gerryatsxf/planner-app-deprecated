import {inject} from '@loopback/core';
import {get, param, post, Request, requestBody, Response, response, RestBindings} from '@loopback/rest';
import {Category, PourConfigEntry} from '../models';
import {CategoriesService, DateService, EntriesInputService, EntryService, FileDownloadService, FileReadService} from '../services';

export class BudgetController {
  constructor(
    @inject('services.EntryService') private entryService: EntryService,
    @inject('services.CategoriesService') private categoriesService: CategoriesService,
    @inject('services.EntriesInputService') private entriesInputService: EntriesInputService,
    @inject('services.FileReadService') private fileReadService: FileReadService,
    @inject('services.DateService') private dateService: DateService,
    @inject('services.FileDownloadService') private fileDownloadService: FileDownloadService,

  ) { }

  @get('/budget/{budget_id}/download')
  @response(200, {
    description: 'Entries file download sucessful',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async downloadCategoryBudgetFile(
    @param.path.string('budget_id') budgetId: string,
    @param.query.string('month') month: string = this.dateService.getCurrentMonth(),
    @param.query.string('year') year: number = +this.dateService.getCurrentYear(),
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<any> {
    const monthIdx: number = this.dateService.pipeMonth(month)
    const categories: Category[] = await this.categoriesService.fetchCategories(budgetId)
    const pourConfig: PourConfigEntry = new PourConfigEntry()
    await this.entryService.pour(categories, year, monthIdx, pourConfig);
    return this.fileDownloadService.fromSource(response, pourConfig.pourExcelFilePath);
  }

  @post('/budget/{budget_id}/update')
  @response(200, {
    description: 'Files and fields',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async runLinkProcess(
    @param.path.string('budget_id') budgetId: string,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<object> {
    const fileReadResult = await this.fileReadService.getContent(request, response) // this will store file in .sandbox directory
    const filePath = `${this.fileReadService.getSandboxPath()}/${fileReadResult.file.files[0].originalname}`
    const inputResult = await this.entriesInputService.inputFile(filePath, budgetId)
    return {}
  }



}
