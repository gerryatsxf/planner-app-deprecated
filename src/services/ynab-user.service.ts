import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IUserResponse, UserApi} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new UserApi(config)
@injectable({scope: BindingScope.TRANSIENT})
export class YnabUserService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * Returns authenticated user information
   * @returns The user info
   */
  getUser(): Promise<IUserResponse> {
    return ynabApi.getUser().then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };
}
