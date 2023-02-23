import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors, Request, Response} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {FileUploadHandler, FILE_UPLOAD_SERVICE} from '../keys';
const SANDBOX = path.resolve(__dirname, '../../.sandbox');


@injectable({scope: BindingScope.TRANSIENT})
export class FileReadService {
  constructor(@inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler) { }

  /*
   * Add service methods here
   */

  getSandboxPath() {
    return SANDBOX
  }

  async getContent(request: Request, response: Response): Promise<{file: any, data: string}> {
    const parsed = new Promise<{file: any, data: string}>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          //@ts-ignore
          const santanderFile = request?.files[0] ? request?.files[0] : {path: ''}
          this.validateFileName(santanderFile ? santanderFile.path : '')
          resolve({
            file: FileReadService.getFilesAndFields(request),
            data: fs.readFileSync(santanderFile.path).toString()
          });
        }
      });
    });
    return parsed
  }

  validateFileName(fileName: string) {
    const resolved = path.resolve(SANDBOX, fileName);
    if (resolved.startsWith(SANDBOX)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }
}
