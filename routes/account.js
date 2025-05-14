const express = require("express");
const authMiddleware = require("../middleware");
const {Account,User} = require('../db');
const mongoose = require("mongoose");
const { Console } = require("console");

const router = express.Router();

router.get("/balance", authMiddleware, async(req, res) => {
    // console.log(req.decodeduserId)
   const account = await Account.findOne({
      userId : req.decoded.userId
   });
   console.log(account)

   res.json({
    balance : account.balance
   })

})

router.post("/transfer", authMiddleware, async(req,res) =>{
    // const session = await mongoose.startSession();

    // session.startTransaction();
    const {amount,to} = req.body;
    //fetch the account within the transaction 

    const account = await Account.findOne({userId: req.decoded.userId});
    console.log(to)
    if(!account || account.balance < amount){
        // await session.abortTransaction()
        return res.status(400).json({
            message : "insufficient balance"
        })
    }

    const user = await User.findOne({username:to});
    console.log(user);

    const id=user._id;
    console.log(id)
    const toAccount=await Account.findOne({userId:id})

    console.log(toAccount)
    if(!toAccount){
        // await session.abortTransaction();
        return res.status(404).json({
            message : "invalid account"
        });
    }

    await Account.updateOne({userId : req.decoded.userId},{$inc: {balance : -amount}})
    await Account.updateOne({username: to}, {$inc :{balance : amount} } );

    // await session.commitTransaction();
    res.json({
        msg: "Transfer successful"
    });
})

module.exports=router;
