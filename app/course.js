const { con } = require("../model/DB");

class courseLogic {
    findByID(ID) {
        return new Promise((resolve, reject) => {
            let query = `SELECT Course.* , user.Username AS Teacher FROM Course 
            JOIN user ON Course.Teacher_ID = user.Id
            WHERE Course.ID = ?`;
            con.query(query, [ID], (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(err)
                }
                return resolve(result.length > 0 ? result[0] : null)
            })
        });
    }
    findByName(Name) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM Course WHERE CourseName = ?`
            con.query(query, [Name], (err, result) => {
                if (err) {
                    return reject(err)
                }
                return resolve(result.length > 0 ? result[0] : null)
            })
        });
    }
    create(user, name, description, Price) {
        return new Promise((resolve, reject) => {
            let query = `INSERT INTO Course (Teacher_ID,CourseName,	CourseDescription , Price) VALUES (? , ? , ? , ?)`
            con.query(query, [user, name, description, Price], (err, result) => {
                if (err) {
                    return reject(err)
                }
                return resolve(result.insertId)
            })
        });
    }
    UploadBanner(src, filename, Course_ID) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO files(Src,Filename,IsBanner,Course_ID , Title) VALUES(? , ? , ? , ? , ?)`
            con.query(sql, [src, filename, true, Course_ID, 'Banner'], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result.insertId)
            })
        });
    }
    UploadVideos(src, filename, Course_ID, title) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO files(Src,Filename,IsBanner,Course_ID , Title) VALUES(? , ? , ? , ? , ?)`
            con.query(sql, [src, filename, false, Course_ID, title], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result.insertId)
            })
        });
    }
    Files(ID) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM files WHERE Course_ID = ?`
            con.query(sql, [ID], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result)
            })
        });
    }
    allCoure(page, dataCount) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * dataCount
            let sql = `SELECT course.ID , course.CourseName , course.Price , user.Username as Teacher FROM course JOIN user ON user.Id = course.Teacher_ID  LIMIT ? OFFSET ?`
            con.query(sql, [dataCount, offset], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result)
            })
        });
    }
    addStudentToCourse(courseID, studentID) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO course_student (Student_ID	,Course_ID	) VALUES (? , ?)`
            con.query(sql, [studentID, courseID], (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result.insertId)
            })
        });
    }
    checkStudent(CourseID, StudentID) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT ID FROM course_student WHERE Student_ID = ? AND Course_ID = ?`
            con.query(sql, [StudentID, CourseID], (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result.length == 0 ? false : true)
            })
        });
    }
    search(word){
        return new Promise((resolve, reject) => {
            let sql = `SELECT course.Price , course.CourseDescription , course.CourseName , user.Username AS Teacher FROM course  JOIN user ON user.Id = course.Teacher_ID WHERE CourseName LIKE '%${word}%'`
            con.query(sql , (err,result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        });
    }
}

module.exports = new courseLogic()