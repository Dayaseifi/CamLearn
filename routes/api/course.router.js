const { Router } = require("express");
const courseController = require("../../controller/course.controller");
const { authChecker } = require("../../controller/authcontroller");
const privacy = require("../../app/privacy");
const banner = require("../../utils/file/banner");
const upload = require("../../utils/file/multerConfig");
const paymentController = require("../../controller/payment.controller");

const router = Router()


router.get("/", courseController.getAllCourse)

router.get("/c/:id", courseController.getCourse)

router.get("/handle/verify", authChecker, paymentController.verifyPayment)


router.post("/create", authChecker, async function (req, res, next) {
    try {
        //Teacher ID is {2}
        const hasPermission = await privacy.RoleChecker(req, 2)
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                error: {
                    messaging: "does not have permission"
                },
                data: null
            });
        }
        next();
    } catch (error) {
        return next(error);
    }
}, banner.single('banner'), courseController.Create)

router.post("/upload/video/:id", authChecker, async function (req, res, next) {
    try {
        //Teacher ID is {2}
        const hasPermission = await privacy.RoleChecker(req, 2)
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                error: {
                    messaging: "does not have permission"
                },
                data: null
            });
        }
        next();
    } catch (error) {
        return next(error);
    }
}, upload.single('video'), courseController.AddVideo)

router.post("/buy/:id", authChecker, async function (req, res, next) {
    try {
        //User ID is {1}
        const hasPermission = await privacy.RoleChecker(req, 1)
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                error: {
                    messaging: "does not have permission"
                },
                data: null
            });
        }
        next();
    } catch (error) {
        return next(error);
    }
},
    courseController.BuyCourse)

router.post("/handle/payment/:id", authChecker, paymentController.handlePayment)





module.exports = router