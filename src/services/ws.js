const WebSocket = require('ws');
const pako = require('pako');

import store from '@/vuex/store';

const WS_URL = 'wss://api.huobipro.com/ws';

let huobiWs = {};

export default huobiWs;

const handle = data => {
    let chList = data.ch.split('.'),
        symbol = chList[1],
        channel = chList[2];

    switch (channel) {
        case 'depth':
        huobiWs[symbol] = data.tick;
            break;
        case 'kline':
            store.dispatch('updateKLine', {
                type: symbol,
                data: data.tick,
            });
           // dealKline(symbol,data.tick)
            break;
        case 'trade':
            dealTrade(symbol,data.tick)
            break;

        default:
            console.log('default',symbol, JSON.stringify(data,null,2))
    }
}, dealKline = (type, tick) => {
    if (type == 'dashusdt') {
        console.log(tick);
        if (tick.open >= 770) {
            console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
        };
        if (tick.open <=760.00) {
            console.log(`<<<<<<<<<<<<================`);
        }
    }
},dealTrade= (type,tick) => {
    console.log('dealTrade',type,tick)
}

function subscribe(ws) {
    const symbols = ['dashusdt','eosusdt'/*'xrpbtc', 'bchusdt',*/];
    // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
    for (let symbol of symbols) {
        // 订阅深度
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.depth.step0`,
            "id": `${symbol}`
        }));
        // 订阅K线
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.kline.1min`,
            "id": `${symbol}`
        }));

        //
        ws.send(JSON.stringify({
            "sub":`market.${symbol}.trade.detail`,
            "id": "id1"
        }));

        ws.send(JSON.stringify({
            "sub":`market.${symbol}.detail`,
            "id": "id1"
        }));
    }
}

function init() {
    var ws = new WebSocket('wss://api.huobipro.com/ws');
    ws.on('open', () => {
        console.log(new Date(),'ws open');
        subscribe(ws);
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            handle(msg);
        } else {
            console.log(text);
        }
    });
    ws.on('close', () => {
        console.log(new Date(),'ws close');
        init();
    });
    ws.on('error', err => {
        console.log(new Date(),'error', err);
        init();
    });
}

init();