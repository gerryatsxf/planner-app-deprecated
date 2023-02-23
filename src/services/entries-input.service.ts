import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConcealerService} from '.';
import {Entry} from '../models';
import {EntriesFileParseConfig} from '../models/entries-file-parse-config.model';
import {EntriesInputFileResult} from '../models/entries-input-file-result.model';
import {EntryInput} from '../models/entry-input.model';
import {SelectEntriesInputResult} from '../models/select-entries-input-result.model';
import {EntryRepository} from '../repositories';
import {CategoriesService} from './categories.service';
import {EntriesFileService} from './entries-file.service';

@injectable({scope: BindingScope.TRANSIENT})
export class EntriesInputService {
  constructor(
    @inject('services.ConcealerService') private concealerService: ConcealerService,
    @inject('services.EntriesFileService') private entriesFileService: EntriesFileService,
    @repository(EntryRepository) public entryRepository: EntryRepository,
    @inject('services.CategoriesService') private categoriesService: CategoriesService,

  ) { }

  async inputFile(filePath: string, budgetId: string): Promise<EntriesInputFileResult> {
    const parseConfig = new EntriesFileParseConfig()
    parseConfig.categories = await this.categoriesService.fetchCategories(budgetId)
    // parseConfig.filePath = filePath
    const rawInput: EntryInput[] = this.entriesFileService.asInput(filePath, parseConfig)
    const selectResult: SelectEntriesInputResult = await this.concealerService.selectEntriesInput(rawInput)

    // const toBeCreated: Entry[] = selectResult.toBeCreated
    //   .map(entryInput => this.inputToPayloadMap(entryInput, budgetId))

    // const
    //   console.log(selectResult)


    const result = new EntriesInputFileResult()
    // result.created = await this.entryRepository.createAll(selectResult.toBeCreated.map(entryInput => this.inputToPayloadMap(entryInput)))
    // result.updated = []
    // for (const entry of selectResult.toBeUpdated.map(entryInput => this.inputToPayloadMap(entryInput))) {
    //   await this.entryRepository.update(entry)
    //   result.updated.push(entry)
    // }


    return result
  }

  public inputToPayloadMap(entryInput: EntryInput): Entry {
    const entry = new Entry()
    entry.id = entryInput.idEntry
    console.log(entry.description)
    return entry
  }

}
