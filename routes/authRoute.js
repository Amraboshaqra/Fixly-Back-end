const express = require('express')
const router = express.Router()
const auth = require("../controllers/authController")


router.post("/signup",auth.signup)
router.post("/login",auth.login)
router.get("/logout",auth.logout)



module.exports = router
