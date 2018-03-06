import Http from 'axios'
import API from '@/config/API-config'

const config = require('@/config/key-config.json'),
    CryptoJS = require('crypto-js'),
    moment = require('moment'),
    HmacSHA256 = require('crypto-js/hmac-sha256')

    ;

const sign_sha=(method, baseurl, path, data)=> {
        var pars = [];
        for (let item in data) {
            pars.push(item + "=" + encodeURIComponent(data[item]));
        }
        var p = pars.sort().join("&");
        var meta = [method, baseurl, path, p].join('\n');
        // console.log(meta);
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
        this.getAaccount=this.get.bind(this,API.HADAX.accounts);
    }

    get(url, params = {}) {
        let body = get_body();
        for (const key in params) {
            body[key] = params[key];
        }
        let payload = sign_sha('GET', `api.hadax.com`, `/v1/account/accounts`, body);
        return Http.get(`${url}?${payload}`).then(res => res.data);
    }

    post(url, params = {}) {
        return Http.post(url, params).then(res => res.data);
    }

}

//导出一个对象
export default new huobiHttpService();
