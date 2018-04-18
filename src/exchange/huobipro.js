const fetch = require('node-fetch'),
    API = require('../../config/api/huobipro')
    ;
module.exports = class Huobipro {
    constructor(options) {
        this.accessKey = '';
        this.secretKey = '';
        this.uid = '';
        this.accountId = '';
        this.tradePassword = '';

        Object.assign(this, options);
    }
    /**
     *
     * @description
     * @param {string} symbol
     * @returns
     */
    async queryMaximin(symbol) {
        const url = `${API.BASE}/v1/common/exchange?symbol=${symbol}`;
        let result = null;
        try {
            result = await fetch(url).then(response => response.json());
        } catch (error) {
            console.error('queryMaximin Error:', error);
        }

        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Code: ${result['err_msg']}, URL: ${url}`);
            return null
        }

    }

    async getTicker(symbol) {
        let url = `${API.BASE}${API.URL.detail}?symbol=${symbol}`,
            result = await fetch(url).then(response => response.json());
        if (result.status === 'ok') {
            return {
                bid: result.tick.bid,
                ask: result.tick.ask,
            };
        } else {
            console.error(`Error Code: ${result['err_msg']}, URL:url`);
            return null
        }

    }

    async getMarketDepth(symbol, depth = 'step0') {
        const url = `${API.BASE}${API.URL.depthMarket}?symbol=${symbol}&type=${depth}`;
        let result = null;
        try {
            result = await fetch(url).then(response => response.json());
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
            console.error(`Error Code: ${result['err_msg']}, URL:url`);
            return null
        }
    }
    async querySymbols() {
        const url = `${API.BASE}${API.URL.querySymbols}`;
        let result = null;
        try {
            result = await fetch(url).then(response => response.json());
        } catch (error) {
            console.error('querySymbols Error:', error);
            return null
        }
        console.log(result)
        if (result.status === 'ok') {
            return result.data;
        } else {
            console.error(`Error Code: ${result['err_msg']}, URL: ${url}`);
            return null
        }
    }



}