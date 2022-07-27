const {register,login,setAvatar,allContacts} = require('../controllers/userControllers')
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allcontacts/:id", allContacts);

module.exports=router;
