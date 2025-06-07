/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/Header/SearchBar";
import OrderItemCard from "../../components/uiComponents/OrderItemCard";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAxiosAuth from "../../lib/auth";
import { orderData } from "../../assets/dummyData/orderData";

const MyOrderPage = () => {
  const [state, setState] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuthUser();
  const axiosAuth = useAxiosAuth();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosAuth.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/orders/order_history_of_user/${state}`
      );
      if (response?.data) {
        setOrders(response.data);
        console.log("my orders", response.data);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
      if (import.meta.env.DEV) {
        // setOrders(orderData);
      }
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filterButtons = [
    { id: 0, label: "All" },
    { id: 3, label: "Active" },
    { id: 10, label: "Completed" },
    { id: 4, label: "Canceled" },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen pt-24">
       <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500">Manage and track your orders</p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <span className="text-sm text-gray-500">Total Orders:</span>
              <span className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {orders?.orders?.length || 0}
              </span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            {filterButtons.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setState(id)}
                className={`px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  state === id
                    ? "bg-[#344966] text-white shadow-md"
                    : "bg-white text-[#808EA0] border border-[#344966] hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#344966] border-t-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Loading your orders...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16 bg-red-50 rounded-lg px-8">
              <svg
                className="w-20 h-20 text-red-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-600 text-xl mb-6">{error}</p>
              <button
                onClick={fetchOrders}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-[#344966] hover:bg-[#344966]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#344966] transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && (
            <div className="space-y-8">
              {orders?.orders?.length > 0 ? (
                [...orders.orders]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item) => (
                  <div
                    key={item.id}
                    className="transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <OrderItemCard item={item} />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg px-8">
                  <svg
                    className="w-20 h-20 text-gray-400 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-600 text-xl mb-3">No orders found</p>
                  <p className="text-gray-500">
                    Try changing your filters or check back later
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
