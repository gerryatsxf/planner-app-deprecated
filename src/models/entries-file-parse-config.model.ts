import {Model, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model()
export class EntriesFileParseConfig extends Model {

  constructor(data?: Partial<EntriesFileParseConfig>) {
    super(data);
  }

  @property.array(Category)
  categories: Category[]

  // @property({
  //   type: 'string',
  //   required: true
  // })
  // filePath: string;
}

export interface EntriesFileParseConfigRelations {
  // describe navigational properties here
}

export type EntriesFileParseConfigWithRelations = EntriesFileParseConfig & EntriesFileParseConfigRelations;
