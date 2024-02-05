const { Router } = require("express");
const BasketController = require("../../controller/Basket.controller");
const { authChecker } = require("../../controller/authcontroller");

const basketRouter = Router()
basketRouter.get("/" , authChecker ,BasketController.GetBasket)

basketRouter.post("/add/:id" , authChecker ,BasketController.addProduct)


module.exports = basketRouter