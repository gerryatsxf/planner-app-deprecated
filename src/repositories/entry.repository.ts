import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {EntryDataSource} from '../datasources';
import {Entry, EntryRelations} from '../models';

export class EntryRepository extends DefaultCrudRepository<
  Entry,
  typeof Entry.prototype.id,
  EntryRelations
> {
  constructor(
    @inject('datasources.Entry') dataSource: EntryDataSource,
  ) {
    super(Entry, dataSource);
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.dateUpdated = new Date();
    });
  }
}
