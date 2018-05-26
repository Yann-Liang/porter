
export const huobiAction = {
    updateKLine({ commit, state }, data) {
        commit('UPDATE_KLINE',data);
    },
    getCoinList({ commit, state }, data) {
        $huobipro.querySymbols({}).then((res)=>{
            let coinObj={}
            for (const item of res) {
                item.coins = item['base-currency'] + item['quote-currency'];
                typeof coinObj[item['quote-currency']]==='undefined'?coinObj[item['quote-currency']]=[]:coinObj[item['quote-currency']].push(item)
            }
            commit('COIN_LIST', coinObj);
        }).catch((error)=>{
            console.warn('querySymbols error',error)
        });
    },
}
