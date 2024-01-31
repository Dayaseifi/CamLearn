const mysql = require('mysql');


const DBconfigs = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
}
console.log(DBconfigs);

const con = mysql.createConnection(DBconfigs)


const connecting = () => {
    con.connect(err => {
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            console.log('Connected to the database => ' + DBconfigs.database);
        }
    });
    let query = `CREATE TABLE IF NOT EXISTS user (
        Id       INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(100) NOT NULL,
        Email    VARCHAR(100) NOT NULL unique,
        Password VARCHAR(255) NOT NULL,
        Refresh_token VARCHAR(255)
        );`

    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    query = `CREATE TABLE IF NOT EXISTS Role (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        RoleName VARCHAR(100) NOT NULL
    );`
    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    query = `CREATE TABLE IF NOT EXISTS Course(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Teacher_ID INT NOT NULL,
        VideoCount INT DEFAULT 0,
        CourseName VARCHAR(255) NOT NULL,
        CourseDescription LONGTEXT NOT NULL,
        FOREIGN KEY (Teacher_ID) REFERENCES user(ID)
    );`
    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    query = `CREATE TABLE IF NOT EXISTS Files(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Src LONGTEXT NOT NULL,
        Filename LONGTEXT NOT NULL,
        IsBanner BOOLEAN DEFAULT FALSE,
        Course_ID INT,
        FOREIGN KEY (Course_ID) REFERENCES Course(ID) 
    );
    `
    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = {
    con, connecting
}