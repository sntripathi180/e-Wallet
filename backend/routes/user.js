const express = require("express");
const zod = require("zod");
const { JWT_SECRET } = require("../config");

const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = express.Router();


const signupSchema = zod.object({
    username: zod.string().email(),
    password : zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})
router.post("/signup",async(req,res)=>{
    
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message:"Email already taken /Incorrect inputs 1"
        })
    }

    const existingUser =await User.findOne({
        username: req.body.username
    })

    if(existingUser) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs 2"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    const balance = 1 + Math.random() * 10000;
    console.log("Generated balance:", balance); // Debugging log
    
    if (isNaN(balance)) {
        return res.status(500).json({ message: "Balance generation failed" });
    }
    
    await Account.create({
        userId,
        balance: balance
    });
    

    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
            message:"User created successfully",
            token: token 
        })
    
})

const signinBody = zod.object({
    username:zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req,res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs 3"
        })
    }
    
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET);

        res.json({
            token : token
        })
        return;
    }

    res.status(411).json({
        message:"Error while logging in "
    })

})

const updateBody = zod.object({
    password : zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authMiddleware,async (req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    // await User.updateOne(req.body,{
    //     _id: req.userId
    // })
    //corrected
    await User.updateOne(
        { _id: req.userId },  // Find by authenticated user ID
        { $set: req.body }    // Update with provided data
    );


    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    if (!filter) {
        return res.json({ user: [] });
    }

    // Fix: Change 'user' to 'users' for clarity
    const users = await User.find({
        $or: [
            { firstName: { "$regex": "^" + filter, "$options": "i" } },
            { lastName: { "$regex": "^" + filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({  // ✅ Changed 'users' here
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me",authMiddleware,async (req,res) => {
    try{
        const user = await User.findById(req.userId).select("firstName lastName username");

        if(!user){
            return res.status(404).json({message :"User not found"});
        }
        res.json(user);
        
    }catch(error){
        console.error("Error fetching usser details: ",error);
        res.status(500).json({message:"Internal Server Error"})
    }
});

module.exports = router;