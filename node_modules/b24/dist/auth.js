"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const qs = require("querystring");
class BitrixAuth {
    /**
     * Create Bitrix Authenticator
     * @param init Configuration Initializer
     */
    constructor(init) {
        this.init = init;
        this.authorization_uri = init.config.host + "/oauth/authorize?" + qs.stringify({
            client_id: init.config.client_id,
            response_type: "code",
            redirect_uri: init.config.redirect_uri
        });
    }
    /**
     * Get token from Bitrix
     * @param {string} code - Code that coming after authorizing user
     * @return {Promise} Token result object
     */
    getToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield request.get(this.init.config.host + "/oauth/token/?" + qs.stringify({
                client_id: this.init.config.client_id,
                grant_type: "authorization_code",
                client_secret: this.init.config.client_secret,
                redirect_uri: this.init.config.redirect_uri,
                code: code
            }));
            let parsed = JSON.parse(result);
            if (this.init.methods && this.init.methods.saveToken) {
                yield this.init.methods.saveToken(parsed);
            }
            return parsed;
        });
    }
    /**
     * Get new token
     * @param {string} token - Refresh token
     * @return {Promise} Token result object
     */
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!token) && (this.init.methods && this.init.methods.retriveToken)) {
                let retriveToken = yield this.init.methods.retriveToken();
                token = retriveToken.refresh_token;
            }
            else if (!token) {
                throw Error("Please provide token");
            }
            const url = this.init.config.host + "/oauth/token/?" + qs.stringify({
                client_id: this.init.config.client_id,
                grant_type: "refresh_token",
                client_secret: this.init.config.client_secret,
                redirect_uri: this.init.config.redirect_uri,
                refresh_token: token
            });
            const result = yield request.get(url);
            let parsed = JSON.parse(result);
            if (this.init.methods && this.init.methods.saveToken) {
                yield this.init.methods.saveToken(parsed);
            }
            return parsed;
        });
    }
}
exports.default = BitrixAuth;
