import userModel from "../models/userModel.js"

// add products to user cart
const addToCart = async (req,res) => {
    try {
        const {userId, itemId, size} = req.body;

        const userData = await userModel.findById(userId); // userId from req.body
        let cartData = await userData.cartData; // use let op bc performing operations

        if(cartData[itemId]) {
            // item is in cart
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1; // increase quantity by 1 for that size
            } else {
                // item's size not in cart, add it
                cartData[itemId][size] = 1;
            }
        } else {
           cartData[itemId] = {}; // create new object got item
           cartData[itemId][size] = 1; // add size
        }   
        await userModel.findByIdAndUpdate(userId, {$set: {cartData}});        
        res.json({success:true, message:"Added to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        const {userId, itemId, size, quantity} = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, {$set: {cartData}});
        res.json({success:true, message:"Cart Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// get user cart data
const getUserCart = async (req,res) => {
    try {
        const {userId} = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        res.json({success:true, cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {addToCart, updateCart, getUserCart}