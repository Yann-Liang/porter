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
    HUO_BI_TRADE_BASE = `https://api.huobi.pro/v1`,//火币交易接口
    HUO_BI = {
        ws: `wss://api.huobipro.com/ws`,
        account: `/v1/account/accounts`,
    },
    HADAX = {
        ws: `wss://api.hadax.com/ws`,
        marketBase: `https://api.hadax.com/market`,
        tradeBase:`https://api.hadax.com/v1`,
        klineHistory: `${HADAX.marketBase}/market/history/kline`,//获取K线数据
        detail: `${HADAX.marketBase}/market/detail/merged`,//获取聚合行情(Ticker)
        depthMarket: `${HADAX.marketBase}/market/depth`,//获取 Market Depth 数据
        tradeMarket: `${HADAX.marketBase}/market/trade`,//获取 Trade Detail 数据
        tradeHistory: `${HADAX.marketBase}/market/history/trade`,//批量获取最近的交易记录
        marketDetail: `${HADAX.marketBase}/market/detail`,//获取 Market Detail 24小时成交量数据
        querySymbols: `${HADAX.tradeBase}/v1/hadax/common/symbols`,//查询HADAX站支持的所有交易对及精度
        queryCurrencys: `${HADAX.tradeBase}/v1/hadax/common/currencys`,//查询HADAX站支持的所有币种
        queryTimestamp: `${HADAX.tradeBase}/v1/common/timestamp`,//查询系统当前时间
        accounts: `${HADAX.tradeBase}/v1/account/accounts`,//查询当前用户的所有账户(即account-id)
        subOrder:`${HADAX.tradeBase}/v1/hadax/order/orders/place`,//HADAX站下单
    }


    ;

export default {
    USER,
    HUO_BI_BASE,
    HUO_BI_TRADE_BASE,
    HUO_BI,
    HADAX,
}
