import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {CategoriesApi, Configuration, ICategoriesResponse, ICategoryResponse, ISaveCategoryResponse, ISaveMonthCategoryWrapper} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new CategoriesApi(config)
@injectable({scope: BindingScope.TRANSIENT})
export class YnabCategoriesService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * Returns all categories grouped by category group. Amounts (budgeted,
activity, balance, etc.) are specific to the current budget month (UTC).
   * @param budget_id The id of the budget. "last-used" can be used to specify
the last used budget and "default" can be used if default budget selection
is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param last_knowledge_of_server The starting server knowledge. If provided,
only entities that have changed since `last_knowledge_of_server` will be
included.
   * @returns The categories grouped by category group
   */
  getCategories(budget_id: string, last_knowledge_of_server: number | undefined): Promise<ICategoriesResponse> {
    return ynabApi.getCategories(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single category. Amounts (budgeted, activity, balance, etc.) are
 specific to the current budget month (UTC).
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param category_id The id of the category
   * @returns The requested category
   */
  getCategoryById(budget_id: string, category_id: string): Promise<ICategoryResponse> {
    return ynabApi.getCategoryById(budget_id, category_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single category for a specific budget month. Amounts (budgeted,
 activity, balance, etc.) are specific to the current budget month (UTC).
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param month The budget month in ISO format (e.g. 2016-12-01) ("current" can
 also be used to specify the current calendar month (UTC))
   * @param category_id The id of the category
   * @returns The requested month category
   */
  getMonthCategoryById(budget_id: string, month: string, category_id: string): Promise<ICategoryResponse> {
    return ynabApi.getMonthCategoryById(budget_id, month, category_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Update a category for a specific month. Only `budgeted` amount can be
 updated.
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param month The budget month in ISO format (e.g. 2016-12-01) ("current" can
 also be used to specify the current calendar month (UTC))
   * @param category_id The id of the category
   * @param _requestBody The category to update. Only `budgeted` amount can be
 updated and any other fields specified will be ignored.
   * @returns The month category was successfully updated
   */
  updateMonthCategory(budget_id: string, month: string, category_id: string, _requestBody: ISaveMonthCategoryWrapper): Promise<ISaveCategoryResponse> {
    return ynabApi.updateMonthCategory(budget_id, month, category_id, _requestBody).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

}
