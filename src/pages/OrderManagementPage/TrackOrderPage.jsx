/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchBar from "../../components/Header/SearchBar";
import { useLocation } from "react-router-dom";
import useFetcher from "../../lib/fetcher";
import apiRoutes from "../../lib/apiRoutes";
import { RiseLoader } from "react-spinners";
import useSWR from "swr";

const ProgressTracker = ({ steps }) => {
    const getStepColor = (index) => {
        const step = steps[index];
        if (step.completed) {
            return "#D10002"; // Completed steps color
        } else if (
            !step.completed &&
            index > 0 &&
            steps[index - 1].completed
        ) {
            return "#2CB942"; // Next active step color
        } else {
            return "#D9D9D9"; // Inactive steps color
        }
    };

    return (
        <div className="relative flex flex-col items-center w-full">
             <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
            <div className="relative w-full h-1 bg-gray-300 flex justify-between items-center mb-10">
                {/* Background track */}
                {steps.map((_, index) => {
                    // Skip the last step
                    if (index >= steps.length - 1) return null;

                    // Determine the color of the current line
                    const isCompleted = steps[index].completed;
                    const isActive = index > 0 && steps[index - 1].completed;

                    return (
                        <div
                            key={`line-${index}`}
                            className="absolute h- border-4"
                            style={{
                                borderColor: isCompleted
                                    ? "#D10002"  // Completed step
                                    : isActive
                                        ? "#2CB942" // Next active step
                                        : "#D9D9D9", // Inactive step
                                width: `${100 / (steps.length - 1)}%`,
                                left: `${(index / (steps.length - 1)) * 100}%`,
                                zIndex: 0,
                            }}
                        />
                    );
                })}

                {/* Steps */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            left: `${(index / (steps.length - 1)) * 100}%`,
                            transform: "translateX(-50%)",
                        }}
                    >
                        <div
                            className="flex flex-col items-center"
                            style={{ color: getStepColor(index) }}
                        >
                            <div className="w-fit h-fit -p-10 rounded-full bg-white z-50">
                                <CheckCircleIcon
                                    style={{
                                        color: getStepColor(index),
                                        fontSize: "2rem",
                                        marginTop: 35,
                                        zIndex: 1,
                                    }}
                                />
                            </div>
                            <p
                                className={`text-xs font-medium flex-shrink-0 pt-5 ${
                                    step.completed
                                        ? "text-black"
                                        : index > 0 &&
                                          steps[index - 1].completed
                                        ? "text-green-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {step.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Component
const TrackOrderPage = () => {
    const { item } = useLocation().state || {};
    const fetcher = useFetcher();
    
    const { data: orderHistory, error, isLoading } = useSWR(
        item?.id ? apiRoutes.getOrderHistory(item.id) : null,
        fetcher
    );

    if (error) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Failed to load order history</p>
        </div>
    );
    
    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <RiseLoader color="#fd3c3c" />
        </div>
    );
    
    if (!orderHistory || !orderHistory[0]) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No order history found</p>
        </div>
    );

    const currentOrder = orderHistory[0];
    const trackingSteps = currentOrder.trackingStatuses.map((status, index) => ({
        ...status,
        completed: index < currentOrder.trackingStatuses.length - 1
    }));

    return (
        <div className="w-full flex flex-col pb-20">
            <SearchBar />
            <div className="pt-10 px-5 md:px-10 lg:px-56 flex flex-col gap-5 border-t">
                <h1 className="font-medium text-2xl">Track order</h1>

                {/* Order Card */}
                <div className="flex border mb-10 border-[#E6E8EC] items-center gap-4 w-fit p-2 min-w-96 rounded-lg">
                    <img
                        src={currentOrder.product?.images[0]}
                        alt="Order Item"
                        className="w-24 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <p className="font-medium text-[#67778C]">{`Order ID: ${currentOrder.id}`}</p>
                        <p className="font-medium text-lg">{currentOrder.product?.product_name}</p>
                    </div>
                </div>

                {/* Custom Stepper */}
                <ProgressTracker steps={trackingSteps} />

                {/* Step Details */}
                <div className="mr-auto mt-10">
                    <table>
                        <tbody>
                            {trackingSteps.map((step, index) => (
                                <tr className="w-full py-2" key={index + 1}>
                                    <th className="py-2 w-[300px] text-start font-normal">
                                        {new Date(step.createdAt).toLocaleString()}
                                    </th>
                                    <td className="text-lg text-[#808EA0]">{step.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
