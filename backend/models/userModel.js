import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cartData: {type:Object, default:{}}, // new user has empty cart
},{minimize:false}) // creates cart data using empty object (doesnt display in mongo(?))

const userModel = mongoose.models.user || mongoose.model('user',userSchema); // creates user model

export default userModel