/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

const ReviewCard = ({ review }) => {
    const { pathname } = useLocation();

    return (
        <div
            className={`my-4 shadow-sm p-4 rounded-lg ${pathname === '/reviews' ? 'w-full' : 'w-[45%]'}`}
        >
            <div className='w-full'>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            className="w-12 h-12 mr-3 rounded-full object-cover"
                            src={review.userImage}
                            alt={`${review.username}'s profile`}
                        />
                        <div>
                            <h1 className="text-sm font-bold">{review.username}</h1>
                            <h1 className="text-[#626060] text-xs">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </h1>
                        </div>
                    </div>
                    <div>
                        {Array.from({ length: 5 }, (_, index) => (
                            <span
                                key={index}
                                style={{
                                    color: index < review.rating ? 'gold' : '#ccc',
                                    fontSize: '14px',
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <h2 className="text-[#67778C] mt-2 text-xs">
                    {review.comment}
                </h2>
                {pathname === '/reviews' &&
                    <div className='flex items-center w-full'>
                        <button className='ml-auto border border-[#E3DBDB] rounded-md py-1 text-sm shadow-md px-3'>Comment</button>
                        <div className='border ml-4 rounded-md'>
                            <Checkbox 
                                sx={{ fontSize: 15, padding: 0.5 }} 
                                icon={<FavoriteBorder sx={{ fontSize: 15 }} />} 
                                checkedIcon={<Favorite sx={{ color: 'red', fontSize: 15 }} />} 
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ReviewCard;
