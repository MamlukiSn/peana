import Config from './config';
export default class BitrixAuth {
    private init;
    authorization_uri: string;
    /**
     * Create Bitrix Authenticator
     * @param init Configuration Initializer
     */
    constructor(init: Config);
    /**
     * Get token from Bitrix
     * @param {string} code - Code that coming after authorizing user
     * @return {Promise} Token result object
     */
    getToken(code: string): Promise<any>;
    /**
     * Get new token
     * @param {string} token - Refresh token
     * @return {Promise} Token result object
     */
    refreshToken(token?: string): Promise<any>;
}
