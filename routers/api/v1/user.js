const express = require("express");
const router = express.Router();

const controllers = require("../../../controllers/api/v1/user_controller");

router.post("/create", controllers.create);

router.get("/sign", controllers.sign);

module.exports = router;