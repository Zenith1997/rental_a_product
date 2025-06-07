/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const MessageCard = ({ message }) => {
    const noOfMessages = message.messages.length;
    const displayMessage = message.messages[noOfMessages - 1]


    return (
        <div className='flex  justify-between items-center my-4 px-2'>
            <div className='flex gap-3 overflow-hidden'>
                <img className='w-12 h-12 rounded-full' src={message.profile_image} alt="user image" />
                <div className=' overflow-hidden'>
                    <h4 className='font-medium tracking-tight'>{message.username} </h4>
                    <p className='text-[#938C8C] text-xs tracking-tighter font-light'> {displayMessage.text} </p>
                </div>
            </div>
            <h2 className=' font-medium'> {displayMessage.time} </h2>
        </div>
    )
}

export default MessageCard