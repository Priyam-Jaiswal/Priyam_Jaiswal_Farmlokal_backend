const router = require("express").Router();
const {register,login} = require("../controllers/authController");
const passport = require("passport");

router.post("/register",register);

router.post("/login",login);

router.get("/google",
 passport.authenticate("google",{scope:["profile","email"]})
);

router.get("/google/callback",
 passport.authenticate("google",{failureRedirect:"/"}),
 (req,res)=>{
   res.send("Google Login Success");
 });

module.exports = router;
