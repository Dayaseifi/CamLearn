const { con } = require("../model/DB");

class basket {
    async addProduct(Course_ID, User_ID) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO basket(User_ID,	Course_ID) VALUES (?,?)`
            con.query(sql, [User_ID, Course_ID], (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(true)
            })
        });
    }
    async CheckBasket(Course_ID, User_ID) {
        return new Promise((resolve, reject) => {
            console.log(Course_ID);
            let sql = "SELECT * FROM basket WHERE Course_ID = ? AND User_ID = ?"
            con.query(sql, [Course_ID, User_ID], (err, result) => {
                if (err) {
                    reject(err)
                }
                console.log(result);
                resolve(result.length > 0 ? result[0] : null)
            })
        });
    }
    findUserBasket(userID) {
        return new Promise((resolve, reject) => {
           let sql = `SELECT basket.* , course.CourseName , course.Price FROM basket JOIN course ON basket.User_ID = basket.ID`
           con.query(sql , [userID] , (err , result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
           })
        });
    }
}

module.exports = new basket()