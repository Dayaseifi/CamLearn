const mysql = require('mysql');


const DBconfigs = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
}
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
        Refresh_token VARCHAR(255),
        RoleID INT NOT NULL,
        FOREIGN KEY (RoleID) REFERENCES Role(ID)
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
        CourseName VARCHAR(255) NOT NULL,
        CourseDescription LONGTEXT NOT NULL,
        Price VARCHAR(15) NOT NULL,
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
        Course_ID INT NOT NULL,
        Title VARCHAR(120) NOT NULL, 
        FOREIGN KEY (Course_ID) REFERENCES Course(ID) 
    );
    `
    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    let sql = `CREATE TABLE IF NOT EXISTS Course_Student(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Student_ID INT NOT NULL,
        Course_ID INT NOT NULL,
        FOREIGN KEY (Student_ID) REFERENCES user(ID),
        FOREIGN KEY (Course_ID) REFERENCES Course(ID)
    );
    `

    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    sql = `CREATE TABLE IF NOT EXISTS Basket (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        User_ID INT NOT NULL,
        Course_ID INT NOT NULL,
        FOREIGN KEY (User_ID) REFERENCES user(Id),
        FOREIGN KEY (Course_ID) REFERENCES Course(ID)
       );`
    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
    })
    query = `CREATE TABLE IF NOT EXISTS transactions  (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Verify    BOOLEAN NOT NULL DEFAULT FALSE,
        ClientFullname   varchar(100)  NOT NULL,
        ClientEmail  varchar(150)  NOT NULL,
        Amount       varchar(150) NOT NULL,
        TrackID varchar(150) NOT NULL,
        payDate varchar(20)  NOT NULL,
        PID     varchar(255) NOT NULL,
        User_ID INT NOT NULL,
        FOREIGN KEY (User_ID) REFERENCES user(Id)
      );`

    con.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
    })


}

module.exports = {
    con, connecting
}