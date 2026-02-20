import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup=async (req,res)=>{
    const {email,fullName,password}=req.body;
    try{
       if(!email || !fullName || !password){
        return res.status(400).json({message:"All fields are required"});
       }
       if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
       }
       const user=await User.findOne({email});
       if(user){
        return res.status(400).json({message:"User already exists"});
       }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User({
            email,
            fullName,
            password:hashedPassword
        });
         if(newUser){
            const token=generateToken(newUser._id,res);
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                fullName:newUser.fullName,
                profilePic: newUser.profilePic,
                token,
                message:"User created successfully"
            });
         }
         else{
            res.status(400).json({message:"Invalid user data"});
         }
    }catch(error){
         console.error("Signup error:",error);
         res.status(500).json({message:"Server error"});
    }
    
}
export const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
       const user=await User.findOne({email});
         if(!user){
            return res.status(400).json({message:"Invalid email or password"});
         }
         const isPasswordMatch=await bcrypt.compare(password,user.password);
         if(!isPasswordMatch){
            return res.status(400).json({message:"Invalid email or password"});
         }
         generateToken(user._id,res);
            res.status(200).json({
                _id:user._id,
                email:user.email,
                fullName:user.fullName,
                message:"Login successful",
                profilePic:user.profilePic,
                createdAt: user.createdAt,
               updatedAt: user.updatedAt 
            });
    }catch(error){
        console.error("Login error:",error);
        res.status(500).json({message:"Server error"});
    }

    
}
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logout successful"});
    }
    catch(error){
        console.error("Logout error:",error);
        res.status(500).json({message:"Server error"});
    }
}
export const updateProfile=async (req, res)=>{
  try{
     const {profilePic}=req.body;
     const userId=req.user._id;
     if(!profilePic){
        return res.status(400).json({message:"Profile picture is required"});
     }
     const uploadResponse=await cloudinary.uploader.upload(profilePic)
     const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}).select("-password");
     res.status(200).json({updatedUser});
  }catch(error){
    console.error("Update profile error:",error);
    res.status(500).json({message:"Server error"});
  }
}

export const checkAuth=(req,res)=>{
   try{
    res.status(200).json({user:req.user});
   }catch(error){
    console.error("Check auth error:",error);
    res.status(500).json({message:"Server error"});
   }
}