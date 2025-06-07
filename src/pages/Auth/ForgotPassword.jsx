import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const navigate = useNavigate()
    const handleForgotPassword = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!userData.email) {
                toast.error('Please enter your email address', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/send_otp_email`, {
                email: userData.email, 
                mailType: "reset_pass",
            });
console.log("response",response.data)
            if (response.data.message === "OTP sent successfully") {
                console.log("inside the eenavigate");
                toast.success('OTP sent successfully! Please check your email', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                navigate("/verifyotp", { state: { email: userData.email } })
            }
        } catch (error) {
            console.error("Forgot password error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const [userData, setUserData] = React.useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        address_line_1: '',
        address_line_2: '',
        zip_code: '',
        contact_number: '',
        password: '',
        confirmPassword: '',
    });
   
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
  

    // const validateMobileNumberBtn = () => {
    //     setDisplayMobileCode(true);
    //     setDisplayEmailCode(false);
    // };

  
  return (
    <div className='flex justify-center items-center h-screen'>
        <ToastContainer />
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >Forgot Password</h1>
                    </Box>
                    <p>Enter your email address to reset password</p>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 7, }}>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                            <OutlinedInput
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                id="outlined-adornment-password"
                                type={'email'}
                               
                                label="Enter new password"
                            />
                        </FormControl>

                      
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6, paddingX: 3 }}>
                        <Button 
                            onClick={handleForgotPassword} 
                            sx={{ 
                                borderRadius: 3, 
                                alignSelf: 'center', 
                                paddingY: 1.5, 
                                width: '100%', 
                                backgroundColor: '#D10002', 
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#B00002'
                                }
                            }} 
                            variant="contained"
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
    </div>
  )
}

export default ForgotPassword
