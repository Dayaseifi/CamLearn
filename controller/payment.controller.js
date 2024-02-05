const { default: axios } = require("axios");
const courseLogic = require("../app/course")
const { con } = require("../model/DB")
const Today = require("../utils/DateConvertor/ShamsiDate")
const { promisify } = require('util');
const queryAsync = promisify(con.query).bind(con);


class paymentController {
    async handlePayment(req, res, next) {
        try {
            let {  price } = req.body;

            let orderID = Math.floor(Math.random() * 1000);
            const transactionDate = Today
            orderID = orderID.toString();
            let params = {
                merchant: process.env.MERCHANT,
                amount: price,
                callbackUrl: "http://localhost:" + process.env.PORT + '/course/handle/verify',
            };
            console.log(price);
            let requestBuy = await axios.post(
                process.env.PaymentHandling,
                params
            );

            console.log(requestBuy.data);
            if (requestBuy.data.result == 100) {
                const sql = `INSERT INTO transactions (ClientFullname	,ClientEmail,Amount	,TrackID	,payDate	,PID,	User_ID) VALUES (?,	?,	?,	?,	?,	?,	?)`;
                con.query(sql, [req.user.Username ,req.user.Email, price, requestBuy.data.trackId, transactionDate, orderID , req.user.Id], (err, result) => {
                    if (err) {
                        return next(err);
                    }
    
                    res.status(302).json({
                        success: true,
                        data: requestBuy.data,
                        error: null
                    });
                });
            } else {
                res.status(200).json({
                    success: false,
                    error: {
                        message: requestBuy.data
                    },
                    data: null
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        try {
            const { success, status, trackId } = req.query;
    
            if (success === '1' && status === '2') {
                const params = {
                    merchant: process.env.MERCHANT,
                    trackId,
                };
    
                const url = process.env.PaymentVerification;
                const requestVerify = await axios.post(url, params);
                console.log(requestVerify.data.result);
                if (requestVerify.data.result !== 100) {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        error: {
                            message: 'Payment verification failed.',
                        },
                    });
                }
    
                const [transactionResult] = await queryAsync('SELECT * FROM transactions WHERE TrackID = ? AND Verify = ?', [trackId, false]);
    
                if (!transactionResult) {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        error: {
                            message: 'Transaction not found.',
                        },
                    });
                }
    
                await queryAsync('UPDATE transactions SET verify = ? WHERE TrackID = ?', [true, trackId]);
    
                const basketQuery = 'SELECT * FROM basket JOIN course ON course.ID = basket.Course_ID WHERE basket.User_ID = ?';
                const basketResults = await queryAsync(basketQuery, [req.user.Id]);
    
                await Promise.all(basketResults.map(async (basketItem) => {
                    await courseLogic.addStudentToCourse(basketItem.ID, req.user.Id);
                }));
    
                await queryAsync('DELETE FROM basket WHERE basket.User_ID = ?', [req.user.Id]);
    
                return res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        message: 'Course buying done successfully',
                    },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Money transfer not successful.',
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new paymentController()