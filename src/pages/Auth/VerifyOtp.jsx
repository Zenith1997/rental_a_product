import { Box, Button, TextField } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
    const { email } = useLocation().state;
    const navigate = useNavigate()
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);

    const handleVerifyOtp = async () => {
        try {
            const otpString = otp.join('');
            
            // Validate if OTP is complete
            if (otpString.length !== 6) {
                toast.error('Please enter complete 6-digit OTP', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/verify_otp`, {
                email: email,
                otp: otpString,
            });

            if (response.data.message === "OTP verified successfully!") {
                toast.success('OTP verified successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                navigate("/resetpassword")
            }
        } catch (error) {
            console.error("OTP verification error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <ToastContainer />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                    <h1 className='text-2xl font-semibold'>Verify OTP</h1>
                </Box>
                <p>Enter the 6-digit code sent to your email</p>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            name={`otp-${index}`}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            variant="outlined"
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: 'center', fontSize: '1.5rem' }
                            }}
                            sx={{ width: '3.5rem', height: '4rem' }}
                        />
                    ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6, paddingX: 3 }}>
                    <Button 
                        onClick={handleVerifyOtp} 
                        sx={{ 
                            borderRadius: 3, 
                            alignSelf: 'center', 
                            paddingY: 1.5, 
                            width: '100%', 
                            backgroundColor: '#D10002', 
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#b30002'
                            }
                        }} 
                        variant="contained"
                    >
                        Verify OTP
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default VerifyOtp
