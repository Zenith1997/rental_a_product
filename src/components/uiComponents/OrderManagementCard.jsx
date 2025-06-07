/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosAuth from '../../lib/auth'
import { toast } from 'react-toastify'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'

const OrderManagementCard = ({ order,onActionComplete }) => {
    const auth = useAuthUser();
    const userId = auth?.id;
    console.log("order value", order)
    const navigate = useNavigate()
    const axiosAuth = useAxiosAuth()

    const handleTrackOrder = () => {
        navigate(`/ordermanagement/${order.id}`);
    };

    /**
     * Handles the acceptance of an order
     * Makes API call to accept the order and shows appropriate feedback
     */
    const handleAcceptOrder = async () => {
        try {
            console.log("yyoyo")
            const response = await axiosAuth.post(
                `${import.meta.env.VITE_BASE_URL}/api/orders/order_handle_by_seller`,
                {
                    orderId: order.id,
                    action: "accept",
                    rejectReason: "rejected by seler" // Empty since this is for accepting
                }
            );
            
            if (response.status === 200) {
                toast.success('Order accepted successfully', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onActionComplete();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept order', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleREjectOrder = async () => {
        console.log("yyoyo")
        try {
            const response = await axiosAuth.post(
                `${import.meta.env.VITE_BASE_URL}/api/orders/order_handle_by_seller`,
                {
                    orderId: order.id,
                    action: "reject",
                    rejectionReason: "rejected by seller" // Empty since this is for accepting
                }
            );
            
            if (response.status === 200) {
                toast.success('Order rejected successfully', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onActionComplete();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject order', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleConfirmExtension = async () => {
        try {
            const response = await axiosAuth.post(
                `${import.meta.env.VITE_BASE_URL}/api/orders/process_order_extension`,
                {
                    orderId: order.id,
                    sellerId: userId,
                    action: "accept", 
                    newEndDate: order.last_extend_date
                }
            );
            
            if (response.status === 200) {
                toast.success('Extension request accepted successfully', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onActionComplete();
               // window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept extension request', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    const handleRejectExtension = async () => {
        try {
            const response = await axiosAuth.post(
                `${import.meta.env.VITE_BASE_URL}/api/orders/process_order_extension`,
                {
                    orderId: order.id,
                    sellerId: userId,
                    action: "reject", 
                    rejectReason: "Rejected by seller",
                    newEndDate: order.last_extend_date
                }
            );
            
            if (response.status === 200) {
                toast.success('Extension request rejected successfully', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onActionComplete();
               // window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject extension request', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    const handleConfirmDelivery = async () => {
        try {
            const response = await axiosAuth.get(
                `${import.meta.env.VITE_BASE_URL}/api/orders/confirm_delivery/${order.id}`
            );
            
            if (response.status === 200) {
                toast.success('Order delivery confirmed successfully', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onActionComplete();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm order delivery', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    if(!order.product){
        return null
    }
    const getRentalPeriod = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate - startDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // in days
    };
    
    // Usage
    const rentalPeriod = getRentalPeriod(order?.st_date, order?.end_date);
    
    return (
        <div className='px-2 pt-4 rounded-md border border-[#CCD2D9]'>
            <h3 className='text-[#67778C] '>Order ID: <span className='text-[#000000] ml-4 font-medium'>#{order?.id}</span></h3>
            <div className='flex items-center pb-4 gap-10 mt-3 justify- w-full'>
                <div className=' w-1/5 ' >
                    <h3 className='text-[#67778C] '>Rentee name:</h3>
                    <h2 className='text-[#000000]'>{order?.full_name}</h2>
                </div>
                <div className=' w-1/5 ' >
                    <h3 className='text-[#67778C] '>Rental item:</h3>
                    <h2 className='text-[#000000]'>{order?.product.product_name}</h2>
                </div>
                
                <div className=' w-2/5 ' >
                    <h3 className='text-[#67778C] '>Rental Period:</h3>
                    <h2 className='text-[#000000]'>{rentalPeriod}</h2>
                </div>
                <div className='ml-auto w-1/5 ' >
                    <h3 className='text-[#67778C] '>Order status:</h3>
                    <h2 className='text-[#1A3353] '>{order?.status.status_name}</h2>
                </div>
            </div>
            {order?.status?.id === 1 && (
                <div className='flex gap-10 w-fit items-center'>
                    <button onClick={handleAcceptOrder} className="bg-[#D10002] text-[#FFF] px-10 py-2 mb-4 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200">Accept order</button>
                    <button onClick={handleREjectOrder} className="bg-[#E6E8EC] text-[#211951] font-medium px-10 py-2 mb-4 rounded-md shadow-md w-48 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">Cancel order</button>
                </div>
            )}
            {order?.status?.id === 11 && (
                <div className='flex gap-10 w-fit items-center'>
                    <button onClick={handleConfirmExtension} className="bg-[#D10002] text-[#FFF] px-10 py-2 mb-4 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200">Confirm extension</button>
                    <button onClick={handleRejectExtension} className="bg-[#E6E8EC] text-[#211951] font-medium px-10 py-2 mb-4 rounded-md shadow-md w-48 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">Reject extension</button>
                </div>
            )}
               {order?.status?.id === 5 && (
                <div className='flex gap-10 w-fit items-center'>
                    <button onClick={handleConfirmDelivery} className="bg-[#D10002] text-[#FFF] px-10 py-2 mb-4 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200">Confirm delivery</button>
                
                </div>
            )}
            
        </div>
    )
}

export default OrderManagementCard