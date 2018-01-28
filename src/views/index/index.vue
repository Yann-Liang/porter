<template>
    <div id="wrapper">
        <com-header></com-header>
        <main>
            <div class="left-side">
                <span class="title">
                    Welcome to your new project!
                </span>
                <system-information></system-information>
            </div>
            <div class="right-side">
                <div class="doc">
                    <div class="title">Getting Started</div>
                    <p>
                        electron-vue comes packed with detailed documentation that covers everything from internal configurations, using the project structure, building your application, and so much more.
                    </p>
                    <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
                </div>
                <div class="doc">
                    <div class="title alt">Other Documentation</div>
                    <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
                    <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
                </div>
            </div>
            <audio id="audio" class="audio" controls="controls" preload="auto" src="/static/audios/彭家丽 - 昨天今天下雨天.mp3"></audio>
        </main>
        <pre>
            {{getKLine}}
        </pre>
        <!--<webview class="webview" autosize="on" minwidth="576" minheight="500" :src="src"></webview>-->
    </div>
</template>

<script>
    import comHeader from '@/components/header/';
    import systemInformation from '@/components/system-information/system-information'
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
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {
            ...mapGetters(['getKLine',])

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
                console.log(now,old);
                if(now<=760){

                    this.play();
                }else{
                    this.stop();
                }
            }
        },
        //组件
        components: {
            comHeader,
            systemInformation
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

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        padding: 60px 80px;
        display: flex;
        justify-content: space-between;
    }

    main>div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc {
        p {
            color: black;
            margin-bottom: 10px;
        }
        button {
            font-size: .8em;
            cursor: pointer;
            outline: none;
            padding: 0.75em 2em;
            border-radius: 2em;
            display: inline-block;
            color: #fff;
            background-color: #4fc08d;
            transition: all 0.15s ease;
            box-sizing: border-box;
            border: 1px solid #4fc08d;
        }
        button.alt {
            color: #42b983;
            background-color: transparent;
        }
    }

    .webview {
        display: flex;
        height: 480px;
    }
</style>