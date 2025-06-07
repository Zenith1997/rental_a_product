/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import SearchBar from '../../components/Header/SearchBar'
import WishlistItemCard from '../../components/uiComponents/WishlistItemCard'
import useFetcher from '../../lib/fetcher'
import useSWR from 'swr'
import apiRoutes from '../../lib/apiRoutes'
import { Typography } from '@mui/material'
import { RiseLoader } from "react-spinners"

const WishlistPage = () => {
    const [items, setItems] = useState([])
    const fetcher = useFetcher()
    const { data: wishlistData, error, isLoading, mutate } = useSWR(
        apiRoutes.getWishList({ page: 1, limit: 10 }), 
        fetcher
    )

    useEffect(() => {
        if (wishlistData?.data) {
            setItems(wishlistData.data)
        }
    }, [wishlistData])

    const handleRefresh = () => {
        mutate(); // This will trigger a re-fetch of the wishlist data
    };

    return (
        <div className='w-full min-h-screen bg-gray-50 flex flex-col items-center'>
             <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
            {/* <SearchBar /> */}
            <div className='w-full shadow-sm mt-1 border-t py-10 flex flex-col items-center bg-white'>
                <Typography variant="h5" className="mb-8 font-semibold text-gray-800">
                    My Wishlist
                </Typography>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <RiseLoader color="#fd3c3c" />
                    </div>
                ) : error ? (
                    <Typography color="error" className="text-center">
                        Error loading wishlist items. Please try again later.
                    </Typography>
                ) : items?.length === 0 ? (
                    <Typography className="text-center text-gray-600">
                        Your wishlist is empty. Add some items!
                    </Typography>
                ) : (
                    <div className='w-[90%] max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {items.map((item) => (
                            <WishlistItemCard key={item.id} item={item} onRefresh={handleRefresh} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage