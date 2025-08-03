import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {

    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext);
    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            // user not logged in
            if(!token) {
                return null;
            }   

            const response = await axios.post(backendUrl+'/api/order/verifyStripe', {success,orderId},{headers:{token}});
            
            // empty cart and send back to orders
            if(response.data.success) {
                setCartItems({});
                navigate('/orders')
            } else {
                navigate('/cart') // send back to cart to try again
            }
        
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    
    useEffect(() => {
        verifyPayment();
    }, [token]);

  return (
    <div>
     
    </div>
  )
}

export default Verify
