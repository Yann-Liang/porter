<template>
    <div class="header">
        <ul class="left-menu">
            <li class="left-menu-item" @click="setFlag=!setFlag">设置
                <ul class="left-menu-1" v-if="setFlag">
                    <li @click="changeAccount">修改账号</li>
                    <li>

                    </li>
                </ul>
            </li>
             <li class="left-menu-item" @click="coinFlag=!coinFlag">Cddd
                <ul class="left-menu-1" v-if="coinFlag">
                    <li v-for="(i,key) in coinList" :key="key">
                        {{key}}
                        <ul class="left-menu-2">
                            <li v-for="item in i" :key="item.id" @click="selectCoins(item.coins)">
                                {{item.coins}}
                            </li>
                        </ul>
                    </li>
                </ul>

            </li>
        </ul>

        <!-- <span class="account">账户:{{account.id}}
            <ul class="balance">
                <li>
                    <span class="balance-currency">币种</span>
                    <span class="balance-num">可用</span>
                    <span class="balance-num">冻结</span>
                </li>
                <li v-for="(i,key) in balance" :key="key">
                    <span class="balance-currency">{{key}}</span>
                    <span class="balance-num">{{i.trade}}</span>
                    <span class="balance-num">{{i.frozen}}</span>
                </li>
                <li v-if="isEmpty">穷光蛋!!!</li>
            </ul>

        </span> -->

        <ul class="toolbar">
			<!-- <i class="toolbar-min" @click="min">-</i>
			<i class="toolbar-max" @click="max">O</i> -->

			<li class="toolbar-close" @click="close">隐藏</li>
		</ul>


    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import {mapState, mapActions, mapGetters} from 'vuex';
    // const
    //     huobiAccountService = new AccountService('huobipro');

    export default {
        data() {
            return {
                setFlag:false,
                coinFlag:false,
                account:{
                    id:'',
                },
                balance:{

                },
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {
            ...mapGetters(['coinList']),
            isEmpty(){
                return Object.keys(this.balance)==0;
            }
        },
        //方法
        methods: {
            // min() {
			// 	ipcRenderer.send('minimize-window');
			// },
			// max() {
			// 	ipcRenderer.send('max-window');
            // },
            changeAccount(){

            },
			close() {
				ipcRenderer.send('hide-window');
            },
            selectCoins(coins){
                console.log(coins);
            }

        },
        //生命周期函数
        created() {

        },
        beforeMount() {

        },
        mounted() {},
        //监视
        watch: {

        },
        //组件
        components: {

        },
        //过滤器
        filters: {

        },
        //自定义指令
        directive: {

        }
    }
</script>

<style lang="less" scoped>
    @import '../../less/modules/color.less';

    .header{
        display: flex;
        justify-content: space-between;
        margin: 0 0 5px;
        padding: 0 5px;
        height: 28px;
        line-height:28px;
        border-bottom: 1px solid #0B8AEE;
        border-radius: 5px;
        -webkit-app-region: drag;
    }

    .account {
        -webkit-app-region: no-drag;
        cursor: pointer;
        &:hover .balance{
            display: block;
        }
        -webkit-app-region:no-drag;
    }

    .balance{
        position: relative;
        top: -1px;
        display: none;
        padding: 0 5px;
        color: #C7CCE6;
        background: #1B1E2E;
        -webkit-app-region:no-drag;
        >li{
            border-bottom:1px solid #1F2943;
        }
        span{
            display: inline-block;
            text-align: center;
        }
    }
    .balance-currency{
        width: 30px;
    }
    .balance-num{
        width: 188px;
    }

    .left-menu{
        -webkit-app-region: no-drag;
        >li{
            cursor: pointer;
            display: inline-block;
            margin: 0 5px;
        }
    }

    .left-menu-item{
        line-height: 20px;
        -webkit-app-region:no-drag;
        li{
            padding: 0 0 0 10px;
        }
    }

    .left-menu-1{
        position: relative;
        position: absolute;
        top: 28px;
        left: 0px;
        z-index: 100;
        padding: 0 5px;
        width: 80px;
        border: 1px solid @default;
        background: #999;
        border-radius: 5px;
        >li{
            &:hover .left-menu-2{
                display: block;
            }
        }

    }

    .left-menu-2{
        position: relative;
        position: absolute;
        top: 0;
        left: 80px;
        z-index: 100;
        display: none;
        padding: 0 5px;
        width: 80px;
        border: 1px solid @default;
        background: #999;
        border-radius: 5px;

    }

    .toolbar {
        height: 30px;
		-webkit-app-region: no-drag;
		li {
            position: relative;
			cursor: pointer;
			display: inline-block;
			margin: 0 5px;
            background-repeat: no-repeat;
            &:last-child{
                margin-right: 0px;
            }
		}
    }
</style>