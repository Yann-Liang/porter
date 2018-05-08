const fetch = require('node-fetch'),
    API = require('../config/api/huobipro'),
    CryptoJS = require('crypto-js'),
    moment = require('moment'),
    { HmacSHA256, enc } = require('crypto-js')
    ;

const

    get_body = (accessKey) => {
        return {
            AccessKeyId: accessKey,
            SignatureMethod: "HmacSHA256",
            SignatureVersion: 2,
            Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
        };
    },
    get_auth = (trade_password) => {
        var sign = trade_password + 'hello, moto';
        var md5 = CryptoJS.MD5(sign).toString().toLowerCase();
        let ret = encodeURIComponent(JSON.stringify({
            assetPwd: md5
        }));
        return ret;
    }
    ;
;
module.exports = class Huobipro {
    constructor(options) {

        this.uid = '';
        this.accountId = '';
        this.tradePassword = '';
        this.accessKey = '';
        this.secretKey = '';
        // if (options) {
        //     if (options.accessKey) {
        //         accessKey = options.accessKey;
        //         delete options.accessKey;
        //     }

        //     if (options.secretKey) {
        //         secretKey = options.secretKey;
        //         delete options.secretKey;
        //     }

        // }
        Object.assign(this, options);
    }
    /**
     *
     * @description 获取交易量限制
     * @param {string} symbol:币种
     * @returns
     */
    async queryMaximin(symbol) {
        const url = `${API.BASE}/v1/common/exchange?symbol=${symbol}`;
        let result = null;
        try {
            result = await fetch(url).then(res => res.json());
        } catch (error) {
            console.error('queryMaximin Error:', error);
        }

        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null
        }

    }

    async getTicker(symbol) {
        let url = `${API.BASE}${API.URL.detail}?symbol=${symbol}`,
            result = await fetch(url).then(res => res.json());
        if (result.status === 'ok') {
            return {
                bid: result.tick.bid,
                ask: result.tick.ask,
            };
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL:url`);
            return null
        }

    }

    async getMarketDepth(symbol, depth = 'step0') {
        const url = `${API.BASE}${API.URL.depthMarket}?symbol=${symbol}&type=${depth}`;
        let result = null;
        try {
            result = await fetch(url).then(res => res.json());
        } catch (error) {
            console.error('getMarketDepth Error:', error);
            return null;
        }
        if (result.status === 'ok') {
            return {
                bids: result.tick.bids,
                asks: result.tick.asks,
            };
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL:url`);
            return null
        }
    }

    async getMarketTrade(symbol) {
        const url = `${API.BASE}${API.URL.tradeMarket}?symbol=${symbol}`;
        let result = null;
        try {
            result = await fetch(url).then(res => res.json());
        } catch (error) {
            console.error('getMarketTrade Error:', error);
            return null;
        }
        if (result.status === 'ok') {
            return result.tick.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL:url`);
            return null
        }
    }

    async tradeHistory(symbol, size = 1000) {
        const url = `${API.BASE}${API.URL.tradeHistory}?symbol=${symbol}&size=${size}`;
        let result = null;
        try {
            result = await fetch(url).then(res => res.json());
        } catch (error) {
            console.error('getMarketTrade Error:', error);
            return null;
        }
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL:url`);
            return null
        }
    }
    async querySymbols() {
        const url = `${API.BASE}${API.URL.querySymbols}`;
        let result = null;
        try {
            result = await fetch(url).then(res => res.json());
        } catch (error) {
            console.error('querySymbols Error:', error);
            return null
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null
        }
    }

    async getAccount() {
        const url = API.URL.accounts;
        let result = null;
        try {
            result = await this.get(url);
        } catch (error) {
            console.error('getAccount Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null
        }
    }

    async balances() {
        if (!this.accountId) {
            throw `accountId is empty!`;
        }
        const url = `${API.URL.accounts}/${this.accountId}/balance`;
        let result = null;
        try {
            result = await this.get(url);
        } catch (error) {
            console.error('balances Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data.list;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    async getOrder(orderId) {
        if (!this.accountId) {
            throw `accountId is empty!`;
        }
        const url = `${API.URL.accounts}/${this.accountId}/balance`;
        let result = null;
        try {
            result = await this.get(url);
        } catch (error) {
            console.error('balances Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data.list;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    /**
     *
     * @description 查询当前委托、历史委托
     * @param {any} params
     *  buy-market：市价买,
     *  sell-market：市价卖,
     *  buy-limit：限价买,
     *  sell-limit：限价卖,
     *  buy-ioc：IOC买单,
     *  sell-ioc：IOC卖单
     * @returns
     */
    async getOrders(params) {
        const url = API.URL.orders;
        let result = null;
        try {
            result = await this.get(url,params);
        } catch (error) {
            console.error('getOrders Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    /**
     *
     * @description 查询某个订单的成交明细
     * @param {object} params
     * @returns
     */
    async getMatchresult(orderId) {
        const url = `${API.URL.orders}/${orderId}/matchresults `;
        let result = null;
        try {
            result = await this.get(url);
        } catch (error) {
            console.error('getOrders Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    /**
     *
     * @description 查询当前成交、历史成交
     * @param {object} params
     * @returns
     */
    async getMatchresults(params) {
        const url = API.URL.matchresults;
        let result = null;
        try {
            result = await this.get(url,params);
        } catch (error) {
            console.error('getOrders Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    /**
     *
     * @description 现在是 现货账户
     * @param {any} price 下单价格，市价单不传该参数
     * @param {any} amount 限价单表示下单数量，市价买单时表示买多少钱，市价卖单时表示卖多少币
     * @param {any} symbol 交易对
     * @param {any} type 订单类型
     *  buy-market：市价买,
     *  sell-market：市价卖,
     *  buy-limit：限价买,
     *  sell-limit：限价卖,
     *  buy-ioc：IOC买单,
     *  sell-ioc：IOC卖单
     * @returns
     */
    async placeOrder(price, amount, symbol, type) {
        if (!this.accountId) {
            throw `accountId is empty!`;
        }
        let params = {
            amount, symbol, type,
            'account-id': this.accountId,
        }
        if (type == 'buy-market' || type == 'sell-market') {

        } else {
            params.price = price;
        }
        const url = API.URL.placeOrder;
        let result = null;
        try {
            result = await this.post(url, params);
        } catch (error) {
            console.error('balances Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data.list;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    async buy() {
        if (!this.accountId) {
            throw `accountId is empty!`;
        }
        const url = API.URL.placeOrder;
        let result = null;
        try {
            result = await this.get(url);
        } catch (error) {
            console.error('balances Error:', error);
            return null;
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data.list;
        } else {
            console.error(`Error Msg: ${result['err-msg']}, URL: ${url}`);
            return null;
        }
    }

    async sell() {

    }

    /**
     *
     *
     * @param {any} method
     * @param {any} baseurl
     * @param {any} path
     * @param {any} data
     * @returns
     */
    sign(method, baseurl, path, data) {
        var pars = [];
        for (let item in data) {
            pars.push(item + "=" + encodeURIComponent(data[item]));
        }
        var p = pars.sort().join("&");
        var meta = [method, baseurl, path, p].join('\n');
        //console.log('meta',meta);
        var hash = HmacSHA256(meta, this.secretKey);
        var Signature = encodeURIComponent(enc.Base64.stringify(hash));
        // console.log(`Signature: ${Signature}`);
        p += `&Signature=${Signature}`;
        // console.log(p);
        return p;
    }

    get(url, params = {}) {
        if (!this.accessKey) {
            throw "accessKey is empty!";
        }
        let body = get_body(this.accessKey);

        for (const key in params) {
            body[key] = params[key];
        }

        let
            payload = this.sign('GET', `api.huobipro.com`, url, body),
            httpOptions = {
                method: 'get',
                headers: {
                    'content-type': 'application/json;charset=utf-8',
                    'Accept-Language': 'zh-cn'
                },
                proxy: '',
                agentOptions: {
                    maxSockets: 256,
                }
            };
        return fetch(`${API.BASE}${url}?${payload}`, httpOptions).then(res => res.json());
    }

    post(url, params = {}) {
        if (!this.accessKey) {
            throw "accessKey is empty!";
        }
        let body = get_body(this.accessKey),
            payload = this.sign('POST', `api.huobipro.com`, url, body);

        // for (const key in params) {
        //     body[key] = params[key];
        // }
        Object.assign(body, params);

        let httpOptions = {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json;charset=utf-8',
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
                'Accept-Language': 'zh-cn',
                'AuthData': get_auth(),
            },
            proxy: '',
            agentOptions: {
                maxSockets: 256,
            }
        };
        return fetch(`${API.BASE}${url}?${payload}`, httpOptions).then(res => res.json());
    }

}