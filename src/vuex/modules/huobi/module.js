/**
 * Created by 15236 on 2017/5/24.
 */
import { huobiAction } from './action'
import { huobiGetter } from './getter'
import { huobiMutation } from './mutation'
export default {
  state:{
    kline: {
      dashusdt:[]
    },
  },
  actions:huobiAction,
  getters:huobiGetter,
  mutations:huobiMutation
}
