//请求地址
const BASE = process.env.API_ROOT,
    USER_URL = `${BASE}/user/`,

    //用户
    USER = {
        register: `${USER_URL}register.do`,
        login: `${USER_URL}login.do`,
        getMenuList: `${USER_URL}getMenus.do`,
        logout: `${USER_URL}logout.do`,
    },
    HUO_BI_BASE = `https://api.huobi.pro/market`,//火币行情接口
    HUO_BI_TRADE_BASE =`https://api.huobi.pro/v1`,//火币交易接口
    HUO_BI = {

    }
//登录
export default {
    BASE: BASE,
    USER: USER,
}
