<template>
    <div id="wrapper">
        <com-header></com-header>
        <el-form class="from" ref="form" :model="form" label-width="80px">
            <el-form-item label="跟踪值">
                <el-input v-model.number="form.num"></el-input>
            </el-form-item>
        </el-form>
        <main>

        </main>
        <pre>
            {{getKLine}}
        </pre>
        <p>百分比:{{a}}%</p>
        <audio id="audio" class="audio" controls="controls" preload="auto" src="/static/audios/彭家丽 - 昨天今天下雨天.mp3"></audio>
    </div>
</template>

<script>
    import comHeader from '@/components/header/';
    import APIServies from '@/services/API-servies';
    import test from '@/services/test-servies';
    import huobiWs from '@/services/ws'
    import {mapState, mapActions, mapGetters} from 'vuex';

    export default {
        name: 'landing-page',
        //实例的数据对象
        data() {
            return {
                src: 'https://www.baidu.com/',
                isPlaying:false,
                form: {
                    num:700
                },
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {
            ...mapGetters(['getKLine',]),
            a(){
                let item=this.getKLine.dashusdt,
                {high,low}=item;
                return (high-low)/low*100;
            }
        },
        //方法
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            play(){
                let audio =document.querySelector('#audio');
                if(!this.isPlaying){
                    console.log(audio)
                    audio.play();
                    this.isPlaying = true;
                }
            },
            stop(){
                let audio =document.querySelector('#audio');
                if(this.isPlaying){
                    audio.pause();
                    audio.currentTime = 0;
                }
            },
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
        },
        beforeMount() {

        },
        mounted() {},
        //监视
        watch: {
            'getKLine.dashusdt.open':function(now,old){
                console.log(now,this.form.num)
                if(this.form.num&&now<=this.form.num){//
                    this.play();
                }else{
                    this.stop();
                }
            }
        },
        //组件
        components: {
            comHeader,
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
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
        height: 100vh;

        width: 100vw;
    }

    .from{
        width: 300px;
    }

    main {
        padding: 60px 80px;
        display: flex;
        justify-content: space-between;
    }




</style>