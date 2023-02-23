import {Entity, model, property} from '@loopback/repository';

@model()
export class Entry extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false
  })
  id?: string;

  @property({
    type: 'date',
    required: false,
    default: () => new Date()
  })
  dateCreated?: Date;

  @property({
    type: 'date',
    required: false,
  })
  dateUpdated?: Date;

  @property({
    type: 'date',
    required: true,
  })
  datePlanned: Date;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  inflow: number;

  @property({
    type: 'number',
    required: true,
  })
  outflow: number;

  @property({
    type: 'string',
    required: true,
  })
  idCategory: string;

  @property({
    type: 'string',
    required: false,
  })
  category: string;

  @property({
    type: 'boolean',
    required: true,
  })
  linked: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isParent: boolean;

  @property({
    type: 'string',
    required: false,
  })
  parentIdEntry?: string;

  constructor(data?: Partial<Entry>) {
    super(data);
  }
}

export interface EntryRelations {
  // describe navigational properties here
}

export type EntryWithRelations = Entry & EntryRelations;
