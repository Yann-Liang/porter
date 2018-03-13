const config = require('@/config/key-config.json');

//请求地址
const BASE = process.env.API_ROOT,

    HUO_BI_BASE = `https://api.huobipro.com`,//火币行情接口
    // HUO_BI = {
    //     ws: `wss://api.huobipro.com/ws`,
    //     klineHistory: `${HUO_BI_BASE}/market/history/kline`,//获取K线数据
    //     detail: `${HUO_BI_BASE}/market/detail/merged`,//获取聚合行情(Ticker)
    //     depthMarket: `${HUO_BI_BASE}/market/depth`,//获取 Market Depth 数据
    //     tradeMarket: `${HUO_BI_BASE}/market/trade`,//获取 Trade Detail 数据
    //     tradeHistory: `${HUO_BI_BASE}/market/history/trade`,//批量获取最近的交易记录
    //     marketDetail: `${HUO_BI_BASE}/market/detail`,//获取 Market Detail 24小时成交量数据
    //     querySymbols: `${HUO_BI_BASE}/v1/common/symbols`,//查询Pro站支持的所有交易对及精度
    //     queryCurrencys: `${HUO_BI_BASE}/v1/common/currencys`,//查询Pro站支持的所有币种
    //     queryTimestamp: `${HUO_BI_BASE}/v1/common/timestamp`,//查询系统当前时间
    //     accounts: `${HUO_BI_BASE}/v1/account/accounts`,//查询当前用户的所有账户(即account-id)
    //     accountBalance:`${HUO_BI_BASE}/v1/account/accounts/${config.huobi.account_id}/balance`,/// 查询Pro站指定账户的余额
    //     subOrder:`${HUO_BI_BASE}/v1/order/orders/place`,//Pro站下单
    // },
    HUO_BI = {
        ws: `wss://api.huobipro.com/ws`,
        klineHistory: `/market/history/kline`,//获取K线数据
        detail: `/market/detail/merged`,//获取聚合行情(Ticker)
        depthMarket: `/market/depth`,//获取 Market Depth 数据
        tradeMarket: `/market/trade`,//获取 Trade Detail 数据
        tradeHistory: `/market/history/trade`,//批量获取最近的交易记录
        marketDetail: `/market/detail`,//获取 Market Detail 24小时成交量数据
        querySymbols: `/v1/common/symbols`,//查询Pro站支持的所有交易对及精度
        queryCurrencys: `/v1/common/currencys`,//查询Pro站支持的所有币种
        queryTimestamp: `/v1/common/timestamp`,//查询系统当前时间
        accounts: `/v1/account/accounts`,//查询当前用户的所有账户(即account-id)
        accountBalance:`/v1/account/accounts/${config.huobi.account_id}/balance`,/// 查询Pro站指定账户的余额
        subOrder:`/v1/order/orders/place`,//Pro站下单
    },
    HADAX_BASE = `https://api.hadax.com`,
    HADAX = {
        ws: `wss://api.hadax.com/ws`,
        marketBase: `https://api.hadax.com/market`,
        tradeBase:`https://api.hadax.com/v1`,
        klineHistory: `${HADAX_BASE}/market/history/kline`,//获取K线数据
        detail: `${HADAX_BASE}/market/detail/merged`,//获取聚合行情(Ticker)
        depthMarket: `${HADAX_BASE}/market/depth`,//获取 Market Depth 数据
        tradeMarket: `${HADAX_BASE}/market/trade`,//获取 Trade Detail 数据
        tradeHistory: `${HADAX_BASE}/market/history/trade`,//批量获取最近的交易记录
        marketDetail: `${HADAX_BASE}/market/detail`,//获取 Market Detail 24小时成交量数据
        querySymbols: `${HADAX_BASE}/v1/hadax/common/symbols`,//查询HADAX站支持的所有交易对及精度
        queryCurrencys: `${HADAX_BASE}/v1/hadax/common/currencys`,//查询HADAX站支持的所有币种
        queryTimestamp: `${HADAX_BASE}/v1/common/timestamp`,//查询系统当前时间
        accounts: `${HADAX_BASE}/v1/account/accounts`,//查询当前用户的所有账户(即account-id)
        accountBalance:`${HUO_BI_BASE}/v1/hadax/account/accounts/${config.huobi.account_id}/balance`,/// 查询HADAX站指定账户的余额
        subOrder:`${HADAX_BASE}/v1/hadax/order/orders/place`,//HADAX站下单
    }

    ;

export default {
    HUO_BI_BASE,
    HUO_BI,
    HADAX,

}
