/* eslint-disable no-unused-vars */
import React from 'react';

const CreditCard = () => {
    return (
        <div className="relative w-[380px] h-[200px] overflow-hidden rounded-xl bg-[#DF4D4E] p-6 flex flex-col justify-between shadow-lg">
            {/* Circular Design */}
            <div className="absolute z-10 top-0 right-0 w-[270px]  h-[250px] rounded-full bg-[#E88081] opacity translate-x-5 -translate-y-14"></div>
            <div className="absolute z-20 top-0 right-0 w-[260px] h-[250px] rounded-full bg-[#D10002] translate-x-10 -translate-y-20"></div>

            {/* Cardholder Name */}
            <div className='z-30 mt-3'>
                <p className="text-white  text-lg ">Tom Smith</p>
                <p className="text-white z-50 text-3xl tracking-wider font-medium ">
                    1234 5678 1234 5432
                </p>
            </div>

            {/* Expiry Date and Visa Logo */}
            <div className="flex z-40 justify-between items-center">
                {/* Expiry Date */}
                <p className="text-[#FFFFFF] text-lg font">11/20</p>

                {/* Visa Logo */}
                <p className="text-[#ffffffc6] text-2xl font-bold italic">VISA</p>
            </div>
        </div>
    );
};

export default CreditCard;
