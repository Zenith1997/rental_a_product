import { Suspense, lazy } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "react-auth-kit";
import { store } from "./store";
import RiseLoader from "react-spinners/RiseLoader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from "./context/LanguageContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Artificial delay function
const delayImport = (factory, delay = 2500) =>
  new Promise((resolve) => setTimeout(() => resolve(factory()), delay));

// Lazy load with delay
const Header = lazy(() => delayImport(() => import("./components/Header/Header"), 1500));
const Footer = lazy(() => delayImport(() => import("./components/Footer/Footer"), 1500));

// Fallback loader component
const FallbackLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <RiseLoader color="#fd3c3c" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <LanguageProvider>
          <Suspense fallback={<FallbackLoader />}>
            <Header />
          </Suspense>

          <AppRoutes />

         
      
        
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
