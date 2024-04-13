class IDBOpenDBRequestError extends Error {
  constructor() {
    super('Error opening IndexedDB database');
  }
}
class IDBRequestError extends Error {
  constructor() {
    super('Error with IndexedDB request');
  }
}
class IDBTransactionError extends Error {
  constructor() {
    super('Error with IndexedDB transaction');
  }
}
class IDBTransactionAbortError extends Error {
  constructor() {
    super('Aborted IndexedDB transaction');
  }
}

class AsyncIDB {
  /**
   * Makes an open db request async/awaitable.
   * @param {IDBOpenDBRequest} openDbRequest 
   * @param {(db: IDBDatabase) => void | Promise<void>} upgradeNeededCb 
   * @returns {Promise<IDBDatabase>}
   */
  static processOpenDb(openDbRequest, upgradeNeededCb = ()=>{}) {
    return new Promise((resolve, reject) => {
      openDbRequest.onsuccess = () => resolve(openDbRequest.result);
      openDbRequest.onerror = () => reject(new IDBOpenDBRequestError());
      openDbRequest.onupgradeneeded = async () => await upgradeNeededCb(openDbRequest.result);
    });
  }

  /**
   * Makes a regular request async/awaitable.
   * @param {IDBRequest} request
   */
  static processRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new IDBRequestError());
    });
  }

  /**
   * Makes calls to a transaction async/awaitable.
   * @param {IDBTransaction} transaction 
   * @param {(transaction: IDBTransaction) => void | Promise<void>} callback 
   * @returns {Promise<void>}
   */
  static processTransaction(transaction, callback) {
    return new Promise(async (resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new IDBTransactionError());
      transaction.onabort = () => reject(new IDBTransactionAbortError());
      await callback(transaction);
    });
  }
}
