import {Model, model, property} from '@loopback/repository';

@model()
export class SantanderFileParseConfig extends Model {

  constructor(data?: Partial<SantanderFileParseConfig>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true,
  })
  fileAccountType: string;

  @property({
    type: 'string',
    required: true,
    default: "1970-01-01"
  })
  sinceDate: string = "1970-01-01";

  @property({
    type: 'string',
    required: true,
    default: "2100-12-31"
  })
  untilDate: string = "2100-12-31";

  @property({
    type: 'number',
    required: true,
    default: 5
  })
  hourOffset: number = 5;
}

export interface SantanderFileParseConfigRelations {
  // describe navigational properties here
}

export type SantanderFileParseConfigWithRelations = SantanderFileParseConfig & SantanderFileParseConfigRelations;
