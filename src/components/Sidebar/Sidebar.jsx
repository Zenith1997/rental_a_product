/* eslint-disable no-unused-vars */
import React from "react";
import { Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StarsIcon from "@mui/icons-material/Stars";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate, useLocation } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import useSignOut from "react-auth-kit/hooks/useSignOut";

const Sidebar = () => {
    const signOut = useSignOut()
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const menuItems = [
    {
      icon: <PersonIcon />,
      title: "My profile",
      description: "About, name",
      link: "/profile",
    },
    {
      icon: <ReceiptIcon />,
      title: "Order management",
      description: "Check, accept, pending",
      link: "/ordermanagement",
    },
    // {
    //   icon: <AccountBalanceWalletIcon />,
    //   title: "My wallet",
    //   description: "Payment options, check balance",
    //   link: "/mywallet",
    // },
    {
      icon: <StarsIcon />,
      title: "Reviews",
      description: "Reviews, ratings",
      link: "/reviews",
    },
    {
      icon: <ManageAccountsIcon />,
      title: "Settings",
      description: "Security & authentications",
      link: "/settings",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Analytics",
      description: "Followers, profile visitors, earnings",
      link: "/analytics",
    },
    {
      icon: <NotificationsIcon />,
      title: "Notifications",
      description: "New order, review, comments",
      link: "/notifications",
    },
    // {
    //   icon: <HelpOutlineIcon />,
    //   title: "Help",
    //   description: "Help center, privacy policy, contact us",
    //   link: "/help",
    // },
  ];

  const handleLogout =()=>{
signOut();
navigate('/');
  }

  return (
    <Box className="bg-white w-full px-10">
      {menuItems.map((item, index) => (
        <Box
          key={index}
          onClick={() => navigate(item.link)}
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer
                        ${
                          location.pathname === item.link ? "bg-[#F5F5F5]" : ""
                        } 
                         hover:bg-[#F5F5F5] transition`}
        >
          <span className="text-[#99A4B3]">{item.icon}</span>
          <Box sx={{ marginLeft: 3 }}>
            <h3 className="text-[#626060] text-md font-medium">{item.title}</h3>
            <p className="text-[#938C8C] text-xs">{item.description}</p>
          </Box>
        </Box>
      ))}

      <Box
        onClick={handleLogout}
        className="flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:bg-[#F5F5F5] transition"
      >
        <span className="text-[#99A4B3]">
          <Logout />
        </span>
        <Box sx={{ marginLeft: 3 }}>
          <h3 className="text-[#626060] text-md font-medium">Logout</h3>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
