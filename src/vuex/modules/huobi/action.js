/**
 * Created by 15236 on 2017/5/24.
 */
import ApiService from '@/services/API-servies'

export const huobiAction = {
    updateKLine({ commit, state }, data) {
        commit('UPDATE_KLINE',data);
    },
}
