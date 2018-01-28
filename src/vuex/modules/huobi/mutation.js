/**
 * Created by 15236 on 2017/5/24.
 */
export const huobiMutation = {
  ['UPDATE_KLINE'](state, obj) {
    const { type, data } = obj;
    state.kline[type] = data;
    console.log('state', state);
},
};
