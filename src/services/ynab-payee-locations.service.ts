import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IPayeeLocationResponse, IPayeeLocationsResponse, PayeeLocationsApi} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new PayeeLocationsApi(config)
@injectable({scope: BindingScope.TRANSIENT})
export class YnabPayeeLocationsService {
  constructor(/* Add @inject to inject parameters */) { }


  /**
    * Returns all payee locations
    * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
    * @returns The list of payee locations
    */
  getPayeeLocations(budget_id: string): Promise<IPayeeLocationsResponse> {
    return ynabApi.getPayeeLocations(budget_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single payee location
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param payee_location_id id of payee location
   * @returns The payee location
   */
  getPayeeLocationById(budget_id: string, payee_location_id: string): Promise<IPayeeLocationResponse> {
    return ynabApi.getPayeeLocationById(budget_id, payee_location_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns all payee locations for a specified payee
   * @param budget_id The id of the budget. "last-used" can be used to specify
  the last used budget and "default" can be used if default budget selection
  is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param payee_id id of payee
   * @returns The list of requested payee locations
   */
  getPayeeLocationsByPayee(budget_id: string, payee_id: string): Promise<IPayeeLocationsResponse> {
    return ynabApi.getPayeeLocationsByPayee(budget_id, payee_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };
}
