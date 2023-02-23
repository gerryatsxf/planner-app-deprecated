import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ConfigServiceCache} from '../models/config-service-cache.model';
import {defaultCategoryContainsConfig} from './config';
var fs = require('fs');

@injectable({scope: BindingScope.TRANSIENT})
export class ConfigService {
  constructor(


  ) {
    this.cache = new ConfigServiceCache()
    this.cache.categoryContainsConfig = defaultCategoryContainsConfig

  }

  cache: ConfigServiceCache;
  /*
   * Add service methods here
   */

  async getCategoryContainsConfig(): Promise<any> {
    const config = await import("./config/category-contains.config").then(function (config) {
      return config.default
    });
    return config
  }


}
