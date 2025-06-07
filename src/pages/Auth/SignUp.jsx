import { Checkbox } from '@heroui/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { toast } from 'react-toastify';


const SignUp = () => {
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
    const [displayMobileCode, setDisplayMobileCode] = React.useState(false);
    const [displayEmailCode, setDisplayEmailCode] = React.useState(false);
    const validateMobileNumberBtn = () => {
        setDisplayMobileCode(true);
        setDisplayEmailCode(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [showPassword, setShowPassword] = React.useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    // const validateMobileNumberBtn = () => {
    //     setDisplayMobileCode(true);
    //     setDisplayEmailCode(false);
    // };

    const validateEmailBtn = () => {
        setDisplayEmailCode(true);
        setDisplayMobileCode(false);
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                address_line_1: userData.address_line_1,
                address_line_2: userData.address_line_2,
                zip_code: userData.zip_code,
                contact_number: userData.contact_number,
                password: userData.password,
            });

            if (response.data.message === "User registered successfully!") {
                toast.success("User registered successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setState('login');
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Signup failed. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };


  return (
    <div className='h-[100vh] flex justify-center'>
         <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', paddingX: 6, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >Sign Up</h1>
                        <p className='text-center  mt-3 text-[#938C8C] w-full'> Create new account to discover the great features <br />
                            in this template</p>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: '', justifyContent: '', marginTop: 7, }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2, marginBottom: 2, }}>
                            <TextField
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleInputChange}
                                sx={{ width: '100%' }}
                                id="outlined-basic"
                                label="First name"
                                variant="outlined"
                            />
                            <TextField
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleInputChange}
                                sx={{ width: '100%' }}
                                id="outlined-basic"
                                label="Last name"
                                variant="outlined"
                            />
                        </Box>
                        <TextField
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            sx={{ width: '48%' }}
                            id="outlined-basic"
                            label="User name"
                            variant="outlined"
                        />
                        <TextField
                            name="address_line_1"
                            value={userData.address_line_1}
                            onChange={handleInputChange}
                            sx={{ width: '100%', marginTop: 2, }}
                            id="outlined-basic"
                            label="Address Line 1"
                            variant="outlined"
                        />
                        <TextField
                            name="address_line_2"
                            value={userData.address_line_2}
                            onChange={handleInputChange}
                            sx={{ width: '100%', marginTop: 2, }}
                            id="outlined-basic"
                            label="Address Line 2"
                            variant="outlined"
                        />
                        <TextField
                            name="zip_code"
                            value={userData.zip_code}
                            onChange={handleInputChange}
                            sx={{ width: '100%', marginTop: 2, }}
                            id="outlined-basic"
                            label="Zip code"
                            variant="outlined"
                        />

                        <TextField
                            name="contact_number"
                            value={userData.contact_number}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                marginTop: 2,
                                paddingRight: 0,
                            }}
                            id="outlined-basic"
                            label="Enter your phone number"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={validateMobileNumberBtn}
                                            sx={{
                                                backgroundColor: '#D10002',
                                                color: '#FFFFFF',
                                                '&:hover': {
                                                    backgroundColor: '#B00002',
                                                },
                                                borderRadius: 1,
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <ArrowForwardIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* mobile validation */}
                        {displayMobileCode &&
                            <Box>
                                <p className='text  mt-3 text-[#99A4B3] w-full'> We sent it to the phone <span className='text-black font-medium'> +96 1234 ******</span></p>
                                <Box sx={{ display: 'flex', width: '60%', gap: 2 }}>
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                </Box>
                                <p className='text  mb-3 text-[#344966] w-full'> Resend code in 20s</p>
                            </Box>
                        }

                        <TextField
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                marginTop: 2,
                                paddingRight: 0,
                            }}
                            id="outlined-basic"
                            label="Enter your email"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={validateEmailBtn}
                                            sx={{
                                                backgroundColor: '#D10002',
                                                color: '#FFFFFF',
                                                '&:hover': {
                                                    backgroundColor: '#B00002',
                                                },
                                                borderRadius: 1,
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <ArrowForwardIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* email validation */}
                        {displayEmailCode &&
                            <Box>
                                <p className='text  mt-3 text-[#99A4B3] w-full'> We sent it to the phone <span className='text-black font-medium'> jhonsmith123@gmail.com</span></p>
                                <Box sx={{ display: 'flex', width: '60%', gap: 2 }}>
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                    <TextField sx={{ width: '10', }} id="outlined-basic" variant="outlined" />
                                </Box>
                                <p className='text  mb-3 text-[#344966] w-full'> Resend code in 20s</p>
                            </Box>
                        }
                        <FormControl sx={{ my: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                name="password"
                                value={userData.password}
                                onChange={handleInputChange}
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Enter new password"
                            />
                        </FormControl>

                        <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleInputChange}
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm password"
                            />
                        </FormControl>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-start', }}>
                            <Checkbox defaultChecked color="default" />
                            <p className=' text-[#808EA0]'>Remember me</p>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6, paddingX: 3 }}>
                        <Button onClick={handleSignup} sx={{ borderRadius: 3, alignSelf: 'center', paddingY: 1.5, width: '100%', backgroundColor: '#D10002', color: '#FFFFFF' }} variant="outlined" >
                            Continue
                        </Button>
                    </Box>
                </Box>  
    </div>
  )
}

export default SignUp
