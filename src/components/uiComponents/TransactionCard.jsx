/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const TransactionCard = ({ transaction }) => {
  return (
    <div className='mt-5 gap-8 border-b border-[#E6E8EC] pb-4 w-1/2 flex items-center justify-between'>
      <img src={transaction.image} alt="user image" className='w-14 h-14 rounded-full' />
      <div className='mr-auto'>
        <h2 className='text-lg font-semibold'>{transaction.name}</h2>
        <p className='text-[#344966] font-medium tracking-wider'>{transaction.date}</p>
      </div>
      <h1 className={`text-2xl font-semibold  ${transaction.type === "expense" ? "text-[#E73333]" : " text-[#2CB942]"}`}> $ {transaction.amount.toFixed(2)} </h1>
    </div>
  )
}

export default TransactionCard