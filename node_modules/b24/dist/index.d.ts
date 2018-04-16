import Config from './config';
import BitrixAuth from './auth';
export declare class Bitrix24 {
    private init;
    auth: BitrixAuth;
    /**
     * Create Bitrix Client
     * @param init Configuration Initializer
     */
    constructor(init: Config);
    /**
     * Call Bitrix rest API
     * @param {string} method - Method that will be called
     * @param {Object} param - Parameter and field that will send to API
     * @return {Promise} Return as object
     */
    callMethod(method: string, param?: any): Promise<any>;
}
