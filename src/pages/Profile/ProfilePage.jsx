/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchBar from '../../components/Header/SearchBar'
import profileCoverImg from '../../assets/images/profileCoverImg.png'
import { Box, Button } from '@mui/material';
import ReviewCard from '../../components/uiComponents/ReviewCard';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import ProfileListCard from '../../components/uiComponents/ProfileListCard';
import NumberOneIcon from '../../assets/svgFiles/NumberOneIcon';
import useSWR from 'swr';
import { user } from '../../assets/dummyData/userData';
import useFetcher from '../../lib/fetcher';
import apiRoutes from '../../lib/apiRoutes';
import { RiseLoader } from "react-spinners";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';
import useAxiosAuth from '../../lib/auth';

console.log(user)

const ProfilePage = () => {
  const axiosAuth = useAxiosAuth()
  const fetcher = useFetcher()
  const {data, mutate} = useSWR(apiRoutes.getUserProfile(),fetcher)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const updateUserProfile = async (updateData) => {
   
    try {
      const response = await axiosAuth.post(`${import.meta.env.VITE_BASE_URL}/api/auth/update_auth_user`, updateData);
      if (response.data) {
        // Refresh the user profile data
        mutate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  const validateFile = (file) => {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
  };

  const uploadToS3 = async (file) => {
    if (!(file instanceof File)) {
      console.error("Invalid file provided:", file);
      return null;
    }

    const fileName = `Item_Image/${Date.now()}-${file.name}`;

    const s3Client = new S3Client({
      region: "eu-north-1",
      requestChecksumCalculation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: "drooda-frontend-admin-demo",
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    console.log("Uploading with params:", params);

    try {
      console.log("Uploading to S3...");
      const upload = await s3Client.send(new PutObjectCommand(params));
      console.log("S3 Upload response:", upload);
      
      // Construct the URL
      const fileUrl = `https://drooda-frontend-admin-demo.s3.eu-north-1.amazonaws.com/${fileName}`;
      
      // Log the URL to verify it's correct
      console.log("Generated S3 URL:", fileUrl);
      
      return fileUrl;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return null;
    }
  };

  const handleBackgroundImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        validateFile(file);
        const s3Url = await uploadToS3(file);
        if (!s3Url) {
          throw new Error("Failed to upload to S3");
        }

        // Update the profile with the new background image
        const updateData = {
          ...data?.data?.UserDetails,
          profile_background_img: s3Url
        };

        const success = await updateUserProfile(updateData);
        if (success) {
          setBackgroundImage(s3Url);
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    };
    
    input.click();
  };

  const handleProfileImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        validateFile(file);
        const s3Url = await uploadToS3(file);
        if (!s3Url) {
          throw new Error("Failed to upload to S3");
        }

        // Update the profile with the new profile image
        const updateData = {
          ...data?.data?.UserDetails,
          profile_img: s3Url
        };

        const success = await updateUserProfile(updateData);
        if (success) {
          setProfileImage(s3Url);
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    };
    
    input.click();
  };

  if(!user||!data)
    return(
      <div className="flex justify-center items-center h-screen">
        <RiseLoader color="#fd3c3c" />
      </div>
    )
  return (
    <div className='h-full pr-48 bg-gray-50'>
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 4,
        mb: 4
      }}>
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <img 
              loading="lazy" 
              src={backgroundImage || data?.data?.UserDetails?.profile_background_img || "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"} 
              alt="profile cover" 
              className='w-[50vw] h-[50vh] rounded-t-xl cursor-pointer object-cover object-center hover:opacity-95 transition-opacity duration-200'
              onClick={handleBackgroundImageUpload}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-t-xl">
                <RiseLoader color="#fd3c3c" size={8} />
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={handleBackgroundImageUpload}>
              <EditIcon sx={{ color: '#4870FF' }} />
            </div>
          </div>
          <div className="relative">
            <img
              loading="lazy"
              src={profileImage || data?.data?.UserDetails?.profile_img || "https://as1.ftcdn.net/jpg/06/33/54/78/1000_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.webp"}
              alt="profile picture"
              className='w-32 h-32 rounded-full object-cover object-center -mt-16 border-4 border-white shadow-lg cursor-pointer hover:opacity-95 transition-opacity duration-200'
              onClick={handleProfileImageUpload}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-full">
                <RiseLoader color="#fd3c3c" size={8} />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={handleProfileImageUpload}>
              <EditIcon sx={{ color: '#4870FF', fontSize: '1.2rem' }} />
            </div>
          </div>
        </div>
        <h1 className='text-xl font-semibold flex gap-2 items-center mt-4'>{data?.data?.UserDetails.username} <VerifiedIcon sx={{ color: '#4870FF', fontSize: 22 }} /> </h1>
        <p className='text-sm text-gray-600 flex gap-2 items-center mt-1'> <NumberOneIcon /> Member since jul, 2023 </p>

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
            <h1 className='text-2xl font-semibold text-[#211951]'>{data.data.itemCount}</h1>
            <p className='text-sm text-gray-600 font-medium'>items</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold text-[#211951]'>{data.data.followCount}</h1>
            <p className='text-sm text-gray-600 font-medium'>Followers</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold text-[#211951]'>{data.data.completedSalesCount}</h1>
            <p className='text-sm text-gray-600 font-medium'>Complete Sale</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold text-[#211951]'>{Number(data.data.avgRating).toFixed(1)}</h1>
            <p className='text-sm text-gray-600 font-medium'>Rating</p>
          </div>
        </Box>
      </Box>

      <Box sx={{ 
        marginY: 4,
        bgcolor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 4
      }}>
        <h1 className='text-xl font-semibold mb-3'>About</h1>
        <p className='text-gray-700 text-sm leading-relaxed mb-4'>{data.data.UserDetails.about||user.about}</p>
        <div className='flex flex-wrap gap-4 items-center'>
          <div className='flex items-center gap-2'>
            <LocationOnIcon sx={{ color: '#4870FF' }} />
            <span className='text-sm text-gray-600'>{data.data.UserDetails.address_line_1}</span>
          </div>
          <div className='flex items-center gap-2'>
            <EmailIcon sx={{ color: '#4870FF' }} />
            <span className='text-sm text-gray-600'>{data.data.UserDetails.email}</span>
          </div>
        </div>
      </Box>

      <Box sx={{ 
        marginY: 4,
        bgcolor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 4
      }}>
        <h1 className='text-xl font-semibold mb-4'>Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button 
            variant="outlined"
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
            Show all reviews
          </Button>
        </div>
      </Box>

      <Box sx={{ 
        marginY: 4,
        bgcolor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 4
      }}>
        <h1 className='text-xl font-semibold mb-4'>Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.items?.map((item) => (
            <ProfileListCard item={item} key={item.id} />
          ))}
        </div>
      </Box>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage