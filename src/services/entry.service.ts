import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {DateService, PythonService} from '.';
import {Category, Entry, PourConfigEntry} from '../models';
import {EntryRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class EntryService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
    @repository(EntryRepository) public entryRepository: EntryRepository,
    @inject('services.DateService') private dateService: DateService,

  ) { }

  async pour(categories: Category[], year: number, monthIdx: number, pourConfig: PourConfigEntry) {
    const sinceDate = this.dateService.getMonthStart(year, monthIdx)
    const untilDate = this.dateService.getMonthEnd(year, monthIdx)
    const entries: Entry[] = await this.entryRepository.find({where: {and: [{datePlanned: {gte: sinceDate}}, {datePlanned: {lte: untilDate}}]}})
    const result = this.pythonService.runScript('planner-pour-entries', [entries, pourConfig])
    return result
  }

}
