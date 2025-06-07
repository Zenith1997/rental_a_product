/* eslint-disable no-unused-vars */
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';


// switch-btn styles
const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 60, // Increased width
    height: 30, // Adjusted height for better proportion
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(28px)', // Adjusted for the new width
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#D10002',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#D10002',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 26, // Increased thumb size
        height: 26, // Increased thumb size
    },
    '& .MuiSwitch-track': {
        borderRadius: 15, // Smooth round corners
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));


const SettingPage = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/')
    }

    return (
        <div className='mt-3 w-2/3'>
            <div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Change password</h1>
                    <ArrowForwardIosIcon />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Two-step verification</h1>
                    <ArrowForwardIosIcon />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Dark mode</h1>
                    <FormControlLabel
                        control={<IOSSwitch defaultChecked={false} />}
                    />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Banner advertising</h1>
                    <ArrowForwardIosIcon />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Drooda membership</h1>
                    <ArrowForwardIosIcon />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Agreements</h1>
                    <ArrowForwardIosIcon />
                </div>
                <div className='flex justify-between items-center mb-9 '>
                    <h1 className='text-[18px]'>Delete account</h1>
                    <ArrowForwardIosIcon />
                </div>
            </div>
            <div className='mt-20'>
                <div className='flex gap-32 items-center'>
                    <h1 className='font-medium text-[18px]'>Temporary available</h1>
                    <FormControlLabel
                        control={<IOSSwitch defaultChecked={true} />}
                    />
                </div>
                <p className='text-[#626060] text-sm italic mt-1'>NOTE : Then only shows account name, location, contact details and chat option.</p>
            </div>

            <div onClick={() => handleLogout()} className='mt-20 flex gap-10 items-center ' >
                <LogoutIcon />
                <h1 className='font-medium text-[18px]'>Log out</h1>
            </div>
        </div>
    )
}

export default SettingPage