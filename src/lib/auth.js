import axios from 'axios';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

const useAxiosAuth = () => {
  const authHeader = useAuthHeader(); // This returns the actual header string
  const auth = useAuthUser();         // This returns the user object
  const signOut = useSignOut();
  const signIn = useSignIn();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
  });
  axiosInstance.interceptors.request.use(async (config) => {
    if (auth?.token) {
      // Always attach Authorization header
      config.headers.Authorization = `Bearer ${auth.token}`;
  
      // Add x-access-token header for GET, POST, and DELETE requests
      const methodsNeedingToken = ['get', 'post', 'delete'];
      if (config.method && methodsNeedingToken.includes(config.method.toLowerCase())) {
        config.headers['x-access-token'] = auth.token;
      }
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        auth?.refreshToken
      ) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/auth/refresh-token`,
            {},
            {
              headers: {
                'x-access-token': auth.token,
              },
            }
          );

          if (response.status === 200) {
            const newAccessToken = response.data.accessToken;

            signIn({
              auth: {
                token: newAccessToken,
                type: 'Bearer',
              },
              refreshToken: auth.refreshToken,
              userState: auth.userState,
            });

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            if (originalRequest.method?.toLowerCase() === 'get') {
              originalRequest.headers['x-access-token'] = newAccessToken;
            }

            return axiosInstance(originalRequest);
          } else {
            signOut();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          signOut();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosAuth;
