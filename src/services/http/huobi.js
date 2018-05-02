const request = require('request'),
    API = require('../../config/API-config'),
    config = require('../../config/default.json'),
    CryptoJS = require('crypto-js'),
    moment = require('moment'),
    HmacSHA256 = require('crypto-js/hmac-sha256')

    ;
/**
 *
 *
 * @param {any} method
 * @param {any} baseurl
 * @param {any} path
 * @param {any} data
 * @returns
 */
const sign_sha = (method, baseurl, path, data) => {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");
    var meta = [method, baseurl, path, p].join('\n');
    //console.log('meta',meta);
    var hash = HmacSHA256(meta, config.huobi.secretKey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
},
    get_body = () => {
        return {
            AccessKeyId: config.huobi.accessKey,
            SignatureMethod: "HmacSHA256",
            SignatureVersion: 2,
            Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
        };
    },
    get_auth = () => {
        var sign = config.huobi.trade_password + 'hello, moto';
        var md5 = CryptoJS.MD5(sign).toString().toLowerCase();
        let ret = encodeURIComponent(JSON.stringify({
            assetPwd: md5
        }));
        return ret;
    }
    ;

//请求类
class huobiHttpService {
    constructor() {

        this.getAccount = this.get.bind(this, API.HUO_BI.accounts);
        this.accountBalance = this.get.bind(this, API.HUO_BI.accountBalance);

        this.klineHistory = this.get.bind(this, API.HUO_BI.klineHistory);
        this.tradeHistory = this.get.bind(this, API.HUO_BI.tradeHistory);

        this.querySymbols = this.get.bind(this, API.HUO_BI.querySymbols);

        this.getOreders = this.get.bind(this, API.HUO_BI.orders);
        this.matchresults = this.get.bind(this, API.HUO_BI.matchresults);
        this.subOrder = this.post.bind(this, API.HUO_BI.subOrder);
    }

    // matchresults(orderId) {
    //     const url = orderId ? `${API.HUO_BI.orders}/${orderId}/matchresults` : `${API.HUO_BI.orders}/matchresults`;
    //     return new Promise((resolve, reject) => {
    //         this.get(url).then(resolve).catch(reject);
    //     });
    // }
    /**
     * @description 查询某个订单的成交明细
     * @param orderId 订单ID
     * @memberof huobiHttpService
     */
    orderInfo(orderId) {

    }

    get(url, params = {}) {
        let body = get_body();

        for (const key in params) {
            body[key] = params[key];
        }

        let payload = sign_sha('GET', `api.huobipro.com`, url, body),
            httpOptions = {
                url: `${API.HUO_BI_BASE}${url}?${payload}`,
                method: 'get',
                timeout: 3000,
                headers: {
                    'content-type': 'application/json;charset=utf-8',
                    'Accept-Language': 'zh-cn'
                },
                proxy: '',
                agentOptions: {
                    maxSockets: 256,
                }
            };

        return new Promise((resolve, reject) => {
            request(httpOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(res.statusCode);
                    }
                }
            }).on('error', console.error);
        });
    }

    post(url, params = {}) {
        let body = get_body(),
            payload = sign_sha('POST', `api.huobipro.com`, url, body);

        for (const key in params) {
            body[key] = params[key];
        }

        let httpOptions = {
            url: `${API.HUO_BI_BASE}${url}?${payload}`,
            method: 'post',
            body: JSON.stringify(body),
            timeout: 3000,
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

        return new Promise((resolve, reject) => {
            request(httpOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(res.statusCode);
                    }
                }
            }).on('error', console.error);
        });
    }

};

//导出一个对象
module.exports = new huobiHttpService();
