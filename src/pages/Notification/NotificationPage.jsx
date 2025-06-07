/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import NotificationCard from "../../components/uiComponents/NotificationCard";
import useSWR from "swr";
import useFetcher from "../../lib/fetcher";
import apiRoutes from "../../lib/apiRoutes";
import { RiseLoader } from "react-spinners";
import usePusherNotifications from "../../hooks/usePusherNotifications";
import pusher from "../../lib/pusher";

// Error Boundary Component
class NotificationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Notification Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const NotificationPage = () => {
  const [state, setState] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const fetcher = useFetcher();

  // Get notifications using SWR
  const { data: notificationsData, isLoading, mutate, error: swrError } = useSWR(
    apiRoutes.getAllNotifications({ page: 1, limit: 10 }),
    fetcher
  );

  useEffect(() => {
    if (notificationsData?.data) {
      try {
        setNotifications(notificationsData.data);
        setError(null);
      } catch (err) {
        console.error('Error setting notifications:', err);
        setError('Failed to load notifications');
      }
    }
  }, [notificationsData]);

  // Monitor Pusher connection status
  useEffect(() => {
    const handleConnectionStateChange = (state) => {
      setConnectionStatus(state.current);
    };

    const handleError = (error) => {
      console.error('Pusher connection error:', error);
      setConnectionStatus('error');
    };

    pusher.connection.bind('state_change', handleConnectionStateChange);
    pusher.connection.bind('error', handleError);

    return () => {
      pusher.connection.unbind('state_change', handleConnectionStateChange);
      pusher.connection.unbind('error', handleError);
    };
  }, []);

  // Handle new notification
  const handleNewNotification = useCallback((data) => {
    try {
      setNotifications(prev => [data, ...prev]);
      mutate();
    } catch (err) {
      console.error('Error handling new notification:', err);
    }
  }, [mutate]);

  // Use custom hook for Pusher notifications
  usePusherNotifications('notifications', 'new-notification', handleNewNotification);

  // Filter notifications based on type
  const filteredNotifications = state === "all"
    ? notifications
    : notifications.filter((notification) => notification?.type === state);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RiseLoader color="#fd3c3c" size={10} />
      </div>
    );
  }

  if (swrError || error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading notifications</h3>
        <p className="text-red-600 text-sm mt-1">
          {swrError?.message || error || 'Please try again later'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full mt-4 mb-20">
      {/* Connection Status */}
      <div className="mb-4 text-sm">
        <span className={`inline-block px-2 py-1 rounded ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : connectionStatus === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {connectionStatus === 'connected' 
            ? 'Real-time updates connected' 
            : connectionStatus === 'error'
            ? 'Connection error - retrying...'
            : 'Connecting to real-time updates...'}
        </span>
      </div>

      {/* Notification Type Buttons */}
      <div className="flex gap-5 items-center mb-4">
        {["all", "order", "follow", "review", "comment"].map((type) => (
          <button
            key={type}
            onClick={() => setState(type)}
            className={`border text-center rounded-md px-2 border-[#CCD2D9] text-sm p-1 ${
              state === type ? "bg-[#344966] text-white" : "text-[#344966]"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <NotificationErrorBoundary>
        <div>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard 
                key={notification?.id || Math.random()} 
                notification={notification} 
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4">
              No notifications found
            </div>
          )}
        </div>
      </NotificationErrorBoundary>
    </div>
  );
};

export default NotificationPage;
