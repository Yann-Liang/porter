const nodemailer = require('nodemailer'),
    config = require('@/config/default.json')
    //moment = require('moment')

    ;

const email = nodemailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    port: 465,
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
}),
    getOptions = (subject, html) => {
        return {
            from: config.email.user,//'"你的名字" <你的邮箱地址>',
            to: `liangyanxiangde@vip.qq.com`,//'"用户1" <邮箱地址1>, "用户2" <邮箱地址2>',
            cc: '',  //抄送
            bcc: '',    //密送
            subject,
            text: '',
            html,
        }
    }
    ;

class EmailService {
    constructor() {

    }
    send(subject, html) {
        console.log('send email', subject, html);
        email.sendMail(getOptions(subject, html), function (err, msg) {
            if (err) {
                console.warn(`send email err`, err);
            }
            else {
                console.log(`send email msg`, msg);
            }
        });

    }

    // sendAccountBalance(exchangeName, list) {
    //     const subject = `${moment().format("YYYY年MM月DD日HH:mm")} ${exchangeName}的账户余额`;
    //     let html = [`<table border="1" style="text-align:center;border-collapse:collapse;">
    //                     <caption>${subject}</caption>
    //                     <thead>
    //                         <tr>
    //                             <th>币种</th>
    //                             <th>可用</th>
    //                             <th>冻结</th>
    //                             <th>总计</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>`
    //     ];
    //     for (const key in list) {
    //         const trade = list[key].trade ? Number(list[key].trade) : 0,
    //             frozen = list[key].frozen ? Number(list[key].frozen) : 0,
    //             total = trade + frozen;

    //         html.push(`<tr>
    //                     <td>${key}</td>
    //                     <td>${trade}</td>
    //                     <td>${frozen}</td>
    //                     <td>${total}</td>
    //                 </tr>`);
    //     }
    //     html.push('</tbody></table>')
    //     console.log(subject, html.join(''));
    //     email.sendMail(getOptions(subject,html.join('')), function (err, msg) {
    //         if (err) {
    //             console.warn(`send email err`, err);
    //         }
    //         else {
    //             console.log(`send email msg`, msg);
    //         }
    //     });
    // }

};

//导出一个对象
export default EmailService;