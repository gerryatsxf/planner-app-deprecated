import {Model, model, property} from '@loopback/repository';

@model()
export class ConfigServiceCache extends Model {

  constructor(data?: Partial<ConfigServiceCache>) {
    super(data);
  }

  @property({
    required: true,
    type: 'object'
  })
  categoryContainsConfig: any
}

export interface ConfigServiceCacheRelations {
  // describe navigational properties here
}

export type ConfigServiceCacheWithRelations = ConfigServiceCache & ConfigServiceCacheRelations;
