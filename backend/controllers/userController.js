const jwt = require('jsonwebtoken')
const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const User = require("../models/userModel")

const registerUser = asyncHandler( async(req,res) => {
    
    const {name , email , password} = req.body

    if(!name || !email ||!password){
        res.status(400)
        throw new Error("Please Fill All Details")
    }

    // Validations

    // Find if user already exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User Already Exists')
    }

    // Hash Password

    const salt =  await  bcrypt.genSalt(10)
    const hashedPassword = await  bcrypt.hash(password , salt)

    // create user
    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name : user.name,
            email:user.email,
            token : generateToken(user._id)
        })   
    }else{
        res.status(400)
        throw new Error("Invalid User Data")
    }

   
})

const loginUser = asyncHandler(async(req,res) => {
   const {email , password} = req.body

//    check username & password

const user = await User.findOne({email})

if(user && await (bcrypt.compare(password , user.password))){
    res.status(200).json({
        _id: user._id,
        name : user.name,
        email : user.email,
        token : generateToken(user._id)
    })
}else{
    res.status(401)
    throw new Error("Invalid Credentials")
}
})


// getMe

const getMe = asyncHandler(async(req,res)=>{
    const user = {
        id : req.user.id,
        email : req.user.email,
        name : req.user.name
    }
    res.status(200).json(user)
})




// token generation

const generateToken = (id) => {

    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : "30d"
    })

}



module.exports = {registerUser , loginUser , getMe}