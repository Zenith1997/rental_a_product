import { Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = React.useState({
        newPassword: '',
        rePassword: '',
    });

    const handleResetPassword = async () => {
        try {
            // Validate passwords
            if (!passwords.newPassword || !passwords.rePassword) {
                toast.error('Please enter both passwords', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            if (passwords.newPassword !== passwords.rePassword) {
                toast.error('Passwords do not match', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/reset_password`,
                {
                    email: localStorage.getItem('resetEmail'),
                    newPassword: passwords.newPassword,
                    rePassword: passwords.rePassword
                }
            );

            if (response.data.message === "Password reset successfully") {
                toast.success('Password reset successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                localStorage.removeItem('resetEmail'); // Clean up
                navigate("/login");
            }
        } catch (error) {
            console.error("Reset password error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <ToastContainer />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                    <h1 className='text-2xl font-semibold'>Reset Password</h1>
                </Box>
                <p>Enter your new password</p>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 7, }}>
                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                        <OutlinedInput
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleInputChange}
                            id="outlined-adornment-password"
                            type={'password'}
                            label="New Password"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            name="rePassword"
                            value={passwords.rePassword}
                            onChange={handleInputChange}
                            id="outlined-adornment-password"
                            type={'password'}
                            label="Confirm Password"
                        />
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6, paddingX: 3 }}>
                    <Button 
                        onClick={handleResetPassword} 
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
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default ResetPassword
