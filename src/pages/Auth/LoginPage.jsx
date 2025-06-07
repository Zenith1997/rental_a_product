import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import GoogleLoginSvg from '../../assets/svgFiles/GoogleLoginSvg';
import FacebookLoginSvg from '../../assets/svgFiles/FacebookLoginSvg';
import Checkbox from '@mui/material/Checkbox';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Webcam from "react-webcam";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import axios from 'axios'; // Import axios for making HTTP requests
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { user } from '../../assets/dummyData/userData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import.meta.env.VITE_BASE_URL


//console.log(import.meta.env.VITE_BASE_URL);


const SocialLogin = ({ state, setState, userData, handleClose }) => {
const [isLoading, setLoading] = React.useState(false);
const navigate = useNavigate()
    const signIn = useSignIn()
    // const submitBtn = async () => {
    //     if (state === 'login') {
    //         try {
    //            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signin`, {
    //                 email: userData.email,
    //                 password: userData.password,
    //                 type: 1 // Assuming type 1 is for email/password login
    //             });

    //             if (response.data.accessToken) {
    //                 // Store tokens in local storage or cookies
    //                 localStorage.setItem("accessToken", response.data.accessToken);
    //                 localStorage.setItem("refreshToken", response.data.refreshToken);

    //                 // Close the dialog
    //                 handleClose();

    //                 // Optionally, you can redirect the user or update the UI state
    //                 //console.log("User logged in successfully!");
    //             } else {
    //                 //console.log("Login failed:", response.data.message);
    //             }
    //         } catch (error) {
    //             console.error("Login error:", error.response?.data?.message || error.message);
    //         }
    //     }
    // };
const handleSignUp =()=>{
    navigate("/signUp")
}


    const submitBtn = (e) => {
        e.preventDefault()
        if (state === 'login'){
            console.log("inside")
            setLoading(true);
            
            try{
                axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signin`, {
                    email:userData.email,
                    password:userData.password,
                    type: 1
                })
                    .then((res)=>{
                        if(res.status === 200){
                            console.log(res)
                            if(signIn({
                                auth: {
                                    token: res.data.accessToken,
                                },
                                refreshToken: res.data.refreshToken,
                                userState: {
                                    name: res.data.username,
                                    token: res.data.accessToken,
                                    id:res.data.id,
                                }
                            })){   
                                toast.success("Login successful!");
                                handleClose();
                            } else {
                                toast.error("Login failed. Please try again.");
                            }
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response?.data?.message || "Login failed. Please try again.");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }catch(error){
                toast.error("An unexpected error occurred. Please try again.");
                setLoading(false);
            }
        }
    }

    return (<>
 
          <> <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6, }}>
                <Button onClick={submitBtn} sx={{ borderRadius: 3, alignSelf: 'center', paddingY: 1.5, width: '100%', backgroundColor: '#D10002', color: '#FFFFFF' }} variant="outlined" >
                   {isLoading ? <CircularProgress /> : "Sign IN"}
                </Button>
                <Divider
                    sx={{
                        width: '100%',
                        marginY: 3,
                        borderColor: '#B3BBC6',
                        height: 1,
                    }}
                >Or Login</Divider>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                    <button>
                        <GoogleLoginSvg />
                    </button>
                    <button>
                        <FacebookLoginSvg />
                    </button>
                </Box>
            </Box>

            <p className='text-center font-medium mt-10 w-full'> Don't have an account? <span    className='text-[#808EA0] ' onClick={handleSignUp}>Sign up</span> </p></>
            </>
    );
};

const LoginPage = ({ open, handleClose }) => {
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

    const descriptionElementRef = React.useRef(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [state, setState] = React.useState('login');
    const [displayMobileCode, setDisplayMobileCode] = React.useState(false);
    const [displayEmailCode, setDisplayEmailCode] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(true);
    const webcamRef = React.useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setIsCameraOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAgreeBtn = () => {
        // Handle agree button click
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api//auth/signup`, {
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
                alert("User registered successfully!");
                setState('login'); // Redirect to login page after successful signup
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data?.message || error.message);
            alert("Signup failed: " + (error.response?.data?.message || error.message));
        }
    };

    // const handleForgotPassword = async () => {
    //     try {
    //         const accessToken = localStorage.getItem("accessToken"); // Retrieve the access token from local storage

    //         if (!accessToken) {
    //             alert("You need to be logged in to reset your password.");
    //             return;
    //         }

    //         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/send_otp_email`, {
    //             token: accessToken, // Send the access token as part of the request
    //             newPassword: userData.password, // New password from the form
    //         });

    //         if (response.data.message === "Password reset successfully!") {
    //             alert("Password reset successfully!");
    //             setState('login'); // Redirect to login page after successful password reset
    //         }
    //     } catch (error) {
    //         console.error("Forgot password error:", error.response?.data?.message || error.message);
    //         alert("Forgot password failed: " + (error.response?.data?.message || error.message));
    //     }
    // };

    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const validateMobileNumberBtn = () => {
        setDisplayMobileCode(true);
        setDisplayEmailCode(false);
    };

    const validateEmailBtn = () => {
        setDisplayEmailCode(true);
        setDisplayMobileCode(false);
    };
    const navigate = useNavigate()

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll="body"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            sx={{ width: '100%' }}
        >
            {/* login */}
            {state === 'login' &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >Login Your Account</h1>
                        <p className='text-center  mt-3 text-[#938C8C] w-full'> Login to your accounts to discover the great features <br />
                            in this template </p>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 7, }}>
                        <TextField
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            sx={{ width: '100%' }}
                            id="outlined-basic"
                            label="Email or username"
                            variant="outlined"
                        />
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
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
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <button onClick={()=>{navigate("/forgotPassword")
                            handleClose()
                        }} className='ml-auto text-[#4D6079] -mt-1'>Forgot password?</button>
                    </Box>
                    <SocialLogin handleClose={handleClose} userData={userData} state={state} setState={setState} />
                </Box>
            }

            {state === "forgotPassword" &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >Reset password</h1>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 7, }}>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
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

                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
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
                        <Button onClick={handleForgotPassword} sx={{ borderRadius: 3, alignSelf: 'center', paddingY: 1.5, width: '100%', backgroundColor: '#D10002', color: '#FFFFFF' }} variant="outlined" >
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            }
            {state === 'signup' &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingX: 6, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
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
            }

            {state === "idVerification" &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >ID Verification</h1>
                        <p className='text-center  mt-3 text-[#938C8C] w-full'> Upload of your government issued ID</p>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 0, }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                mt: 5,
                            }}
                        >
                            {isCameraOpen ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        borderRadius: "8px",
                                        backgroundColor: "#F3F3F3",
                                    }}
                                />
                            ) : (
                                <img
                                    src={image}
                                    alt="Captured ID"
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    mt: 2,
                                    backgroundColor: "transparent",
                                    color: 'black',
                                    border: 1
                                }}
                            >
                                Click to upload
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleUpload}
                                />
                            </Button>
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ color: '#344966', mt: 2 }}>Instructions:</Typography>
                            <ul className='w-full px-9 text-[#99A4B3]'>
                                <li className=' list-disc mb-2'>Make sure your ID is clearly visible.</li>
                                <li className=' list-disc mb-2'>Accepted IDs, Driver's License, Passport,
                                    National ID</li>
                                <li className=' list-disc mb-2'>Click the button below to automatically
                                    scan once your ID is in the frame</li>
                            </ul>
                        </Box>
                        <button onClick={() => setIsCameraOpen(true)} className='bg-[#E36667] p-4 text-white rounded-full my-6'>
                            <DocumentScannerIcon />
                        </button>
                        <Button onClick={() => setState("terms")} sx={{ borderRadius: 3, alignSelf: 'center', paddingY: 1.5, width: '100%', backgroundColor: '#D10002', color: '#FFFFFF' }} variant="outlined" >
                            Continue
                        </Button>
                    </Box>
                </Box>
            }

            {state === "terms" &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', paddingX: 10, paddingY: 4, alignItems: 'center', justifyContent: 'space-between', }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <h1 className='text-2xl font-semibold' >Terms & Conditions</h1>
                        <p className='text-start  mt-6 text-[#000000CC] w-full'> Please read and review our Terms & Conditions and Privacy <br />
                            Policy carefully before proceeding.</p>
                    </Box>
                    <Box>
                        <p className='text-[#000000] leading-7 font-light text-sm mt-9 my-5 '>
                            Corem ipsum dolor sit amet, consectetur adig tuyyrtu rtyy
                            piscing elit. Etiam eu turpis molestie, dictum ee ttytu tty
                            st a, mattis tellus.

                        </p>
                        <p className='text-[#000000] leading-7 font-light text-sm my-5 '>

                            Class aptent taciti sociosqu ad litora torquent et5 6usr jut
                            per conubia nostra, per inceptos himenaeos. ujyti yeyttu
                            Praesent auctor purus luctus enim egestastuut6u uryt rw,
                            ac scelerisque ante pulvinar.
                        </p>
                        <p className='text-[#000000] leading-7 font-light text-sm my-5 '>
                            Corem ipsum dolor sit amet, consectetur adig tuyyrtu rtyy
                            piscing elit. Etiam eu turpis molestie, dictum ee ttytu tty
                            st a, mattis tellus.
                        </p>
                        <button className='font-medium underline'>
                            Learn more {`>`}
                        </button>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 3, }}>
                            <Button onClick={handleAgreeBtn} sx={{ borderRadius: 3, alignSelf: 'center', paddingY: 1.5, width: '100%', backgroundColor: '#D10002', color: '#FFFFFF' }} variant="outlined" >
                                Agree and continue
                            </Button>
                            <Button sx={{ alignSelf: 'center', paddingY: 1.5, width: '100%', marginTop: 3, marginY: 3, }} variant="outlined" color="error">
                                Decline
                            </Button>
                        </Box>
                    </Box>
                </Box>
            }
        </Dialog>
    );
};

export default LoginPage;
