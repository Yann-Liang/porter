const pako = require('pako');


const test = () => {
    // 打开一个WebSocket:
    var ws = new WebSocket('wss://api.huobi.pro/ws');
    console.log(ws);

    ws.onopen = function () {
        ws.send(JSON.stringify({
            "req": "topic to req",
            "id": "id generate by client"
          }))
    };
    // 响应onmessage事件:
    ws.onmessage = function (data) {
        console.log('onmessage',data)
        let text = pako.inflate(data.data, {
            to: 'string'
        });

        let msg = JSON.parse(text);
        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            // console.log(msg);
            handle(msg);
        } else {
            console.log(text);
        }
        console.log(msg)
        var restored = JSON.parse(pako.inflate(msg, {
            to: 'string'
        }));
    };


    ws.onclose = function (evt) {
        console.log('WebSocketClosed!', evt);

    };

    ws.onerror = function (evt) {
        console.log('WebSocketError!', evt);

    };

};


export default test;