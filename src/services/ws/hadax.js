const
    WebSocket = require('ws'),
    pako = require('pako'),
    API = require('../../config/api/huobipro')
    ;

let ws = null;

const handle = data => {
    let chList = data.ch.split('.'),
        symbol = chList[1],
        channel = chList[2];

    switch (channel) {
        case 'depth':
            //console.log('depth', data.tick);
            break;
        case 'kline':
            // store.dispatch('updateKLine', {
            //     type: symbol,
            //     data: data.tick,
            // });
            window.kLine[symbol] = data.tick;
            break;
        case 'trade':
            //dealTrade(symbol,data.tick)
            break;

        default:
            console.log('default',symbol, JSON.stringify(data,null,2))
    }
},dealTrade= (type,tick) => {
    console.log('dealTrade',type,tick)
}

function subscribe(ws) {
    const symbols = ['egcceth','sheeth'];
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
    ws = new WebSocket(API.URL.ws);
    ws.on('open', () => {
        console.log(new Date(),`${wsUrl} ws open`);
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
        console.log(new Date(),`${wsUrl} ws close`);
        init();
    });
    ws.on('error', err => {
        console.info(new Date(),`${wsUrl} error`, err);
        init();
    });
}

init();

export default ws;