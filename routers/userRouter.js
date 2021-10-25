const router= require('express').Router();
const User=require('../models/userModel');
const encrypt=require('../ketrika/hashClass');
const jwt=require('jsonwebtoken');


router.post("/",async (req,res)=>{
    try{
        const {email,password,passwordVerify}=req.body;

        //validation
        if(!email || !password || !passwordVerify)
            return res.status(400).json({errorMessage:"Please enter all required fields"});
        if(password.length<6)
            return res.status(400).json({errorMessage:"Please enter a password of at least 6 characters"});
        if(password!=passwordVerify)
            return res.status(400).json({errorMessage:"Please enter the same password twice"});

        const existingUser=await User.findOne({email:email})
        if(existingUser){
            return res.status(400).json({
                errorMessage:"An account with this email is already exists"
            })
        }

        //hash password
        const passwordHash=encrypt(password);

        //save the new user account to the db
        const newUser=new User({
            email,passwordHash
        })
        const saveUser=await newUser.save();

        //log the user in
         //sign the token
        const token=jwt.sign({
            user:saveUser._id
        },process.env.JWT_SECRET);
         //save the token in http-only
        res.send("token",token,{
            httpOnly:true
        })

    }catch(err){
        console.error(err);
        res.status(500).send();
    }
});

module.exports=router;