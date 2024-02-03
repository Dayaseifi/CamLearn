const { default: axios } = require("axios");

class Zarinpal {
    request(zpamount, zpemail, zpphone, zpdesc) {
        const url = process.env.PaymentHandling;
        const zapripal_options = {
            merchant_id: process.env.ZARINPALMERCHENTID,
            amount: zpamount,
            description: zpdesc,
            metadata: {
                email: zpemail,
                mobile: "09021899273"
            },
            callback_url: "http://localhost:" + process.env.PORT + '/course/handle/verify'
        };
    
        return axios.post(url, zapripal_options)
            .then(result => result.data)
            .then(data => {
                if (data) {
                    const status = true;
                    const paymentUrl = 'https://www.zarinpal.com/pg/StartPay/' + data.Authority;
                    return { status, url: paymentUrl };
                } else {
                    const status = false;
                    const code = data.errors.code;
                    throw new Error('خطایی پیش آمد! ' + code);
                }
            })
            .catch(error => {
                throw error;
            });
    }
    
    async VerifyRequest(url, zpamount, authority) {
        try {
            const args = {
                merchant_id: process.env.ZARINPALMERCHENTID,
                amount: zpamount,
                authority: authority
            };
            const data = await axios.post(url, args).then(result => result.data)
            return data;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new Zarinpal()