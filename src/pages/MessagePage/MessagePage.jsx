/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import TypeIcon from "../../assets/svgFiles/TypeIcon";
import SearchIcon from "../../assets/svgFiles/SearchIcon";
import MessageCard from "../../components/uiComponents/MessageCard";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import { AttachFile } from "@mui/icons-material";
import { toast } from "react-toastify";

import { messages } from "../../assets/dummyData/messageData";
import SendIcon from "../../assets/svgFiles/SendIcon";
import useAxiosAuth from "../../lib/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";


const token = localStorage.getItem("token");
//const currentUserId = Number(57);

const MessageTextCard = ({ message }) => {
    const auth = useAuthUser();
    const userId = auth?.id;
    const currentUserId = Number(userId);
    const isOwn = message.userId === currentUserId;
    
    return (
            <div className={`w-fit max-w-[70%] mb-2 px-5 py-2 ${
                isOwn 
                    ? "bg-red-300 ml-auto rounded-s-2xl rounded-tr-2xl" 
                    : "bg-blue-200 mr-auto rounded-e-2xl rounded-tl-2xl"
            }`}>
            <div className="flex items-center gap-2">
                {!isOwn && message.sender?.profile_img && (
                    <img 
                        src={message.sender.profile_img} 
                        alt="profile" 
                        className="w-7 h-7 rounded-full object-cover"
                    />
                )}
                <span className="break-words">{message.message_content}</span>
            </div>
            {message.image_url && (
                <img 
                    src={message.image_url} 
                    alt="attachment" 
                    className="mt-2 max-w-[200px] rounded object-cover"
                />
            )}
            <div className="text-xs text-gray-400 mt-1">
                {new Date(message.created_at).toLocaleString()}
            </div>
        </div>
    );
};

const MessagesBox = () => {
    const [state, setState] = useState('message');
    const [selectMessage, setSelectMessage] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const axiosAuth = useAxiosAuth();
    const auth = useAuthUser();
    const currentUserId = Number(auth?.id);

    useEffect(() => {
        fetchMessages();
        fetchChatRooms();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessageList(messages);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch messages');
            setLoading(false);
        }
    };

    const fetchChatRooms = async () => {
        try {
            setLoading(true);
            const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/user/user_chat_rooms`);
            setChatRooms(response.data.chatRooms || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch chat rooms');
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSend = async () => {
        if (!selectedRoom || !selectedRoom.id || (!file&&!inputMessage.trim())) return;

        try {
            
            const payload = {
                chatRoomId: selectedRoom.id,
                messageContent: inputMessage,
                imageUrl: file ? URL.createObjectURL(file) : "",
                sellerId: selectedRoom.seller?.id || ""
            };
            
            await axiosAuth.post(
                `${import.meta.env.VITE_BASE_URL}/api/user/send_message`,
                payload
            );
            
            // Clear input and file after sending
            setInputMessage('');
            setFile(null);
            
            // Refresh messages
            const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/user/chat_room_by_id/${selectedRoom.id}?page=1&limit=20`);
            setMessages(response.data.messages || []);
          
        } catch (err) {
            setError('Failed to send message');
           
            toast.error('Failed to send message');
        }
    };

    const handleSelectRoom = async (room) => {
        try {
            setSelectedRoom(room);
            setLoadingMessages(true);
            const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/user/chat_room_by_id/${room.id}?page=1&limit=20`);
            setMessages(response.data.messages || []);
            setLoadingMessages(false);
        } catch (err) {
            setError("Failed to load messages");
            setLoadingMessages(false);
        }
    };

    const filteredMessages = messageList.filter(message => 
        message?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        message?.message_content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getOtherUser = (room) => {
        if (room.seller && room.seller.id === currentUserId) {
            return room.buyer;
        }
        return room.seller || room.buyer;
    };

    if (loading && !selectMessage) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress sx={{ color: '#E88081' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={fetchMessages}
                    className="px-4 py-2 bg-[#E88081] text-white rounded-md hover:bg-[#d46d6e] transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col bg-gray-50 min-h-screen">
            {/* Top Navigation Tabs */}
            <div className="flex justify-center items-center mt-10 shadow-[0px_1px_2px_#0000001F] gap-4 py-6 border-b bg-white rounded-t-xl mx-6">
                <button onClick={() => setState('profile')} className={`px-4 py-2 rounded-lg transition-all duration-150 ${state === 'profile' ? "text-black text-xl bg-gray-100" : "text-[#99A4B3] bg-transparent"}`}>Profile</button>
                <button onClick={() => setState('calender')} className={`px-4 py-2 rounded-lg transition-all duration-150 ${state === 'calender' ? "text-black text-xl bg-gray-100" : "text-[#99A4B3] bg-transparent"}`}>Calender</button>
                <button onClick={() => setState('listing')} className={`px-4 py-2 rounded-lg transition-all duration-150 ${state === 'listing' ? "text-black text-xl bg-gray-100" : "text-[#99A4B3] bg-transparent"}`}>Listings</button>
                <button onClick={() => setState('message')} className={`px-4 py-2 rounded-lg transition-all duration-150 ${state === 'message' ? "text-black text-xl bg-gray-100" : "text-[#99A4B3] bg-transparent"}`}>Messages</button>
            </div>
            <div className="flex items-start justify-start gap-0 mx-6 mb-8 bg-white rounded-b-xl shadow-md overflow-hidden">
                {/* Sidebar */}
                <div className="pl-10 pr-8 pt-6 pb-8 w-1/3 border-r border-gray-200 min-h-[70vh] bg-gray-50">
                    <div className="flex pr-3 mb-8 justify-between items-center">
                        <h1 className="text-3xl font-semibold">Messages</h1>
                        <div className="flex gap-2 items-center justify-center">
                            <TypeIcon />
                        </div>
                    </div>
                    <div className="flex gap-3 mb-8 items-center">
                        <button className="px-4 py-1 rounded-md text-white bg-[#344966] shadow-sm">All</button>
                        <button className="px-3 py-1 rounded-md border border-[#CCD2D9] text-[#344966] bg-white shadow-sm">Unread</button>
                    </div>
                    <div className="pr-2 mt-4 space-y-3">
                        {chatRooms.map(room => {
                            const otherUser = getOtherUser(room);
                            return (
                                <div 
                                    key={room.id} 
                                    onClick={() => handleSelectRoom(room)} 
                                    className={`flex items-center gap-3 py-3 px-2 rounded-lg cursor-pointer border-b border-gray-100 transition-all overflow-y-auto
                                        ${selectedRoom?.id === room.id 
                                            ? 'bg-[#FAE6E66B] border-l-4 border-l-[#E88081]' 
                                            : 'hover:bg-gray-100'}`}
                                >
                                    <img
                                        src={otherUser?.profile_img || "/default-avatar.png"}
                                        alt="profile"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className={`font-semibold truncate ${selectedRoom?.id === room.id ? 'text-[#E88081]' : ''}`}>
                                            {otherUser?.username || "Unknown"}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate">
                                            {room.lastMessage?.message_content || ""}
                                        </span>
                                    </div>
                                    {room.lastMessage?.image_url && (
                                        <img src={room.lastMessage.image_url} alt="last" className="w-8 h-8 rounded object-cover border border-gray-200" />
                                    )}
                                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                        {room.lastMessage?.created_at ? new Date(room.lastMessage.created_at).toLocaleTimeString() : ""}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Chat Area */}
                {selectedRoom &&
                    <div className="pt-6 pb-8 px-8 w-2/3 min-h-[70vh] flex flex-col bg-white">
                        {/* Chat Top Bar */}
                        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-4">
                            <div className="flex items-center gap-4">
                                <ArrowBackIosNewOutlinedIcon className="text-gray-400" />
                                <img src={selectedRoom.profile_image} alt="user image" className='w-11 h-11 rounded-full border border-gray-200' />
                                <h4 className='font-medium tracking-tight text-lg'>{selectedRoom.username} </h4>
                            </div>
                            <CallOutlinedIcon sx={{ color: '#E88081', fontSize: 28 }} />
                        </div>
                        {/* Messages */}
                        <div className="flex-1 w-full overflow-y-auto px-2 py-2 space-y-4 bg-gray-50 rounded-lg" style={{maxHeight: "calc(70vh - 180px)"}} ref={(el) => el && el.scrollTo(0, el.scrollHeight)}>
                            {loadingMessages ? (
                                <div className="text-center text-gray-400 py-10">Loading...</div>
                            ) : (
                                [...messages].reverse().map((msg) => (
                                    <MessageTextCard key={msg.id} message={msg} />
                                ))
                            )}
                        </div>
                        {/* Input Bar */}
                        <div className="mt-6 flex items-center gap-3 px-2 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <IconButton component="label">
                                {file ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{file.name}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                            }}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <AttachFile />
                                )}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </IconButton>
                            <TextField
                                placeholder="Type..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                sx={{
                                    width: "100%",
                                    backgroundColor: "#F7F7F7",
                                    borderRadius: "10px",
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        border: 'none',
                                        paddingRight: 0,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleSend}
                                                disabled={loading}
                                                sx={{
                                                    marginRight: -1,
                                                    backgroundColor: '#E88081',
                                                    color: '#fff',
                                                    borderRadius: 2,
                                                    '&:hover': { backgroundColor: '#d46d6e' }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                                                ) : (
                                                    <SendIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
};

export default MessagesBox;
