const courseLogic = require("../app/course")

const checkers = async (req,res,next) => {
    const id = req.params.id
    const course = await courseLogic.findByID(id)
    if (!course) {
        return res.status(404).json({
            error : {
                message : "course doesnt exist"
            },
            success : false,
            data : null
        })
    }
    if (req.user.Id === course.Teacher_ID || req.user.Id == 3) {
        next()
    }
    else{
        return res.status(403).json({
            error : {
                message : "you doesnt have permision"
            },
            success : false,
            data : null
        })
    }
}