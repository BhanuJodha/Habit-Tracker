const express = require("express");
const router = express.Router();

router.use("/api", require("./api/index"));

router.get("/", require("../controllers/home_controller").home);

router.get("/details", require("../controllers/details_controller").details)

module.exports = router;