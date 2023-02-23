import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Entry',
  connector: 'memory',
  localStorage: '',
  file: 'data/entry.database.json'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class EntryDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Entry';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Entry', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
