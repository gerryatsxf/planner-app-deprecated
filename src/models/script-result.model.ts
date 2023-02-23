import {Model, model, property} from '@loopback/repository';

@model()
export class ScriptResult extends Model {

  constructor(data?: Partial<ScriptResult>) {
    super(data);
  }

  @property({
    required: false,
  })
  result?: any;

  @property({
    type: 'boolean',
    required: true,
  })
  success: boolean;

}

export interface ScriptResultRelations {
  // describe navigational properties here
}

export type ScriptResultWithRelations = ScriptResult & ScriptResultRelations;
