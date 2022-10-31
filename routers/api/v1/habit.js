const express = require("express");
const router = express.Router();

const controllers = require("../../../controllers/api/v1/habit_controller");

router.get("/fetch", controllers.fetch);

router.get("/fetch-with-status", controllers.fetchWithStatus);

router.post("/add", controllers.add);

router.delete("/remove", controllers.remove);

router.patch("/toggle-fav", controllers.toggleFav);

module.exports = router;