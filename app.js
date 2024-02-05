const cookieParser = require("cookie-parser");
const express = require("express");
const path = require('path');
const errorhandlers = require("./utils/error/errorhandlers");
require('dotenv').config({path : path.join(__dirname , 'config' , '.env')});
const {connecting} = require('./model/DB');
const authRouter = require('./routes/api/auth.router');
const adminRouter = require('./routes/api/admin.router');
const courseRouter = require('./routes/api/course.router');
const basketRouter = require("./routes/api/basket.router");
const { authChecker } = require("./controller/authcontroller");
const app = express()

app.use('/public/upload',express.static(path.join(__dirname , 'public' , 'upload')))
app.use(express.json())
app.use(cookieParser())
connecting()


app.get("/" , (req,res) => {
    res.status(200).json({
        message : "ok",
        success : true,
        error : null
    })
})

app.use( authRouter)
app.use(adminRouter)
app.use('/course' ,courseRouter)
app.use("/basket" , basketRouter)
app.use(errorhandlers.error404)
app.use(errorhandlers.unexceptionError)

const port = process.env.PORT


app.listen(port , () => {
    console.log(`app listening on port ${port}`);
})
