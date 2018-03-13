import Http from 'axios'
import API from '@/config/API-config'

const config = require('@/config/key-config.json'),
    CryptoJS = require('crypto-js'),
    moment = require('moment'),
    HmacSHA256 = require('crypto-js/hmac-sha256')

    ;
const interceptorsOfReq = () => {
    return Http.interceptors.request.use(
        config => {
            console.log('请求URL== ' + config.url, '\n请求参数==', config.data);
            return config;
        },
        err => {
            return Promise.reject(err);
        });
},
    interceptorsOfRes = () => {
        Http.interceptors.response.use(function (response) {
            console.log(response.config.url + '的响应数据↓↓↓\n', response.data);
            if (response.data.errorCode == 4) {
                localStorage.removeItem('sessionid');
                localStorage.removeItem('user');
                vueVm.loginPopFlag = true;
            }

            if (typeof response.data.data == null) {
                console.log('没有查询到数据')
            };

            return response;
        }, function (error) {
            console.log("请求失败");
            return Promise.reject(error);
        });
    },
    sign_sha=(method, baseurl, path, data)=> {
        var pars = [];
        for (let item in data) {
            pars.push(item + "=" + encodeURIComponent(data[item]));
        }
        var p = pars.sort().join("&");
        var meta = [method, baseurl, path, p].join('\n');
        //console.log('meta',meta);
        var hash = HmacSHA256(meta, config.huobi.secretkey);
        var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
        // console.log(`Signature: ${Signature}`);
        p += `&Signature=${Signature}`;
        // console.log(p);
        return p;
    },
    get_body=()=> {
        return {
            AccessKeyId: config.huobi.access_key,
            SignatureMethod: "HmacSHA256",
            SignatureVersion: 2,
            Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
        };
    }
    ;
Http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'//"application/json;charset=utf-8";
Http.defaults.headers.post["User-Agent"] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36";

//请求类
class huobiHttpService {
    constructor() {

        this.getAccount = this.get.bind(this, API.HUO_BI.accounts);
        this.klineHistory = this.get.bind(this, API.HUO_BI.klineHistory);
        this.tradeHistory = this.get.bind(this, API.HUO_BI.tradeHistory);
        this.accountBalance = this.get.bind(this, API.HUO_BI.accountBalance);
        this.querySymbols = this.get.bind(this, API.HUO_BI.querySymbols);
        // interceptorsOfReq();
        // interceptorsOfRes();
    }

    get(url, params = {}) {
        let body = get_body();
        for (const key in params) {
            body[key] = params[key];
        }
        let payload = sign_sha('GET', `api.huobipro.com`, url, body);
        return Http.get(`${API.HUO_BI_BASE}${url}?${payload}`).then(res => res.data);
    }

    post(url, params = {}) {
        return Http.post(url, params).then(res => res.data);
    }
};

//导出一个对象
export default new huobiHttpService();
