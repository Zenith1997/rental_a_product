/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchBar from '../../components/Header/SearchBar'
import profileCoverImg from '../../assets/images/profileCoverImg.png'
import { Box, Button, Skeleton, Typography, Tooltip } from '@mui/material';
import ReviewCard from '../../components/uiComponents/ReviewCard';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import ProfileListCard from '../../components/uiComponents/ProfileListCard';
import NumberOneIcon from '../../assets/svgFiles/NumberOneIcon';
import useSWR from 'swr';
import useFetcher from '../../lib/fetcher';
import apiRoutes from '../../lib/apiRoutes';
import { RiseLoader } from "react-spinners";
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosAuth from '../../lib/auth';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { fromUnixTime } from 'date-fns';

const UserProfilePage = () => {
  const auth = useAuthUser();

  const axiosAuth = useAxiosAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: sellerData,sellerId} = location.state || {};
  const fetcher = useFetcher();
 console.log("sellerId here is",sellerId)
const authUser = useAuthUser();
const loggedInUserId = authUser?.id;
const [showFollowButton, setShowFollowButton] = useState();
console.log("loggedInUserId",loggedInUserId)
  const { data:sellerDetails, error, isLoading } = useSWR(sellerData ? apiRoutes.getSellerProfile(loggedInUserId,sellerId) : null, fetcher);

  const initialfollow = sellerDetails?.data?.isFollowing;
  console.log("initialfollow",initialfollow)

  // Get follow status from localStorage or use initial value
  const [isFollowing, setIsFollowing] = useState(() => {
    const savedFollowStatus = localStorage.getItem(`followStatus_${sellerId}`);
    return savedFollowStatus !== null ? JSON.parse(savedFollowStatus) : initialfollow;
  });

  useEffect(() => {
    if (sellerDetails?.data?.isFollowing !== undefined) {
      setIsFollowing(initialfollow);
      setShowFollowButton(isFollowing)
      // Save to localStorage when initial value changes
      localStorage.setItem(`followStatus_${sellerId}`, JSON.stringify(initialfollow));
    }
  }, [initialfollow, sellerId]);

  // Update localStorage whenever isFollowing changes
  useEffect(() => {
    localStorage.setItem(`followStatus_${sellerId}`, JSON.stringify(isFollowing));
  }, [isFollowing, sellerId]);
  
  console.log("isFollowing",isFollowing);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Update isFollowing state when sellerDetails changes
console.log("show follow button",showFollowButton)

  console.log("sellerDetails",sellerDetails);
  console.log("loggedInUserId",loggedInUserId)
  if (!sellerDetails) {
    navigate('/'); // Redirect to home if no user data
    return null;
  }
 
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <RiseLoader color="#4870FF" />
        <Typography variant="body1" color="textSecondary">
          Loading profile...
        </Typography>
      </div>
    );
  }

  if (error || !sellerDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Typography variant="h6" color="error">
          Error loading profile
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleFollowAction = async () => {
    try {
      const action = 'follow';
      const response = await axiosAuth.post(`${import.meta.env.VITE_BASE_URL}/api/user/follow_unfollow`, 
        {
          "sellerId": sellerId,
          "followeeId": loggedInUserId,
          "action": action
        }
      );
    
      if (response.status === 201) {
        // Update follow count
    
      setShowFollowButton(false);
        
        // Show success message
        toast.success(`Successfully ${action}ed user!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Update following state
        setIsFollowing(isFollowing);
        setShowFollowButton(prev=>!prev)
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUnFollowAction = async () => {
    try {
      const action =  'unfollow';
      const response = await axiosAuth.post(`${import.meta.env.VITE_BASE_URL}/api/user/follow_unfollow`, 
        {
          "sellerId": sellerId,
          "followeeId": loggedInUserId,
          "action": action
        }
      );
      
      if (response.status === 200) {
        // Update follow count
      
        
        // Show success message
        toast.success(`Successfully ${action}ed user!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowFollowButton(prev=>!prev);
        // Update following state
        setIsFollowing(isFollowing);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (!sellerDetails?.data) {
    navigate('/'); // Redirect to home if no user data
    return null;
  }

  const {
    sellerDetails: userInfo,
    items = [],
    itemCount = 0,
    completedSalesCount = 0,
    followCount = 0,
    avgRating = "0.00",
    lastReview: reviews = []
  } = sellerDetails.data || {};

  // Ensure userInfo exists and has required properties
  if (!userInfo) {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleShowMoreReviews = () => {
    setShowAllReviews(true);
  };

  const displayedReviews = Array.isArray(reviews) 
    ? (showAllReviews ? reviews : reviews.slice(0, 3))
    : [];

  return (
    <div className='min-h-screen bg-gray-50'>
       <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
      <ToastContainer />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          p: 3,
          mb: 4
        }}>
          <div className="relative flex flex-col items-center w-full">
            <div className="relative w-full">
              <img 
                loading="lazy" 
                src={userInfo.profile_background_img || "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"} 
                alt="profile cover" 
                className='w-full h-[40vh] rounded-t-xl object-cover object-center'
              />
            </div>
            <div className="relative">
              <img
                loading="lazy"
                src={userInfo.profile_img || "https://as1.ftcdn.net/jpg/06/33/54/78/1000_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.webp"}
                alt="profile picture"
                className='w-32 h-32 rounded-full object-cover object-center -mt-16 border-4 border-white shadow-lg'
              />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <h1 className='text-2xl font-semibold flex gap-2 items-center justify-center'>
              {userInfo.username || 'Anonymous'} 
              <Tooltip title="Verified User">
                <VerifiedIcon sx={{ color: '#4870FF', fontSize: 24 }} />
              </Tooltip>
            </h1>
            <p className='text-sm text-gray-600 flex gap-2 items-center justify-center mt-1'>
              <NumberOneIcon /> Member since {formatDate(userInfo.createdAt)}
            </p>
          </div>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginY: 4,
              width: '100%',
              maxWidth: '800px'
            }}>
            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-2xl font-semibold text-[#211951]'>{String(itemCount)}</h1>
              <p className='text-sm text-gray-600'>Items</p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-2xl font-semibold text-[#211951]'>{String(followCount)}</h1>
              <p className='text-sm text-gray-600'>Followers</p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-2xl font-semibold text-[#211951]'>{String(completedSalesCount)}</h1>
              <p className='text-sm text-gray-600'>Complete Sales</p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <h1 className='text-2xl font-semibold text-[#211951]'>{Number(avgRating).toFixed(1)}</h1>
              <p className='text-sm text-gray-600'>Rating</p>
            </div>
          </Box>

          <div className="flex flex-row gap-3 items-center justify-center">
          <button
            onClick={() => navigate('/chat')}
            className="bg-transparent outline-none border-2 border-[#D10002] text-[#D10002] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:text-[#D10002] active:bg-transparent transition-colors duration-200"
          >
            Message
          </button>
 {!showFollowButton && <button
    onClick={handleFollowAction}
    className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
  >
    Follow
  </button>}
            {showFollowButton && <button
              onClick={handleUnFollowAction}
              className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
            >
              Unfollow
            </button>}
          </div>
        </Box>

        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          p: 3,
          mb: 4
        }}>
          <h1 className='text-2xl font-semibold mb-4'>About</h1>
          <p className='text-gray-700 text-sm leading-relaxed mb-4'>
            {userInfo.about || 'No description provided'}
          </p>
          <div className='flex flex-wrap gap-4 items-center'>
            <div className='flex items-center gap-2'>
              <LocationOnIcon sx={{ color: '#4870FF' }} />
              <span className='text-sm text-gray-600'>{userInfo.address_line_1 || 'No location provided'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <EmailIcon sx={{ color: '#4870FF' }} />
              <span className='text-sm text-gray-600'>{userInfo.email || 'No email provided'}</span>
            </div>
          </div>
        </Box>

        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          p: 3,
          mb: 4
        }}>
          <h1 className='text-2xl font-semibold mb-4'>Reviews</h1>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              {!showAllReviews && reviews.length > 3 && (
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outlined"
                    onClick={handleShowMoreReviews}
                    sx={{ 
                      minWidth: '190px',
                      borderColor: '#4870FF',
                      color: '#4870FF',
                      '&:hover': {
                        borderColor: '#3658CC',
                        backgroundColor: 'rgba(72, 112, 255, 0.04)'
                      }
                    }}
                  >
                    Show more reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
              No reviews yet
            </Typography>
          )}
        </Box>

        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          p: 3
        }}>
          <h1 className='text-2xl font-semibold mb-4'>Listings</h1>
          {Array.isArray(items) && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ProfileListCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
              No listings available
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default UserProfilePage;