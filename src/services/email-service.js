var nodemailer  = require('nodemailer');

class EmailService {
    constructor() {
        this.email= nodemailer.createTransport({
            host : 'smtp.163.com',
            secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
            port:465,
            auth : {
                user : '17154838705@163.com',
                pass : '',
            },
        });
    }
    send(subject, text, html) {
        return new Promise((resolve, reject) => {
            this.email.sendMail({
                from: `17154838705@163.com`,//'"你的名字" <你的邮箱地址>',
                to: `liangyanxiangde@vip.qq.com`,//'"用户1" <邮箱地址1>, "用户2" <邮箱地址2>',
                cc: '',  //抄送
                bcc: '',    //密送
                subject,
                text,
                html,
            }, function (err, msg) {
                if (err) {
                    console.warn(`send email err`, err);
                    reject(err);
                }
                else {
                    console.log(`send email msg`, msg);
                    resolve(msg);
                }
            });
        });
    }
};

//导出一个对象
export default EmailService;