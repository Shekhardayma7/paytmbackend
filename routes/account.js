const express = require("express");
const {authMiddleware} = require("../middleware");
const {Account} = require('../db');
const mongoose = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async(req, res) => {
   const account = await Account.findOne({
      userId : req.userId
   });

   res.json({
    balance : account.balance
   })

})

router.post("/transfer", authMiddleware, async(req,res) =>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount,to} = req.body;
    //fetch the account within the transaction 

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            message : "insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userId : to }).session(session)
})

module.exports=router;
