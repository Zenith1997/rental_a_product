import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useNavigate } from 'react-router-dom';
import LoginPage from '../../pages/Auth/LoginPage';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import SearchBar from "../../components/Header/SearchBar";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Badge } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import pusher from '../../lib/pusher';
import { useState } from 'react';
import { useEffect } from 'react';



const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 350,
        color: '#4A5568',
        boxShadow:
            'rgba(0, 0, 0, 0.1) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '10px 20px',
        },
        '& .MuiMenuItem-root': {
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

function Header() {
    const isAuthenticated = useIsAuthenticated()
    const signOut = useSignOut()
    const [loggedUser, setLoggedUser] = React.useState()
    const [postAdAnchorEl, setPostAdAnchorEl] = React.useState(null);
    const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
    const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
    const postAdMenuOpen = Boolean(postAdAnchorEl);
    const navigate = useNavigate()

    React.useEffect(() => {
        setLoggedUser(isAuthenticated)
    }, [isAuthenticated])

    const handlePostAdClick = (event) => {
      if(!loggedUser){
        setLoginDialogOpen(true)
      } else {
        setPostAdAnchorEl(event.currentTarget);
      }
    };

    const handlePostAdClose = () => {
        setPostAdAnchorEl(null);
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
        setProfileAnchorEl(null);
    };

    const handleLogoutConfirm = () => {
        signOut();
        navigate('/');
        setLogoutDialogOpen(false);
        setLoggedUser(false);
        window.location.reload();
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleLoginBtn = () => {
        setLoginDialogOpen(true);
    };

    const handleCloseLoginDialog = () => {
        setLoginDialogOpen(false);
    };
    
    const auth = useAuthUser();
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationCount2, setNotificationCount2] = useState(0);

    useEffect(() => {
        const handleConnectionStateChange = (state) => {
          setConnectionStatus(state.current);
        };
    
        const handleError = (error) => {
          console.error('Pusher connection error:', error);
          setConnectionStatus('error');
        };

        const handleNewNotification = () => {
          setNotificationCount(notificationCount=>notificationCount+1);
    
         
        };
    
        pusher.connection.bind('state_change', handleConnectionStateChange);
        pusher.connection.bind('error', handleError);
        
        // Subscribe to notifications channel
        const channel = pusher.subscribe('notifications');
        channel.bind('new-notification', handleNewNotification);
    
        return () => {
          pusher.connection.unbind('state_change', handleConnectionStateChange);
          pusher.connection.unbind('error', handleError);
          channel.unbind('new-notification', handleNewNotification);
          pusher.unsubscribe('notifications');
        };
    }, [connectionStatus]);
   
    console.log(notificationCount)
    return (
        <div className='flex flex-col z-[111110201] fixed top-0 w-[100vw] fixed justify-between align-center '>
            <Box sx={{ flexGrow: 0 }}>
            <div className="z-[10201] bg-[#ffffff] py-2 shadow-[0px_2px_4px_#0000001F]">
    <Toolbar className="flex justify-between items-center" >
        <Typography
            onClick={() => {
                window.location.reload();
            }}
            variant="h6" 
            component="div"
            sx={{ color: '#D10002', fontWeight: 900, marginLeft: 10, fontFamily: 'logoFont' }}
        >
            <Link to='/'>
                DROODA
                
            </Link>
        </Typography>
{/* 
        <div className="flex-1 flex  justify-center ml-24 mr-8">
            <SearchBar  />
        </div> */}

     

    
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-8">
                {isAuthenticated && <Link to="/wishlist">
                <IconButton
                 sx={{
                    color: location.pathname === '/wishlist' ? '#D10002' : 'rgba(209, 0, 2, 0.7)',
                    backgroundColor: location.pathname === '/wishlist' ? 'rgba(209, 0, 2, 0.1)' : 'transparent',
                    '&:hover': {
                      color: '#D10002',
                      backgroundColor: 'rgba(209, 0, 2, 0.15)',
                    }
                  }}
                >
                    <FavoriteBorderIcon />
                </IconButton>
                </Link>}
                {isAuthenticated &&
                <Link to='/notifications'>
                <IconButton
                 sx={{
                    color: location.pathname === '/notifications' ? '#D10002' : 'rgba(209, 0, 2, 0.7)', 
                    backgroundColor: location.pathname === '/notifications' ? 'rgba(209, 0, 2, 0.1)' : 'transparent',
                    '&:hover': {
                      color: '#D10002',
                      backgroundColor: 'rgba(209, 0, 2, 0.15)',
                    }
                  }}
                >
                    <Badge badgeContent={notificationCount} color="primary">

                    <NotificationsNoneOutlinedIcon/>
                    </Badge>
                    </IconButton>
                </Link>}

              { isAuthenticated && <Link to='/chat'>
                <IconButton
                 sx={{
                    color: location.pathname === '/chat' ? '#D10002' : 'rgba(209, 0, 2, 0.7)',
                    backgroundColor: location.pathname === '/chat' ? 'rgba(209, 0, 2, 0.1)' : 'transparent', 
                    '&:hover': {
                      color: '#D10002',
                      backgroundColor: 'rgba(209, 0, 2, 0.15)',
                    }
                  }}
                >
                    <ChatBubbleOutlineOutlinedIcon />
                    </IconButton>
                </Link>}
                {isAuthenticated && <Link to='/myorder'>
                    <IconButton
                     sx={{
                        color: location.pathname === '/myorder' ? '#D10002' : 'rgba(209, 0, 2, 0.7)',
                        backgroundColor: location.pathname === '/myorder' ? 'rgba(209, 0, 2, 0.1)' : 'transparent',
                        '&:hover': {
                          color: '#D10002', 
                          backgroundColor: 'rgba(209, 0, 2, 0.15)',
                        }
                      }}
                    >
                        <ShoppingBagOutlinedIcon />
                    </IconButton>
                </Link>}
            </div>

            <div className="flex items-center">
                <Button
                    id="post-ad-button"
                    aria-controls={postAdMenuOpen ? 'post-ad-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={postAdMenuOpen ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handlePostAdClick}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ 
                        backgroundColor: '#FFC83B',
                        color: '#000000',
                        marginRight: 3,
                        marginLeft: 4,
                        paddingX: 3,
                        textTransform: 'capitalize',
                        minWidth: '140px',
                        height: '40px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:hover': {
                            backgroundColor: '#E6A700',
                            color: '#000',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                        },
                        '&:active': {
                            backgroundColor: '#CCCCCC',
                            transform: 'scale(0.98)'
                        }
                    }}
                >
                    Post Your Ad
                </Button>
                <Dialog
                    open={postAdMenuOpen}
                    onClose={handlePostAdClose}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            padding: 2,
                            minWidth: 350
                        }
                    }}
                >
                    <DialogTitle>
                        <Typography sx={{ fontSize: 14, textAlign: 'left', color: '#4D6079' }}>
                            Select one what you want add
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Link to="/addnewgood">
                            <MenuItem
                                sx={{
                                    backgroundColor: '#EEEFF2', 
                                    color: '#000',
                                    textTransform: 'capitalize',
                                    fontSize: 12,
                                    justifyContent: 'center',
                                    padding: 2,
                                    marginY: 1,
                                    borderRadius: 3,
                                    width: '100%'
                                }}
                                onClick={handlePostAdClose}
                                disableRipple
                            >
                                Add New Goods
                            </MenuItem>
                        </Link>
                        <Link to="/addnewservice">
                            <MenuItem
                                sx={{
                                    backgroundColor: '#EEEFF2',
                                    color: '#000', 
                                    textTransform: 'capitalize',
                                    fontSize: 12,
                                    justifyContent: 'center',
                                    padding: 2,
                                    marginY: 1,
                                    borderRadius: 3,
                                    width: '100%'
                                }}
                                onClick={handlePostAdClose}
                                disableRipple
                            >
                                Add New Services
                            </MenuItem>
                        </Link>
                    </DialogContent>
                </Dialog>
                {loggedUser ? 
                    <div>
                        <Button
                            id="profile-button"
                            sx={{
                                backgroundColor: 'transparent',
                                marginRight: 0,
                                color: '#000',
                                paddingX: 3,
                                textTransform: 'capitalize',
                            }}
                            onClick={handleProfileClick}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            <AccountCircleSharpIcon sx={{ marginRight: 2, fontSize: 32 }} />  {auth ? auth.name : 'Guest'}
                        </Button>
                        <StyledMenu
                            id="profile-menu"
                            anchorEl={profileAnchorEl}
                            open={Boolean(profileAnchorEl)}
                            onClose={handleProfileClose}
                        >
                            <MenuItem onClick={() => {
                                navigate('/profile');
                                handleProfileClose();
                            }}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => {
                                navigate('/settings');
                                handleProfileClose();
                            }}>
                                Settings
                            </MenuItem>
                            <MenuItem 
                                onClick={handleLogoutClick}
                                sx={{
                                    color: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <LogoutIcon sx={{ marginRight: 1, fontSize: 20 }} />
                                Logout
                            </MenuItem>
                        </StyledMenu>
                        <Dialog
                            open={logoutDialogOpen}
                            onClose={handleLogoutCancel}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    padding: 2,
                                    minWidth: 350
                                }
                            }}
                        >
                            <DialogTitle>
                                <Typography sx={{ fontSize: 16, textAlign: 'center', color: '#000' }}>
                                    Are you sure you want to logout?
                                </Typography>
                            </DialogTitle>
                            <DialogActions sx={{ justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                                <Button 
                                    onClick={handleLogoutCancel}
                                    variant="outlined"
                                    sx={{
                                        color: '#000',
                                        borderColor: '#000',
                                        '&:hover': {
                                            borderColor: '#000',
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleLogoutConfirm}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#ff0000',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#cc0000'
                                        }
                                    }}
                                >
                                    Logout
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                :
                    <Button
                        sx={{
                            backgroundColor: '#000000',
                            color: '#fff',
                            marginRight: 0,
                            paddingX: 3,
                            textTransform: 'capitalize',
                            '&:hover': {
                                backgroundColor: '#333333',
                                color: '#FFF'
                            }
                        }}
                        onClick={handleLoginBtn}
                    >
                     Log In
                    </Button>
                }
            </div>
        </div>
    </Toolbar>
</div>

            <LoginPage open={loginDialogOpen} handleClose={handleCloseLoginDialog} />
          
        </Box>
             
        </div>
        
    );
}

export default Header;
