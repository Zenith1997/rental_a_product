import { useEffect } from 'react';
import pusher from '../lib/pusher';

const usePusherNotifications = (channelName, eventName, callback) => {
  useEffect(() => {
    // Subscribe to the channel
    const channel = pusher.subscribe(channelName);
    
    // Bind to the event
    channel.bind(eventName, (data) => {
      callback(data);
    });

    // Cleanup subscription
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [channelName, eventName, callback]);
};

export default usePusherNotifications; 