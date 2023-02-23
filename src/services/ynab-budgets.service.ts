import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {BudgetsApi, Configuration, IBudgetDetailResponse, IBudgetSettingsResponse, IBudgetSummaryResponse} from '../ynab-api';

const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new BudgetsApi(config)

@injectable({scope: BindingScope.TRANSIENT})
export class YnabBudgetsService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
     * Returns budgets list with summary information
     * @param include_accounts Whether to include the list of budget accounts
     * @returns The list of budgets
     */
  getBudgets(include_accounts: boolean | undefined): Promise<IBudgetSummaryResponse> {
    return ynabApi.getBudgets(include_accounts).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single budget with all related entities. This resource is
 effectively a full budget export.
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param last_knowledge_of_server The starting server knowledge. If provided,
 only entities that have changed since `last_knowledge_of_server` will be
 included.
   * @returns The requested budget
   */
  getBudgetById(budget_id: string, last_knowledge_of_server: number | undefined): Promise<IBudgetDetailResponse> {
    return ynabApi.getBudgetById(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns settings for a budget
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @returns The requested budget settings
   */
  getBudgetSettingsById(budget_id: string): Promise<IBudgetSettingsResponse> {
    return ynabApi.getBudgetSettingsById(budget_id).then(function (response) {
      console.log(response.data)
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };
}
