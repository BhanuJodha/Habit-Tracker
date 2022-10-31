const express = require("express");
const router = express.Router();

const controllers = require("../../../controllers/api/v1/status_controller");

router.get("/fetch", controllers.fetch);

router.get("/fetch-all", controllers.fetchAll);

router.post("/toggle", controllers.toggle);

module.exports = router;