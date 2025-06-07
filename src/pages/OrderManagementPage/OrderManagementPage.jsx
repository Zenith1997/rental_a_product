/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { orderManagementData } from "../../assets/dummyData/orderManagementData";
import OrderManagementCard from "../../components/uiComponents/OrderManagementCard";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAxiosAuth from "../../lib/auth";
import { RiseLoader } from "react-spinners";
import SearchBar from "../../components/Header/SearchBar";

const OrderManagementPage = () => {
    const axiosAuth = useAxiosAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const useAxios = useAxiosAuth();
    const auth = useAuthUser();
    const [state, setState] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/orders/order_history_seller/0`);
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Using sample data due to API error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [state, refreshTrigger]);

    const handleStateChange = async (newState) => {
        setButtonLoading(true);
        setState(newState);
        try {
            const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/orders/order_history_seller/${newState}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders');
        } finally {
            setButtonLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/orders/order_history_seller/${state}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Error refreshing orders:', err);
            setError('Failed to refresh orders');
        } finally {
            setIsRefreshing(false);
            setRefreshTrigger(prev => prev + 1);
        }
    };

    const ordersdata = orders?.orders;
   
    // Filter orders based on the selected state
    const filteredOrders = state === 0
        ? ordersdata
        : ordersdata?.filter(order => order?.status?.id === state);

    return (
        <div className='h-full pl-10 pt-5 mb-20'>
       
            {/* Status Buttons */}
            <div className="flex w-fit mb-10 items-center gap-4">
                <button
                    onClick={() => handleStateChange(0)}
                    disabled={buttonLoading}
                    className={`p-1 px-3 border text-center rounded-full min-w-[100px] flex items-center justify-center ${
                        state === 0 ? "border-[#344966] text-[#344966]" : "border-[#B3BBC6] text-[#808EA0]"
                    } ${buttonLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {buttonLoading && state === 0 ? (
                        <RiseLoader color="#344966" size={4} />
                    ) : (
                        "All orders"
                    )}
                </button>
                <button
                    onClick={() => handleStateChange(1)}
                    disabled={buttonLoading}
                    className={`p-1 px-3 border text-center rounded-full min-w-[100px] flex items-center justify-center ${
                        state === 1 ? "border-[#344966] text-[#344966]" : "border-[#B3BBC6] text-[#808EA0]"
                    } ${buttonLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {buttonLoading && state === 1 ? (
                        <RiseLoader color="#344966" size={4} />
                    ) : (
                        "Accepted"
                    )}
                </button>
                <button
                    onClick={() => handleStateChange(2)}
                    disabled={buttonLoading}
                    className={`p-1 px-3 border text-center rounded-full min-w-[100px] flex items-center justify-center ${
                        state === 2 ? "border-[#344966] text-[#344966]" : "border-[#B3BBC6] text-[#808EA0]"
                    } ${buttonLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {buttonLoading && state === 2 ? (
                        <RiseLoader color="#344966" size={4} />
                    ) : (
                        "Canceled"
                    )}
                </button>
            </div>

            {/* Order List */}
            <div className="w-3/4 flex flex-col gap-5 relative">
                {isRefreshing && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <RiseLoader color="#344966" size={10} />
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <RiseLoader color="#344966" size={10} />
                    </div>
                ) : filteredOrders?.length > 0 ? (
                    [...filteredOrders]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((order) => (
                        <OrderManagementCard 
                            key={order?.id} 
                            order={order} 
                            onActionComplete={handleRefresh}
                        />
                    ))
                ) : (
                    <p className="text-center text-[#808EA0]">No orders found for the selected status.</p>
                )}
            </div>
        </div>
    );
};

export default OrderManagementPage;
