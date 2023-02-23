import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {PythonService} from '.';
import {EntryInput} from '../models/entry-input.model';
import {ParseEntriesFileResult} from '../models/parse-entries-file-result.model';

@injectable({scope: BindingScope.TRANSIENT})
export class ParserService {
  constructor(
    @inject('services.PythonService') private pythonService: PythonService,
  ) { }


  parseEntriesFile(filePath: string): ParseEntriesFileResult {
    const scriptResponse = this.pythonService.runScript('parse-entries', [filePath])
    const entriesInput: EntryInput[] = []
    let categoryLabels: string[] = []
    if (scriptResponse.success) {
      const rawEntriesInput = scriptResponse.result.entries
      // categoryLabels = scriptResponse.result.categories
      rawEntriesInput.forEach((rawEntry: any) => {
        const entry = new EntryInput()
        entry.idEntry = rawEntry.idEntry
        entry.modify = rawEntry.modify
        entry.datePlanned = rawEntry.datePlanned
        entry.description = rawEntry.description
        entry.inflow = rawEntry.inflow
        entry.outflow = rawEntry.outflow
        entry.category = rawEntry.category
        entriesInput.push(entry)
      })
    }
    const result = new ParseEntriesFileResult()
    result.entries = entriesInput
    return result
  }
}
