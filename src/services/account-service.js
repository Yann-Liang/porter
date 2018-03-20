const moment = require('moment')
    ;

class AccountService {
    constructor() {
        this.balance = {};

    }


    removeEmptyData(exchangeName, list) {
        return new Promise((resolve, reject) => {
            if (list && list.length) {
                const len = list.length;
                let balance = {};
                for (let i = 0, item; i < len; i++) {
                    item = list[i];
                    if (item.balance > 0) {
                        typeof balance[item.currency] == "undefined" ? balance[item.currency] = {} : '';
                        balance[item.currency][item.type] = item.balance;
                    }
                }
                this.balance[exchangeName] = balance;
                resolve(balance);
            } else {
                reject();
            }
        });
    }

    getAccountBalanceContent(exchangeName) {

        const list = this.balance[exchangeName];
        let oldList = null,
        balance={};

        if (localStorage.balance && localStorage.balance[exchangeName]) {
            oldList = localStorage.balance[exchangeName];
        }

        if (localStorage.balance) {
            balance  = JSON.parse(localStorage.balance);
            oldList = balance[exchangeName] ? balance[exchangeName] : {};
        }

        return new Promise((resolve, reject) => {

            const time = moment().format("YYYY年MM月DD日HH:mm"),
                subject = `[财务报告]${time} ${exchangeName}账户余额`;
            let html = [`<table border="1" style="text-align:center;border-collapse:collapse;">
                            <caption>${subject}</caption>
                            <thead>
                                <tr>
                                    <th>币种</th>
                                    <th>可用</th>
                                    <th>冻结</th>
                                    <th>总计</th>
                                    <th>上次总计</th>
                                    <th>差额</th>
                                </tr>
                            </thead>
                            <tbody>`
            ];
            for (const key in list) {
                const item = list[key],
                    trade = item.trade ? Number(item.trade) : 0,
                    frozen = item.frozen ? Number(item.frozen) : 0,
                    total = trade + frozen,
                    oldTotal = oldList[key] ? oldList[key].total : 0;

                list[key].total = total;

                html.push(`<tr>
                            <td>${key}</td>
                            <td>${trade}</td>
                            <td>${frozen}</td>
                            <td>${total}</td>
                            <td>${oldTotal}</td>
                            <td>${total - oldTotal}</td>
                        </tr>`);
            }

            balance[exchangeName] = list;
            localStorage.balance = JSON.stringify(balance);
            localStorage[`${exchangeName}RecordedTime`] = time;
            html.push('</tbody></table>');
            html = html.join('');
            resolve({ subject, html });

        });

    }

};

//导出一个对象
export default new AccountService;