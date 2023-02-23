import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Response} from '@loopback/rest';
import {FileReadService} from '.';

@injectable({scope: BindingScope.TRANSIENT})
export class FileDownloadService {
  constructor(
    @inject('services.FileReadService') private fileReadService: FileReadService,
  ) { }

  async fromSource(res: Response, filePath: string) {
    const file = this.fileReadService.validateFileName(filePath);
    res.download(file, filePath);
    return res;
  }
}
