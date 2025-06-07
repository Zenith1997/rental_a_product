/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/Header/SearchBar";
import useFetcher from "../../lib/fetcher";
import apiRoutes from "../../lib/apiRoutes";
import useSWR from "swr";
import useAxiosAuth from "../../lib/auth";
import { toast, ToastContainer } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const OrderDetailsPage = () => {
  const auth = useAuthUser();
  const userId = auth?.id;
  const location = useLocation();
  const item = location.state || {};
  console.log("order item details page", item);
  const axiosAuth = useAxiosAuth();
  const { data: orderHistory } = useSWR(
    apiRoutes.getOrderHistory(item?.id),
    useFetcher
  );
  const [availableTime, setAvailableTime] = useState("00:00:00");
  const [selectedExtension, setSelectedExtension] = useState(null);
  const [isExtending, setIsExtending] = useState(false);
  const [hasPendingExtension, setHasPendingExtension] = useState(false);

  const calculateAvailableTime = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If current time is after end date, return "00:00:00"
    if (now > end) {
      return "00:00:00";
    }

    // If current time is before start date, return time until start
    if (now < start) {
      const diff = start - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    }

    // If current time is between start and end, return remaining time
    const diff = end - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
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
  }, [item.st_date, item.end_date]);

  /**
   * Handles the cancellation of an order
   * Makes an API call to cancel the order and shows appropriate toast messages
   * @returns {Promise<void>}
   */
  const handleCancelOrder = async () => {
    try {
      // Make API call to cancel the order
      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/cancel/${item.id}`
      );

      if (response.status === 200) {
        // Show success message
        toast.success("Order cancelled successfully");
        // Optionally refresh the page or update the UI
        //  window.location.reload();
      }
    } catch (error) {
      // Show error message if cancellation fails
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleExtensionRequest = async () => {
    if (!selectedExtension) {
      toast.error("Please select an extension period", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsExtending(true);
      const currentEndDate = new Date(item.end_date);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(currentEndDate.getDate() + selectedExtension.days);

      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/request_order_extension`,
        {
          orderId: item.id,
          userId: userId,
          newEndDate: newEndDate.toISOString(),
          extensionAmount: selectedExtension.amount,
        }
      );

      if (response.status === 200) {
        toast.success("Extension request submitted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setHasPendingExtension(true);
        setSelectedExtension(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to request extension",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsExtending(false);
    }
  };

  const extensionOptions = [
    { days: 1, amount: 50.0 },
    { days: 2, amount: 100.0 },
    { days: 3, amount: 140.0 },
  ];

  console.log(orderHistory);
  return (
    <div className="w-full items-center h-[100vh] flex flex-col pb-20">
      <ToastContainer position="bottom-right" />
      {/* <SearchBar /> */}
      <div className="w-full flex flex-col border-t items-center">
        <div className="pt-10 w-1/2  px-5  flex flex-col  ">
          <div className="flex justify-between">
            {availableTime === "00:00:00" && (
              <p className="text-[#E73333] text-sm">
                Your rental period is over
              </p>
            )}
            <h1
              className={`text-xl text-justify p-1 rounded-md font-medium ml-auto ${
                availableTime === "00:00:00"
                  ? "text-[#FFFFFF] bg-[#E73333] "
                  : "text-[#011C40] bg-[#E6E8EC66]"
              } tracking-widest`}
            >
              {" "}
              {availableTime}{" "}
            </h1>
          </div>

          <div>
            <div
              className={`flex  min-w-96  p-2 rounded-lg justify-between my-10`}
            >
              <img
                className="w-48 h-28 rounded-lg"
                src={item?.product?.images[0]}
                alt="image"
              />
              <div className="h-28 mr-auto ml-2 flex flex-col justify-center gap-2 ">
                <h2 className="text-xl font-medium">
                  {item?.product?.product_name}{" "}
                </h2>
                <h2 className="text-[#7A7597] font-semibold text-lg">
                  ${item?.amount}{" "}
                  <span className="text-[#938C8C] text-sm"> /per month</span>{" "}
                </h2>
                <h1 className="text-[#938C8C] mr-5 text-sm">
                  <span style={{ color: "gold", fontSize: "24px" }}>★</span>{" "}
                  {item.avgRatings}{" "}
                </h1>
              </div>
              <button className="p-1 px-2 bg-[#F0F3FF] text-[#4D6079] text-center h-fit rounded-md my-auto ">
                Track order
              </button>
            </div>
          </div>

          <table className="w-full">
            <tbody className="w-full">
              {/* <tr className='w-full '>
                <td className='text-[#938C8C] text-lg'>Pick-up Date & Time</td>
                <td className='w-fit text-end font-medium text-lg'>{new Date(item?.pick_date).toLocaleString()} {item?.pick_time}</td>
              </tr> */}
              <tr>
                <td className="text-[#938C8C] text-lg">Pick-up Date & Time</td>
                <td className="w-fit text-end font-medium text-lg">
                  {new Date(item?.end_date).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {item.status?.id >= 6 && (
            <div className="mt-10 p-4 py-4 border border-[#E6E8EC] shadow-sm rounded-xl">
              <h1 className="font-semibold text-xl">Extend rental</h1>
              <p className="text-[#808EA0]">
                Extend early to avoid any interruption in your rental.
              </p>
              <div className="my-9 flex gap-5 w-full items-center ">
                {extensionOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      !hasPendingExtension && setSelectedExtension(option)
                    }
                    className={`flex items-center justify-center gap-3 shadow py-6 rounded-2xl shadow-[#00000040] px-8 flex-col w-1/4 transition-all duration-200 ${
                      hasPendingExtension
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:border hover:border-red-300"
                    } ${
                      selectedExtension?.days === option.days
                        ? "border-2 border-red-500 bg-red-50"
                        : ""
                    }`}
                  >
                    <h1 className="text-[#011C40] text-3xl text-red-500 font-medium">
                      $ {option.amount.toFixed(2)}
                    </h1>
                    <p className="text-[#67778C] text-xl">
                      For {option.days} {option.days === 1 ? "day" : "days"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleExtensionRequest}
                disabled={
                  isExtending || !selectedExtension || hasPendingExtension
                }
                className={`bg-[#D10002] text-xl text-[#FFF] px-10 py-4 rounded-xl shadow-md w-2/3 transition-all duration-200 ${
                  isExtending || !selectedExtension || hasPendingExtension
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700 active:bg-red-800"
                }`}
              >
                {hasPendingExtension
                  ? "Pending Extension Approval"
                  : isExtending
                  ? "Processing..."
                  : "Confirm extension"}
              </button>
            </div>
          )}

          <div className="mt-10 p-4 py-4 border border-[#E6E8EC] shadow-sm rounded-xl">
            <h1 className="font-semibold text-xl">Payment information</h1>
            <p className="text-[#808EA0]">
              Late fees may apply after the due date.
            </p>
            <div className="my-9 flex flex-col  w-full items-center ">
              <div className="my-1 pr-5 flex  w-full items-center justify-between ">
                <h1 className="text-[#938C8C] text-xl ">Amount</h1>
                <h1 className="text-xl font-medium">
                  $ {item?.amount}{" "}
                  <span className="text-sm font-medium text-[#B1A8A8]">
                    /month
                  </span>
                </h1>
              </div>
              <div className="my-1 pr-5 flex  w-full items-center justify-between ">
                <h1 className="text-[#938C8C] text-xl ">Total days</h1>
                <h1 className="text-xl font-medium">
                  {Math.ceil(
                    (new Date(item?.end_date) - new Date(item?.st_date)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </h1>
              </div>
              <div className="my-1 pr-5 flex  w-full items-center justify-between ">
                <h1 className="text-[#938C8C] text-xl ">Fees</h1>
                <h1 className="text-xl font-medium">
                  ${" "}
                  {item?.amount *
                    Math.ceil(
                      (new Date(item?.end_date) - new Date(item?.st_date)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                </h1>
              </div>
              <div className="my-1 pr-5 flex  w-full items-center justify-between ">
                <h1 className="text-[#938C8C] text-xl ">Additional charges</h1>
                <h1 className="text-xl font-medium">
                  $ {item?.extend_amount || 0}{" "}
                </h1>
              </div>
              <div className="my-10 pr-5 flex  w-full items-center justify-between ">
                <h1 className="text-[#938C8C] text-2xl ">Total</h1>
                <h1 className="text-4xl font-medium">
                  ${" "}
                  {item?.amount *
                    Math.ceil(
                      (new Date(item?.end_date) - new Date(item?.st_date)) /
                        (1000 * 60 * 60 * 24)
                    ) +
                    (item?.extend_amount || 0)}{" "}
                </h1>
              </div>
            </div>
            <button
              className={` ${
                availableTime === "00:00:00" ? "bg-[#D10002]" : " bg-[#F6CCCC]"
              } text-xl text-[#FFF] px-10 py-4  rounded-xl shadow-md w-2/3`}
            >
              Make payment
            </button>
          </div>

          {availableTime !== "00:00:00" && (
            <div className="mt-10 p-4 py-4 border border-[#E6E8EC] shadow-sm rounded-xl">
              <h1 className="font-semibold text-xl">Cancel order</h1>
              <p className="text-[#808EA0]">A cancellation fee may apply.</p>

              <button
                onClick={handleCancelOrder}
                className="bg-[#E36667] text-xl mt-10 text-[#FFF] px-10 py-4  rounded-xl shadow-md w-2/3"
              >
                Cancel rental
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
