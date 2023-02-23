import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IMonthDetailResponse, IMonthSummariesResponse, MonthsApi} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new MonthsApi(config)

@injectable({scope: BindingScope.TRANSIENT})
export class YnabMonthsService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * Returns all budget months
   * @param budget_id The id of the budget. "last-used" can be used to specify
the last used budget and "default" can be used if default budget selection
is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param last_knowledge_of_server The starting server knowledge. If provided,
only entities that have changed since `last_knowledge_of_server` will be
included.
   * @returns The list of budget months
   */
  getBudgetMonths(budget_id: string, last_knowledge_of_server: number | undefined): Promise<IMonthSummariesResponse> {
    return ynabApi.getBudgetMonths(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single budget month
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param month The budget month in ISO format (e.g. 2016-12-01) ("current" can
  also be used to specify the current calendar month (UTC))
   * @returns The budget month detail
   */
  getBudgetMonth(budget_id: string, month: string): Promise<IMonthDetailResponse> {
    return ynabApi.getBudgetMonth(budget_id, month).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

}
