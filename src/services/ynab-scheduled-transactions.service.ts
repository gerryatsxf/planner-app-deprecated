import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IScheduledTransactionResponse, IScheduledTransactionsResponse, ScheduledTransactionsApi} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new ScheduledTransactionsApi(config)
@injectable({scope: BindingScope.TRANSIENT})
export class YnabScheduledTransactionsService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * Returns all scheduled transactions
   * @param budget_id The id of the budget. "last-used" can be used to specify
the last used budget and "default" can be used if default budget selection
is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param last_knowledge_of_server The starting server knowledge. If provided,
only entities that have changed since `last_knowledge_of_server` will be
included.
   * @returns The list of requested scheduled transactions
   */
  getScheduledTransactions(budget_id: string, last_knowledge_of_server: number | undefined): Promise<IScheduledTransactionsResponse> {
    return ynabApi.getScheduledTransactions(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single scheduled transaction
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param scheduled_transaction_id The id of the scheduled transaction
   * @returns The requested Scheduled Transaction
   */
  getScheduledTransactionById(budget_id: string, scheduled_transaction_id: string): Promise<IScheduledTransactionResponse> {
    return ynabApi.getScheduledTransactionById(budget_id, scheduled_transaction_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

}
