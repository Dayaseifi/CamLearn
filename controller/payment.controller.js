const Payment = require("../app/Payment")
const courseLogic = require("../app/course")
const { con } = require("../model/DB")
const Today = require("../utils/DateConvertor/ShamsiDate")
const zarinpal = require("../utils/payment/zarinpal/zarinpal")

class paymentController {
    async handlePayment(req, res, next) {
        try {
            let { ClientDescription } = req.body;
            const id = req.params.id;
            const course = await courseLogic.findByID(id);

            if (!course) {
                return res.status(404).json({ success: false, error: "Course not found" });
            }

            let pid = Math.floor(Math.random() * 1000);
            const transactionDate = Today
            pid = pid.toString();
            const data = await zarinpal.request(course.Price, req.user.Email, req.user.Email, ClientDescription || 'اختیاری');

            if (data.status) {
                const sql = `INSERT INTO transactions (Authority,ClientFullname , ClientEmail, Amount, ClientDescription, payDate, PID) VALUES (?,?, ?, ?, ?, ? , ?)`;
                con.query(sql, [data.authority, req.user.Username, req.user.Email, course.Price, ClientDescription || 'کاربر توضیحی وارد نکرده', transactionDate, pid], (err, result) => {
                    if (err) {
                        return next(err);
                    }
                });
                res.status(302).json({
                    success: true,
                    data,
                    error: null
                });
            } else {
                const error = new Error("متاسفانه خطایی رخ داده ");
                error.status = 500;
                throw error;
            }
        } catch (error) {
            next(error);
        }
    }
    async verifyPayment(req, res, next) {
        try {
            const authority = req.query.authority
            const url = process.env.PaymentVerification
            const course = con.query(`SELECT * FROM transactions WHERE Authority = ? AND Verify = ?`, [authority, false], async (err, result) => {
                if (err) {
                    next(err)
                }
                const data = await zarinpal.VerifyRequest(url, result[0].Price , authority)
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new paymentController()