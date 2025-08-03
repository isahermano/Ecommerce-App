import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets"; // used frrom developing front end, but no longer need it after linking backend with front end
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'; 

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(true);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId,size) => {

        if(size === ' ') {
            toast.error("Select Product Size");
            return;
        }

        let cartData = structuredClone(cartItems);

        { /* case 1: item is in cart */}
        if(cartData[itemId]) {
            { /* case 1.5: item of same size is in cart */}
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            { /* case 2: item isn't in cart */}
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        // check if token avail ie logged in
        if(token) {           
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems) {
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch(error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        // checks that it is logged in
        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity}, {headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems) {
            let itemInfo = products.find((product)=>product._id === items);
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        {/* sum up price and quantity of a certain item in cart */}
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems])

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            
            if(response.data.success) {
                setProducts(response.data.products);   
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}});
            if(response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getProductsData();
    },[])

    // allows us to stay logged in
    useEffect(()=>{
        if(!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token')); // logged in so can get used cart
        }
    },[])

    const value ={
        products, currency, delivery_fee, 
        search, setSearch, showSearch, setShowSearch, 
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;