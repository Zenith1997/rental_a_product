/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import useAxiosAuth from '../../lib/auth';

const OrderItemCard = ({ item }) => {
  console.log("item", item);
  console.log("status id is 12", item?.status?.id === 12);
  const axiosAuth = useAxiosAuth();
  console.log("order item", item);
  const navigate = useNavigate();
  const [availableTime, setAvailableTime] = useState("00:00:00");
  const [showCountdown, setShowCountdown] = useState(false);

  const calculateAvailableTime = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Only show countdown for status ID >= 6
    if (item.status?.id < 6) {
      setShowCountdown(false);
      return "00:00:00";
    }

    // If current time is after end date
    if (now > end) {
      setShowCountdown(false);
      return "00:00:00";
    }

    // If current time is before start date
    if (now < start) {
      setShowCountdown(false);
      return "00:00:00";
    }

    // If current time is between start and end
    setShowCountdown(true);
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Update time every second
  useEffect(() => {
    // Initial calculation
    setAvailableTime(calculateAvailableTime(item.st_date, item.end_date));

    // Set up interval to update every second
    const timer = setInterval(() => {
      setAvailableTime(calculateAvailableTime(item.st_date, item.end_date));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [item.st_date, item.end_date, item.status?.id]);

  const handleViewOrder = () => {
    navigate(`/product/${item.id}`, { state: { item } });
  };

  const handleTrackOrder = () => {
    navigate(`/ordermanagement/${item?.id}`, { state: {item }});
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axiosAuth.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders/order_cancel/${item.id}`
      );
      
      if (response.status === 200) {
        toast.success('Order cancelled successfully', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handlePayment = () => {
    navigate('/payment', { state: { orderDetails: item } });
  };

  const handleExtendOrder = () => {
    navigate(`/myorder/${item?.id}`, { state: item });
  };

  const renderStatusSpecificButtons = () => {
    switch (item.status?.id) {
      case 3:
        return (
          <button
            onClick={handlePayment}
            className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            Make payment
          </button>
        );
      case 5:
        return (
          <button
            onClick={handleViewOrder}
            className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            Re-Rent
          </button>
        );
      case 6:
        return (
          <button
            onClick={handleExtendOrder}
            className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            Extend-Rental
          </button>
        );
      case 12:
        return (
          <button
            onClick={handlePayment}
            className="bg-[#D10002] text-[#FFF] px-10 py-4 mb-4 mx-2 rounded-md shadow-md w-48 hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            Pay to extend
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex border min-w-96 p-2 rounded-lg justify-between my-10 ${
        item.availableTime === "00:00:00"
          ? "border-[#E73333]"
          : "border-[#E6E8EC]"
      }`}
    >
      <img
        className="w-48 h-28 rounded-lg"
        src={item.product?.images[0] || "hey"}
        alt="image"
      />
      <div className="h-28 mr-auto ml-2 flex flex-col justify-around">
        <p className="p-1 bg-[#E6E8EC] rounded-lg font-semibold text-[#344966] w-28 overflow-hidden text-center">
          {item.category}
        </p>
        <h2 className="text-lg font-medium">{item.product?.product_name}</h2>
        <h2 className="text-[#7A7597] text-lg">
          ${item.amount}
          <span className="text-[#938C8C] text-sm"> /per month</span>
        </h2>
      </div>
      <div className="flex flex-col items-end justify-between ml-3">
        <h1 className="text-[#938C8C] mr-5 text-lg">
          <span style={{ color: "gold", fontSize: "24px" }}>★</span>{" "}
          {item.product?.avgRating}
        </h1>
        {(item.status?.id === 3 || item.status?.id >= 6) && showCountdown && (
          <h1
            className={`text-xl text-justify font-medium mr-5 ${
              availableTime === "00:00:00"
                ? "text-[#E73333]"
                : "text-[#011C40]"
            } tracking-widest`}
          >
            {availableTime}
          </h1>
        )}
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={handleTrackOrder}
            className="bg-[#F1B3B3] text-[#FFF] px-6 py-3 rounded-md shadow-md hover:bg-red-200 active:bg-red-300 transition-colors duration-200 whitespace-nowrap"
          >
            Track order
          </button>
          <button
            onClick={handleViewOrder}
            className="bg-[#D10002] text-[#FFF] px-6 py-3 rounded-md shadow-md hover:bg-red-700 active:bg-red-800 transition-colors duration-200 whitespace-nowrap"
          >
            View details
          </button>
          {renderStatusSpecificButtons()}
          {item.status?.id === 1 && (
            <button
              onClick={handleCancelOrder}
              className="bg-[#F1B3B3] text-[#FFF] px-6 py-3 rounded-md shadow-md hover:bg-red-200 active:bg-red-300 transition-colors duration-200 whitespace-nowrap"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
