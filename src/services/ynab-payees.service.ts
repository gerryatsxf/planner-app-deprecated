import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IPayeeResponse, IPayeesResponse, PayeesApi} from '../ynab-api';

const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new PayeesApi(config)

@injectable({scope: BindingScope.TRANSIENT})
export class YnabPayeesService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * Returns all payees
   * @param budget_id The id of the budget. "last-used" can be used to specify
the last used budget and "default" can be used if default budget selection
is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param last_knowledge_of_server The starting server knowledge. If provided,
only entities that have changed since `last_knowledge_of_server` will be
included.
   * @returns The requested list of payees
   */
  getPayees(budget_id: string, last_knowledge_of_server: number | undefined): Promise<IPayeesResponse> {
    return ynabApi.getPayees(budget_id, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single payee
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param payee_id The id of the payee
   * @returns The requested payee
   */
  getPayeeById(budget_id: string, payee_id: string): Promise<IPayeeResponse> {
    return ynabApi.getPayeeById(budget_id, payee_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

}
