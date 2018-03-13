<template>
    <div class="header">
        <div class="account" @mouseover="showBalance" @mouseout="hideBalance">账户:{{account.id}}
            <ul class="balance">
                <li v-for="(i,index) in balance.list" :key="index">{{i}}</li>
            </ul>
        </div>

    </div>
</template>

<script>
    import huobiHttp from '@/services/http/huobi';
    export default {
        data() {
            return {
                account:{
                    id:'',
                },
                balance:{
                    id:'',
                    list:[],
                    type:'',
                    state:'',
                },
                show:false,
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {

        },
        //方法
        methods: {
            showBalance(){
                this.show=true;
            },
            hideBalance(){
                this.show=false;
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
                console.log('accountBalance',res);
                if(res.status=='ok'){
                    this.balance=res.data;
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
        margin: 0 0 5px;
        padding: 0 5px;
        height: 28px;
        line-height:28px;
        border: 1px solid #666;
        border-radius: 5px;
    }

    .account {
        &:hover .balance{
            display: block;
        }
    }

    .balance{
        position: relative;top: -1px;
        display: none;
        width: 520px;
        background: #ccc;

    }
</style>