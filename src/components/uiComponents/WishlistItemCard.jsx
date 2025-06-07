/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useNavigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAxiosAuth from "../../lib/auth";
import { CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';

const WishlistItemCard = ({ item, onRefresh }) => {     
    const [isLoading, setIsLoading] = useState(false);
    const axiosAuth = useAxiosAuth();
    const auth = useAuthUser();
    const navigate = useNavigate();

    const handleRentNowBtn = (e) => {
        e.stopPropagation();
        navigate("/rentitem", { state: { item } });
    };

    const handleRemove = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            const response = await axiosAuth.delete(
                `${import.meta.env.VITE_BASE_URL}/api/products/remove_wishlist_product`,
                {
                    data: {
                        productId: item?.productId
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Item removed from wishlist', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onRefresh(); // Call the refresh function after successful removal
            }
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            onRefresh();
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="w-full flex border-[#E6E8EC] border rounded-xl p-4 items-center bg-white hover:shadow-lg transition-shadow duration-200 "
            onClick={() => navigate(`/product/${item.productId}`, { state: { item } })}
        >
            {/* Image Section */}
            <div className="w-1/3 h-32 mr-6">
                <img
                    className="w-full h-full object-cover rounded-lg"
                    src={item?.product?.images[0]}
                    alt={item?.name}
                    loading="lazy"
                />
            </div>

            <div className="flex-grow flex justify-between">
                {/* Product Details */}
                <div className="space-y-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                        {item.category}
                    </span>
                    
                    <h1 className="text-xl text-gray-900 font-semibold line-clamp-2">
                        {item.name}
                    </h1>
                    
                    <p className="text-gray-700 font-bold">
                        ${item.price}
                        <span className="text-gray-500 text-sm ml-1">/month</span>
                    </p>
                    
                    <div className="flex items-center">
                        <span className="text-yellow-400 text-xl">★</span>
                        <span className="text-sm ml-1 text-gray-700 font-medium">
                            {item.ratings}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-between items-end ml-4">
                    <button
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="error" />
                        ) : (
                            <DeleteForeverOutlinedIcon />
                        )}
                    </button>

                    <button
                        onClick={handleRentNowBtn}
                        className="bg-[#E36667] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#d55657] transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Rent Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistItemCard;
