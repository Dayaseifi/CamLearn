const courseLogic = require("../app/course")
const { GetUserByRefreshToken } = require("../app/user.app")

class courseController {
    async Create(req, res, next) {
        try {
            const { CourseName, CourseDescription, Price } = req.body
            const course = await courseLogic.findByName(CourseName)
            if (course) {
                return res.status(400).json({
                    data: null,
                    error: {
                        message: "course is available"
                    },
                    success: false
                })
            }
            const ID = await courseLogic.create(req.user.Id, CourseName, CourseDescription, Price)
            const src = `http://localhost:3000/public/upload/${req.file.filename}`
            await courseLogic.UploadBanner(src, req.file.filename, ID)
            return res.status(201).json({
                success: true,
                error: null,
                data: {
                    message: "Course created",
                    id: ID
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async AddVideo(req, res, next) {

        let id = req.params.id
        const title = req.body.title
        const src = `http://localhost:3000/public/upload/${req.file.filename}`
        const Id = await courseLogic.UploadVideos(src, req.file.filename, id, title)
        return res.status(200).json({
            error: null,
            success: true,
            data: {
                message: "Videos Uploaded",
                Id
            }
        })
    }
    async getCourse(req, res, next) {
        try {
            const id = req.params.id
            const course = await courseLogic.findByID(id)
            if (!course) {
                return res.status(404).json({
                    error: {
                        message: "course doestn find"
                        ,
                        success: false,
                        data: null
                    }
                })
            }
            const isLogin = typeof req.cookies?.jwt == 'undefined' ? false : true
            let Files = await courseLogic.Files(course.ID)

            let banner = Files.filter(e => {
                return e.IsBanner == 1
            })[0]
            let data = {
                course, banner
            }

            let hasPermission = false

            if (isLogin) {
                const user = await GetUserByRefreshToken(req.cookies?.jwt)
                const isStudentOf = await courseLogic.checkStudent(course.ID, user.Id)
                
                if (course.Teacher_ID == user.Id || isStudentOf) {
                    hasPermission = true
                    let videos = Files.filter(e => {
                        return e.IsBanner == 0
                    })
                    const length = videos.length
                    course.videoLength = length
                    data = {
                        course,
                        banner,
                        videos
                    }

                }

                return res.status(200).json({
                    success: true,
                    data: {
                        data,
                        hasPermission
                    },
                    error: null
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    data: {
                        data,
                        hasPermission
                    },
                    error: null
                })
            }

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    async getAllCourse(req, res, next) {
        try {
            const page = req.query.page || 1
            const dataCount = 10
            const courses = await courseLogic.allCoure(page, dataCount)
            return res.status(200).json({
                error: null,
                success: true,
                data: {
                    courses
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async SearchCourse(req,res,next){
        const word = req.query.word
        console.log(word);
        if (!word) {
            return res.status(302).json({
                success : true,
                error : null,
                data : {
                    url : "http://localhost:3000/"
                }
            })
        }
        const course = await courseLogic.search(word)
        return res.status(200).json({
            success : true,
            error : null,
            data : {
                course
            }
        })
    }
}

module.exports = new courseController