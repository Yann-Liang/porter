import Http from 'axios'
import API from '@/config/API-config'

Http.defaults.headers.post['Content-Type'] = "application/json;charset=utf-8";

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
    }
;
function sign_sha(method, baseurl, path, data) {
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
}

function get_body() {
    return {
        AccessKeyId: config.huobi.access_key,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}

//请求类
class huobiHttpService {
    constructor() {

        //this.getAaccount=this.get.bind(this,API.HUO_BI.account);
        interceptorsOfReq();
        interceptorsOfRes();
    }

    get(url, params) {
        var body = get_body();
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body);
        return call_api('GET', path, payload, body);
        return Http.get(url).then(res => res.data);
    }

    post(url, params) {
        typeof params === 'undefined' ? params = {} : '';
        localStorage.sessionid ? params.sessionid = localStorage.sessionid : '';
        params.userID = localStorage.user ? JSON.parse(localStorage.user).userID : '';;
        return Http.post(url, params).then(res => res.data);
    }

}

//导出一个对象
export default new huobiHttpService();
