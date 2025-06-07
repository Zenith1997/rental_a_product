/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import BoxIcon from '../../assets/svgFiles/BoxIcon'

const EarningsTable = ({ earnings }) => {
    return (
        <div className='mt-5 border border-[#E6E8EC] shadow-xl rounded-lg py-3 pb-5 px-7 w-fit'>
            <div className='flex gap-5'>
                <BoxIcon />
                <h2 className='text-center text-[#011C40] text-xl font-normal'>Top Item</h2>
            </div>
            <table className='w-96 mt-4 '>
                <thead>
                    <tr className=''>
                        <th className='w-1/3 pt-2 text-start text-[#99A4B3] font-normal text-lg'>Product</th>
                        <th className='w-1/3 pt-2 text-start text-[#99A4B3] font-normal text-lg'>Sold</th>
                        <th className='w-1/3 pt-2 text-start text-[#99A4B3] font-normal text-lg'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {earnings.map((earning) => (
                        <tr key={earning.id}>
                            <td className='w-1/3 text-start text-[#1A3353] pt-2 font-normal text-xl'>{earning.product}</td>
                            <td className='w-1/3 text-start text-[#1A3353] pt-2 font-normal text-xl'>{earning.sold}</td>
                            <td className='w-1/3 text-start text-[#1A3353] pt-2 font-normal text-xl'>$ {earning.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EarningsTable