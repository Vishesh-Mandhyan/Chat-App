const { text } = require("express");
const messageModel = require("../model/messageModel");

// adding message to the database 

module.exports.addMsg = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({
        status: true,
        message: "Message added successfully in the DB",
      });
    }
    return res.json({
        status: false,
        message: "Failed to add msg in the DB",
      });
  } catch (error) {
    res.json({status:false,message:error})
    next(error)
  }
};

// getting messages from the database 

module.exports.getMsg = async(req, res, next) => {
  try {
    const {from ,to} = req.body;
    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({updatedAt:1});
    const projectedMsgs = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMsgs);

  } catch (error) {
    res.json({status:false,message:error})
    next(error)
  }
};
