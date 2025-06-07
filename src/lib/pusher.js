import Pusher from 'pusher-js';

// Initialize Pusher client
const pusher = new Pusher('8a99d0c36ed9c805e5a3', {
  cluster: 'ap2',
  encrypted: true
});

export default pusher; 