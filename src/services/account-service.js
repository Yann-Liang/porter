class AccountService {
    constructor() {
        this.balance = {};

    }


    removeEmptyData(exchangeName,list) {
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

    R() {
        return new Promise((resolve, reject) => {

        });
    }

};

//导出一个对象
export default new AccountService;