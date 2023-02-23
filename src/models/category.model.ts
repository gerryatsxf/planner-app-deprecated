import {Model, model, property} from '@loopback/repository';
import {ICategoryGoalTypeEnum} from '../ynab-api';

@model()
export class Category extends Model {

  constructor(data?: Partial<Category>) {
    super(data);
  }


  @property({
    type: 'string',
    required: true
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  category_group_id: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
    required: true
  })
  hidden: boolean;

  @property({
    type: 'string',
    required: false
  })
  original_category_group_id?: string;

  @property({
    type: 'string',
    required: false
  })
  note?: string;

  @property({
    type: 'number',
    required: true
  })
  budgeted: number;

  @property({
    type: 'number',
    required: true
  })
  activity: number;

  @property({
    type: 'number',
    required: true
  })
  balance: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(ICategoryGoalTypeEnum),
    }
  })
  goal_type?: ICategoryGoalTypeEnum;

  @property({
    type: 'string',
    required: false
  })
  goal_creation_month?: string;

  @property({
    type: 'number',
    required: false
  })
  goal_target?: number;

  @property({
    type: 'string',
    required: false
  })
  goal_target_month?: string;

  @property({
    type: 'number',
    required: false
  })
  goal_percentage_complete?: number;

  @property({
    type: 'number',
    required: false
  })
  goal_months_to_budget?: number;

  @property({
    type: 'number',
    required: false
  })
  goal_under_funded?: number;

  @property({
    type: 'number',
    required: false
  })
  goal_overall_funded?: number;

  @property({
    type: 'number',
    required: false
  })
  goal_overall_left?: number;

  @property({
    type: 'boolean',
    required: true
  })
  deleted: boolean;
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
