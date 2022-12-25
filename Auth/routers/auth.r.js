const app = require("express");
const router = app.Router();

const authController = require("../controllers/auth.c");

router.get("", (req, res) => res.send("hihi"));
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

module.exports = router;
