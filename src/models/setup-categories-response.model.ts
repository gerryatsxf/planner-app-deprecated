import {Model, model, property} from '@loopback/repository';

@model()
export class SetupCategoriesResponse extends Model {

  constructor(data?: Partial<SetupCategoriesResponse>) {
    super(data);
  }
}

export interface SetupCategoriesResponseRelations {
  // describe navigational properties here
}

export type SetupCategoriesResponseWithRelations = SetupCategoriesResponse & SetupCategoriesResponseRelations;
