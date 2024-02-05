const basketLogic = require("../app/basket")
const { checkStudent } = require("../app/course")

class basketController {
  async addProduct(req, res, next) {
    try {
      const courseID = req.params.id
      const isAvailable  = await basketLogic.CheckBasket(courseID , req.user.Id)
      const isStudent = await checkStudent(courseID , req.user.Id)
      console.log(isStudent);
      if (isStudent) {
        return res.status(400).json({
          success : false,
          error : {
            message : "You are student of this course , add this course to your basket may create a problem"
          },
          data : null
        })
      }
      if (isAvailable) {
        return res.status(400).json({
          success : false,
          error : {
            message : "You added this course to your basket recently"
          },
          data : null
        })
      }

      await basketLogic.addProduct(courseID, req.user.Id)
      return res.status(201).json({
        success: true,
        error: null,
        data: {
          message: "Course added to basket"
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async GetBasket(req,res,next){
      try {
        const basket = await basketLogic.findUserBasket(req.user.Id)
        return res.status(200).json({
          success : true,
          data : {
            basket
          },
          error : null
        })
      } catch (error) {
        next(error)
      }
  }
}

module.exports = new basketController()