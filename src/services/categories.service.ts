import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {YnabCategoriesService} from '.';
import {Category} from '../models/category.model';
import {ICategoryGroupWithCategories} from '../ynab-api';

@injectable({scope: BindingScope.TRANSIENT})
export class CategoriesService {
  constructor(
    @inject('services.YnabCategoriesService') private ynabCategoriesService: YnabCategoriesService,

  ) { }

  async fetchCategories(budgetId: string): Promise<Category[]> {
    const categories: Category[] = [];
    await this.ynabCategoriesService.getCategories(budgetId, undefined)
      .then(response => response.data.category_groups)
      .then(groups => groups.forEach((group: ICategoryGroupWithCategories) => {categories.push(...group.categories as any)}));
    return categories
  }
}
