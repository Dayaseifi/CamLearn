const { Router } = require("express");
const adminPanel = require("../../controller/adminPanel");
const privacy = require("../../app/privacy");
const { authChecker } = require("../../controller/authcontroller");

const router= Router()





//superadmin
router.post("/s/improving" , authChecker , async function (req , res , next) {
    try {
        const hasPermission = await privacy.RoleChecker(req, 3)
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
} , adminPanel.ImproveTo)

module.exports = router