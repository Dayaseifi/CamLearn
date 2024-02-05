const { default: axios } = require("axios");

class Zarinpal {
    async request(zpamount, zpemail, zpphone) {
        const url = process.env.PaymentHandling;
        const zibal_options = {
            merchant: process.env.MERCHANT,
            amount: zpamount,
            callbackUrl: "http://localhost:" + process.env.PORT + '/course/handle/verify'
        };

        return axios.post(url, zibal_options)
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