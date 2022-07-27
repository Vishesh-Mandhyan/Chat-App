const {addMsg,getMsg} = require('../controllers/messagesControllers')
const router = require("express").Router();

router.post("/addmsg", addMsg);
router.post("/getmsgs", getMsg);

module.exports=router;
