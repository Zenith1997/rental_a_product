/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Star } from '@mui/icons-material';
import ReviewCard from '../../components/uiComponents/ReviewCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Divider } from '@mui/material';
import axios from 'axios';


import useAxiosAuth from '../../lib/auth';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const ReviewsPage = () => {
    const [active, setActive] = useState("positive");
    const [negativeReviews, setNegativeReviews] = useState([]);
    const [positiveReviews, setPositiveReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const axiosAuth = useAxiosAuth();
    const auth = useAuthUser();
    const userId = auth?.id||{};
    console.log("userId", userId);

    // Fetch both positive and negative reviews on mount or when userId changes
    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/user/get_all_reviews`, {
            params: {
                selerId: userId,
                rtype: active, // "positive" or "negative"
                page: 1,
                limit: 10
            }
        })
        .then(res => {
            if (active === "positive") {
                setPositiveReviews(res.data.reviews || []);
            } else {
                setNegativeReviews(res.data.reviews || []);
            }
            setLoading(false);
        })
        .catch(err => {
            setError('Failed to load reviews');
            setLoading(false);
        });
    }, [userId, active]);

    // Select reviews based on the active tab
    const filteredReviews = active === "positive" ? positiveReviews : negativeReviews;

    // Use only the currently selected tab's reviews for stats
    const allReviews = filteredReviews;

    // Count for each star (1-5)
    const totalReviews = allReviews.length;
    const ratingTable = [5, 4, 3, 2, 1].map(star => ({
        stars: star,
        percentage: totalReviews ? Math.round(
            (allReviews.filter(r => Math.round(r.rating) === star).length / totalReviews) * 100
        ) : 0
    }));

    // Average rating
    const averageRating = totalReviews
        ? (allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews).toFixed(1)
        : "0.0";

    return (
        <div className='h-full flex justify-between gap-10 '>
            <div className='w-1/2'>
                <div className="flex p-1 justify-between bg-red-100 rounded-full">
                    <button
                        onClick={() => setActive("positive")}
                        className={`px-8 w-1/2 py-3 rounded-full font-medium ${active === "positive" ? "bg-[#D10002] text-white" : " text-[#1A3353]"
                            }`}
                    >
                        Positive reviews
                    </button>
                    <button
                        onClick={() => setActive("negative")}
                        className={`px-8 w-1/2 py-3 rounded-full font-medium ${active === "negative" ? "bg-[#D10002] text-white" : " text-[#1A3353]"
                            }`}
                    >
                        Negative reviews
                    </button>
                </div>

                {/* Render filtered reviews */}
                <div>
                    {loading && <div className="py-8 text-center">Loading...</div>}
                    {error && <div className="py-8 text-center text-red-500">{error}</div>}
                    {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>

            <div className='w-1/2 p-4   '>

                <div className="py-8 rounded-3xl p-6 border shadow-md max-w-lg mx-auto bg-white">
                    {/* Header Section */}
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-5 mb-3">
                        <div className="flex flex-col  mr-6 w-1/2">
                            <h2 className=" text-md font-medium mb-1 ">Total Reviews</h2>
                            <div className="flex items-center">
                                <h1 className="text-5xl font-semibold  mr-2">{totalReviews}</h1>
                                <span className="flex items-center bg-[#4D6079] text-white py-1 px-2 rounded-md text-xs font-medium">
                                    21% <TrendingUpIcon className="ml-1" fontSize="small" />
                                </span>
                            </div>
                            <span className="text-[#99A4B3] text-xs mt-4">Growth in reviews on this year</span>
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <div className="flex flex-col ml-6 w-1/2">
                            <h2 className=" text-md font-medium mb-1 ">Average Rating</h2>
                            <div className="flex items-center">
                                <h1 className="text-5xl font-semibold  mr-2">{averageRating}</h1>
                                <Star className="text-yellow-400" fontSize="large" />
                            </div>
                            <span className="text-[#99A4B3] text-xs mt-4">Average rating on this year</span>
                        </div>
                    </div>

                    {/* Rating Bars Section */}
                    <div className="space-y-4">
                        {ratingTable.map(({ stars, percentage }, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="flex w-1/4">
                                    {Array.from({ length: stars }).map((_, idx) => (
                                        <Star key={idx} className="text-yellow-400 text-sm" fontSize="small" />
                                    ))}
                                </div>
                                <div className='w-3/6 '>
                                    <div className="w-full bg-[#F0F3FF] rounded-full h-2 flex-grow">
                                        <div
                                            className="bg-[#4D6079] h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-sm ml-3 font-medium text-[#99A4B3]">{percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div >
    );
};

export default ReviewsPage;
