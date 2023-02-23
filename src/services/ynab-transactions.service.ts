import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuration, IHybridTransactionsResponse, ISaveTransactionsResponse, ISaveTransactionsResponseData, ISaveTransactionsWrapper, ISaveTransactionWrapper, ITransactionResponse, ITransactionsImportResponse, ITransactionsResponse, IUpdateTransactionsWrapper, TransactionsApi} from '../ynab-api';
const config = new Configuration()
require('dotenv').config();
config.apiKey = 'Bearer ' + process.env.YNAB_API_TOKEN
const ynabApi = new TransactionsApi(config)
@injectable({scope: BindingScope.TRANSIENT})
export class YnabTransactionsService {
  constructor(/* Add @inject to inject parameters */) { }
  /**
   * Returns budget transactions
   * @param budget_id The id of the budget. "last-used" can be used to specify
the last used budget and "default" can be used if default budget selection
is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param since_date If specified, only transactions on or after this date will
be included. The date should be ISO formatted (e.g. 2016-12-30).
   * @param type If specified, only transactions of the specified type will be
included. "uncategorized" and "unapproved" are currently supported.
   * @param last_knowledge_of_server The starting server knowledge. If provided,
only entities that have changed since `last_knowledge_of_server` will be
included.
   * @returns The list of requested transactions
   */
  getTransactions(budget_id: string, since_date: string | undefined, type: 'uncategorized' | 'unapproved' | undefined, last_knowledge_of_server: number | undefined): Promise<ITransactionsResponse> {
    return ynabApi.getTransactions(budget_id, since_date, type, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Creates a single transaction or multiple transactions. If you provide a body
 containing a `transaction` object, a single transaction will be created and
 if you provide a body containing a `transactions` array, multiple
 transactions will be created. Scheduled transactions cannot be created on
 this endpoint.
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param _requestBody The transaction or transactions to create. To create a
 single transaction you can specify a value for the `transaction` object and
 to create multiple transactions you can specify an array of `transactions`.
 It is expected that you will only provide a value for one of these objects.
   * @returns The transaction or transactions were successfully created
   */
  createTransaction(budget_id: string, _requestBody: ISaveTransactionsWrapper): Promise<ISaveTransactionsResponse> {
    return ynabApi.createTransaction(budget_id, _requestBody).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Updates multiple transactions, by `id` or `import_id`.
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param _requestBody The transactions to update. Each transaction must have
 either an `id` or `import_id` specified. If `id` is specified as null an
 `import_id` value can be provided which will allow transaction(s) to be
 updated by their `import_id`. If an `id` is specified, it will always be
 used for lookup.
   */
  updateTransactions(budget_id: string, _requestBody: IUpdateTransactionsWrapper): Promise<ISaveTransactionsResponseData> {
    return ynabApi.updateTransactions(budget_id, _requestBody).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Imports available transactions on all linked accounts for the given budget.
 Linked accounts allow transactions to be imported directly from a specified
 financial institution and this endpoint initiates that import. Sending a
 request to this endpoint is the equivalent of clicking "Import" on each
 account in the web application or tapping the "New Transactions" banner in
 the mobile applications. The response for this endpoint contains the
 transaction ids that have been imported.
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @returns The request was successful but there were no transactions to import
   */
  importTransactions(budget_id: string): Promise<ITransactionsImportResponse> {
    return ynabApi.importTransactions(budget_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns a single transaction
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param transaction_id The id of the transaction
   * @returns The requested transaction
   */
  getTransactionById(budget_id: string, transaction_id: string): Promise<ITransactionResponse> {
    return ynabApi.getTransactionById(budget_id, transaction_id).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Updates a single transaction
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param transaction_id The id of the transaction
   * @param _requestBody The transaction to update
   * @returns The transaction was successfully updated
   */
  updateTransaction(budget_id: string, transaction_id: string, _requestBody: ISaveTransactionWrapper): Promise<ITransactionResponse> {
    return ynabApi.updateTransaction(budget_id, transaction_id, _requestBody).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns all transactions for a specified account
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param account_id The id of the account
   * @param since_date If specified, only transactions on or after this date will
 be included. The date should be ISO formatted (e.g. 2016-12-30).
   * @param type If specified, only transactions of the specified type will be
 included. "uncategorized" and "unapproved" are currently supported.
   * @param last_knowledge_of_server The starting server knowledge. If provided,
 only entities that have changed since `last_knowledge_of_server` will be
 included.
   * @returns The list of requested transactions
   */
  getTransactionsByAccount(budget_id: string, account_id: string, since_date: string | undefined, type: 'uncategorized' | 'unapproved' | undefined, last_knowledge_of_server: number | undefined): Promise<ITransactionsResponse> {
    return ynabApi.getTransactionsByAccount(budget_id, account_id, since_date, type).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns all transactions for a specified category
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param category_id The id of the category
   * @param since_date If specified, only transactions on or after this date will
 be included. The date should be ISO formatted (e.g. 2016-12-30).
   * @param type If specified, only transactions of the specified type will be
 included. "uncategorized" and "unapproved" are currently supported.
   * @param last_knowledge_of_server The starting server knowledge. If provided,
 only entities that have changed since `last_knowledge_of_server` will be
 included.
   * @returns The list of requested transactions
   */
  getTransactionsByCategory(budget_id: string, category_id: string, since_date: string | undefined, type: 'uncategorized' | 'unapproved' | undefined, last_knowledge_of_server: number | undefined): Promise<IHybridTransactionsResponse> {
    return ynabApi.getTransactionsByCategory(budget_id, category_id, since_date, type, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

  /**
   * Returns all transactions for a specified payee
   * @param budget_id The id of the budget. "last-used" can be used to specify
 the last used budget and "default" can be used if default budget selection
 is enabled (see: https://api.youneedabudget.com/#oauth-default-budget).
   * @param payee_id The id of the payee
   * @param since_date If specified, only transactions on or after this date will
 be included. The date should be ISO formatted (e.g. 2016-12-30).
   * @param type If specified, only transactions of the specified type will be
 included. "uncategorized" and "unapproved" are currently supported.
   * @param last_knowledge_of_server The starting server knowledge. If provided,
 only entities that have changed since `last_knowledge_of_server` will be
 included.
   * @returns The list of requested transactions
   */
  getTransactionsByPayee(budget_id: string, payee_id: string, since_date: string | undefined, type: 'uncategorized' | 'unapproved' | undefined, last_knowledge_of_server: number | undefined): Promise<IHybridTransactionsResponse> {
    return ynabApi.getTransactionsByCategory(budget_id, payee_id, since_date, type, last_knowledge_of_server).then(function (response) {
      return response.data
    }).catch((error) => {
      return error?.response?.data
    })
  };

}
