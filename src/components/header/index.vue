<template>
    <div class="header">
        <span class="account">账户:{{account.id}}
            <ul class="balance">
                <li v-for="(i,key) in balance" :key="key">
                    <span>币种:{{key}}</span>
                    <span>可用:{{i.trade}}</span>
                    <span>冻结:{{i.frozen}}</span>
                </li>
                <li v-if="isEmpty">穷光蛋!!!</li>
            </ul>

        </span>
        <div class="toolbar">
			<!-- <i class="toolbar-min" @click="min">-</i>
			<i class="toolbar-max" @click="max">O</i> -->
			<i class="toolbar-close" @click="close">隐藏</i>
		</div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import huobiHttp from '@/services/http/huobi';

    export default {
        data() {
            return {
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
			close() {
				ipcRenderer.send('hide-window');
			},
        },
        //生命周期函数
        created() {
            huobiHttp.getAccount({}).then((res)=>{
                console.log('getAccount',res);
                if(res.status=='ok'){
                    this.account=res.data[0];
                }
            }).catch((error)=>{
                console.warn('getAccount error',error)
            });

            huobiHttp.accountBalance({
            }).then((res)=>{
                if(res.status=='ok'){
                    const list=res.data.list,
                        len=list.length;
                    let balance={};
                    for(let i=0,item;i<len;i++){
                        item=list[i];
                        if(item.balance>0){
                            typeof balance[item.currency]=="undefined"?balance[item.currency]={}:'';
                            balance[item.currency][item.type]=item.balance;
                        }
                    }
                    this.balance=balance;

                }

            }).catch((error)=>{
                console.warn('accountBalance error',error)
            });
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
    .header{
        display: flex;
        justify-content: space-between;
        margin: 0 0 5px;
        padding: 0 5px;
        height: 28px;
        line-height:28px;
        border: 1px solid #666;
        border-radius: 5px;
    }

    .account {
        cursor: pointer;
        &:hover .balance{
            display: block;
        }
    }

    .balance{
        position: relative;top: -1px;
        display: none;
        padding: 0 5px;
        width: 500px;
        background: #ccc;

    }
    .toolbar {
        height: 30px;
		//-webkit-app-region: no-drag;
		i {
            font-style: normal;
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