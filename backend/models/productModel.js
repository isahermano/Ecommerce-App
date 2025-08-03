import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true}, // required to provide name to save in data base
    description: {type:String, required:true},
    price: {type:Number,required:true},
    image: {type:Array,required:true}, // store multiple images
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    sizes: {type:Array,required:true},
    bestSeller: {type:Boolean},
    date: {type:Number,required:true}
})

const productModel =  mongoose.models.product || mongoose.model("product",productSchema); // if product model is avail, use it, else it creates new model

export default productModel