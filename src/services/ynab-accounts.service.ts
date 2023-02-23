import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {AccountsApi, Configuration, IAccountResponse, IAccountsResponse, ISaveAccountWrapper} from '../ynab-api';

const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new AccountsApi(config)

@injectable({scope: BindingScope.TRANSIENT})
export class YnabAccountsService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
     * Returns all accounts
     * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
     * @param last_knowledge_of_server The starting server knowledge. If provided,
  only entities that have changed since `last_knowledge_of_server` will be
  included.
     * @returns The list of requested accounts
     */
  getAccounts(budget_id: string, last_knowledge_of_server: number | undefined): Promise<IAccountsResponse> {
    return ynabApi.getAccounts(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  getAccountByName(budget_id: string, account_name: string): Promise<IAccountResponse> {
    return ynabApi.getAccounts(budget_id, undefined).then(function (response) {
      return {data: {account: response.data.data.accounts.filter(acc => acc.name == account_name)[0]}}
    }).catch((error) => {
      return error?.response?.data
    })
  }



  /**
   * Creates a new account
   * @param budget_id The id of the budget ("last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget)
   * @param _requestBody The account to create.
   * @returns The account was successfully created
   */
  createAccount(budget_id: string, _requestBody: ISaveAccountWrapper): Promise<IAccountResponse> {
    return ynabApi.createAccount(budget_id, _requestBody).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single account
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param account_id The id of the account
   * @returns The requested account
   */
  getAccountById(budget_id: string, account_id: string): Promise<IAccountResponse> {
    return ynabApi.getAccountById(budget_id, account_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };
}
