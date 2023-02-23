import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {PythonService} from '.';
import {EntriesFileParseConfig} from '../models/entries-file-parse-config.model';
import {EntryInput} from '../models/entry-input.model';
import {ParseEntriesFileResult} from '../models/parse-entries-file-result.model';
import {ParserService} from './parser.service';

@injectable({scope: BindingScope.TRANSIENT})
export class EntriesFileService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
    @inject('services.ParserService') private parserService: ParserService,

  ) { }

  asInput(filePath: string, parseConfig: EntriesFileParseConfig): EntryInput[] {
    const parseResult: ParseEntriesFileResult = this.parserService.parseEntriesFile(filePath)
    return parseResult.entries
  }
}
