<template>
    <div id="wrapper" class="clearfix">
        <!-- <com-header></com-header> -->
        <form class="from fl" ref="form" :model="form" label-width="80px" onSubmit="return fasle;" >
            <label>高于值:
                <input type="number" v-model.number="form.height" />
            </label>
            <label>低于值:
                <input type="number" v-model.number="form.low" />
            </label>
            <label>交易对:
                <select v-model="form.key">
                    <option v-for="(item,index) in options" :key="index" :value="item">{{item}}</option>
                </select>
            </label>
            <button type="button" @click="addWatch">添加监控</button>
            <button type="button" @click="stop">停止声音</button>
        </form>
        <div class="clearfix">
            <ul class="list fl" v-for="(item,key) in watchList" :key="key">
                <li class="list-item"><b>监控:</b>{{key}}</li>
                <li class="list-item"><b>高于值:</b>{{item.height}}</li>
                <li class="list-item"><b>低于值:</b>{{item.low}}</li>
                <li class="list-item"><b>状态:</b>{{item.watcher?'监控中...':'空闲'}}</li>
                <button type="button" @click="watchKey(key)">开始监控</button>
                <button type="button" @click="unwatchKey(key)">停止监控</button>
            </ul>
        </div>
        <main>
            <ul class="list" v-for="(item,index) in getKLine" :key="index">
                <li class="list-item"><b>交易对:</b>{{index}}</li>
                <li class="list-item" v-for="(i,k) in item" :key="k">
                    <span>{{k}}:</span>{{i}}
                </li>
            </ul>
        </main>

        <audio id="audio" class="audio" preload="auto" loop="loop" :src="audioSrc"></audio>
    </div>
</template>

<script>
    //import comHeader from '@/components/header/';
    import APIServies from '@/services/API-servies';
    import test from '@/services/test-servies';
    import Ws from '@/services/ws'
    import {mapState, mapActions, mapGetters} from 'vuex';
    import {ipcRenderer} from 'electron';

    export default {
        name: 'landing-page',
        //实例的数据对象
        data() {
            return {
                audioSrc: `${__static}/music/1.mp3`,
                isPlaying:false,
                form: {
                    height:800,
                    low:0,
                    key:'dashusdt',
                },
                options:['btmeth','ethusdt','dashusdt','eosusdt',/*'xrpbtc', 'bchusdt',*/],
                watchList:{

                },
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {
            ...mapGetters(['getKLine',]),
        },
        //方法
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            play(){
                let audio =document.querySelector('#audio');
                if(!this.isPlaying){
                    audio.play();
                    this.isPlaying = true;
                }
            },
            stop(){
                let audio =document.querySelector('#audio');
                if(this.isPlaying){
                    audio.pause();
                    audio.currentTime = 0;
                    this.isPlaying = false;
                }
            },
            addWatch(){
                if(!this.watchList[this.form.key]&&this.watchList[this.form.key]==undefined){
                    this.watchList[this.form.key]={
                        watcher:null,
                        height:this.form.height,
                        low:this.form.low,
                    };
                }else{
                    alert('请勿重复添加');
                }
            },
            watchKey(key){
                this.watchList[key].watcher&&this.watchList[key].watcher();

                this.watchList[key].watcher=this.$watch(`getKLine.${key}.close`, function(now,old){
                    console.log(now,this.form.num)
                    if((this.form.height&&now>=this.form.height)||(this.form.low&&now>=this.form.low)){//
                        console.log('gogo');
                        ipcRenderer.send('news-tips');
                        this.play();
                    }else{
                        this.stop();
                    }
                }, {
                    immediate: true//立即以 `` 的当前值触发回调
                })
            },
            unwatchKey(key){
                this.stop()
                this.watchList[key].watcher&&this.watchList[key].watcher();
            }
        },
        //生命周期函数
        created() {
            let time=new Date().Format("yyyy-MM-ddTHH:mm:ss");
              //  test();
            // APIServies.get(`https://api.huobi.pro/market/history/kline?\n
            //     AccessKeyId=82af2d5b-845a4086-a5733bb7-06d6c\n
            //     &SignatureMethod=HmacSHA256\n
            //     &SignatureVersion=2\n
            //     &Timestamp=${time}\n
            //     &order-id=1234567890\n
            //     &Signature=calculated value\n
            //     &symbol=dashusdt\n
            //     `,{
            // }).then(res=>{
            //     console.log('res',res);
            //     this.tableData=res.data;
            // }).catch(error=>{
            //     console.log('error',error)
            // })

            // APIServies.get(`https://api.huobi.pro/market/detail/merged?\n
            //     AccessKeyId=82af2d5b-845a4086-a5733bb7-06d6c\n
            //     &SignatureMethod=HmacSHA256\n
            //     &SignatureVersion=2\n
            //     &Timestamp=${time}\n
            //     &order-id=1234567890\n
            //     &Signature=calculated value
            //     &symbol=btcusdt
            //     `,{

            // }).then(res=>{
            //     console.log('res',res);
            //     this.tableData=res.data;
            // }).catch(error=>{
            //     console.log('error',error)
            // })

            APIServies.get(`https://api.huobi.pro\n
                /v1/common/symbols?\n
                AccessKeyId=82af2d5b-845a4086-a5733bb7-06d6c\n
                &SignatureMethod=HmacSHA256\n
                &SignatureVersion=2\n
                &Timestamp=${time}\n
                &order-id=1234567890\n
                &Signature=calculated value
                `,{

            }).then(res=>{
                console.log('交易对',res);
            }).catch(error=>{
                console.log('error',error)
            })
        },
        beforeMount() {

        },
        mounted() {},
        //监视
        watch: {
            // 'getKLine.dashusdt.close':function(now,old){
            //     console.log(now,this.form.num)
            //     if((this.form.height&&now>=this.form.height)||(this.form.low&&now>=this.form.low)){//
            //         console.log('gogo');
            //         ipcRenderer.send('news-tips');
            //         this.play();
            //     }else{
            //         this.stop();
            //     }
            // },
        },
        //组件
        components: {
            //comHeader,
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
    #wrapper {
        display: block;
        background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
        height: 100vh;
        width: 100vw;
    }

    .from{
        width: 300px;
        >label{
            display: block;
        }
    }

    .list{
        display: flex;
        flex-direction:column;
        width: 195px;
    }
    .list-item{
        >span,>b{
            display: inline-block;
            width: 60px;
        }
    }



    #audio{
        display:none;
    }

    main {
        padding: 60px 80px;
        display: flex;
        justify-content: space-between;
    }



</style>