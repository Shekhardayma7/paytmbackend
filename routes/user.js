const express = require("express");
const zod = require("zod");
const {User} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
;
// const {aut,authMiddleware}=require("..,authMiddleware.js")
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()
})


router.post("/signup", async (req, res) => {
    const body = req.body;
    
    const {success} = signupSchema.safeParse(body);
    console.log(success)
    if(!success){
        return res.json({
            message : "incorrect username and passsword or error in the schema"
        })
    }
    console.log(User);

    const user = await User.find({
        username : body.username
    })
console.log(user)
    if(user._id){
        return res.json({
            message : "email already taken / incorrect inputs"
        }) 
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET);

    res.json({
        message : "user created successfully",
        token : token
    })
})

router.get("/",authMiddleware,async (req,res)=>{
    // const userID=req.decoded.userId;
    const user=await User.find()
    // const user=await User.findOne({_id:userID});
    console.log(user)

    // const users=[]
    // // for(i=0;i<user.length;i++){
    //     users.push(user.username)
    //     users.push(user.firstname)
    //     users.push(user.lastname)
    // // }


    res.json({data:user});
})

const signinschema = zod.object({
    username : zod.string(),
    password : zod.string()
})

router.post("/signin", async (req,res) => {
    const body=req.body
    console.log(body)
    const success = signinschema.safeParse(body)
    console.log(success)
    if(!success.success){
        return res.status(411).json({
            msg : success
        })
    }
    const user = await User.findOne({
        username : body.username,
        password : body.password
    });

    if(user){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET)

        res.json({
           token : token 
        })
        return; 
    }
    console.log(user)

    res.status(411).json({
        message : "error while logging in "
    })
})
const updateschema = zod.object({
    username : zod.string().optional(),
    password : zod.string().optional(),
    firstname : zod.string().optional(),
    lastname : zod.string().optional(),
})
router.put("/update",authMiddleware, async(req,res)=>{
const body = req.body
const {success} = updateschema.safeParse(body);
if(!success){
    return res.status(411).json({
        msg : "error while updating input information"
    })
}
console.log(req.body.username, req.body.password)

const user= await User.updateOne({_id:req.decoded.userId},body)
// const users=await User.findOne({_id:req.decoded.userId})
// console.log(users)
res.json({
    msg: "user updated successfully "
})
})

// {
//     users : [{
//         firstname : "",
//         lastname : "",
//         _id : "id of the user"
//     }]
// }

router.get("/bulk",authMiddleware, async (req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstname : {
                "$regex" : filter
            }
        },{
            lastname : {
                "$regex" : filter
            }
        }]
    })

    console.log(users)

    Userss=[]

    user=users.map((user)=>{
        
        Userss.push(user.firstname+" "+user.lastname)
        // Userss.push(user.lastname)

    })
    res.json({
        users :Userss
    })
})

module.exports= router;