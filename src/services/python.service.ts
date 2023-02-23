import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ScriptResult} from '../models';
const spawn = require('child_process');
const path = require('path')

@injectable({scope: BindingScope.TRANSIENT})
export class PythonService {
  constructor(/* Add @inject to inject parameters */) { }

  runScript(scriptName: string, params: any[]): ScriptResult {

    const pythonResponse: ScriptResult = new ScriptResult
    pythonResponse.success = false;

    try {
      console.log('PYTHON SCRIPT ABOUT TO START')
      const scriptParams = ['-u', path.join(__dirname, `../../src/script/${scriptName}.py`), JSON.stringify(params)]
      const subprocess = spawn.spawnSync('python3', scriptParams);
      if (subprocess.stderr.toString().length !== 0) {
        throw Error(subprocess.stderr)
      }
      pythonResponse.result = JSON.parse(subprocess.stdout.toString())
      pythonResponse.success = true
      console.log('SCRIPT SUCCESSFULLY RUN')
    } catch (e) {
      console.log(e)
    }

    return pythonResponse

  }
}
