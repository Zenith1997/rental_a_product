/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CircleIcon from "@mui/icons-material/Circle";
import { formatDistanceToNow, isYesterday, format } from "date-fns";

const NotificationCard = ({ notification }) => {
    const formatTime = (timestamp) => {
        try {
            if (!timestamp) return 'Recently';
            
            // Handle string timestamps
            const date = new Date(timestamp);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Recently';
            }
            
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Recently';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order':
                return '🛍️';
            case 'follow':
                return '👥';
            case 'review':
                return '⭐';
            case 'comment':
                return '💬';
            default:
                return '📢';
        }
    };

    return (
        <div
            className={`flex justify-between items-center pr-10 w-3/4  p-4 py-8  mb-6 ${notification.status === "unread" ? "bg-[#F0F3FF]" : "bg-white"
                }`}
        >
            <div className="flex gap-5  w-3/4">
                <div className="relative">
                    {/* Rounded Icon */}
                    <div className="w-12 h-12 rounded-full bg-white flex justify-center items-center border border-gray-200">
                        <MenuIcon className="text-[#344966]" />
                    </div>
                    {/* Green Badge */}
                    {notification.status === "unread" && (
                        <CircleIcon
                            className="absolute top-0 right-0 text-green-500"
                            style={{ fontSize: "12px" }}
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-">{notification.transaction}</h2>
                    <p className="text-sm text-[#4D6079]">{notification?.description}</p>
                </div>
            </div>
            <h2 className="text-sm text-gray-500">{formatTime(notification?.createdAt)}</h2>
        </div>
    );
};

export default NotificationCard;
