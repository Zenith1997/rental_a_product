import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";


const WishlistPage = lazy(() => delayedImport(() => import("../pages/WishlistPage/WishlistPage")));
const SettingPageM = lazy(() => delayedImport(() => import("../pages/pagesWithSidebar/Settings")));
const OrderManagementPage = lazy(() => delayedImport(() => import("../pages/OrderManagementPage/OrderManagementPage")));
const OrderManagementsPage = lazy(() => delayedImport(() => import("../pages/pagesWithSidebar/OrderManagementsPage")));

import { RiseLoader } from "react-spinners";
const delayedImport = (importFunc, delay = 1500) =>
  new Promise((resolve) => setTimeout(() => resolve(importFunc()), delay));
const SignUpPage =lazy(()=>delayedImport(()=>import('../pages/Auth/SignUp')));
// Lazy-loaded pages/components
const HomePage = lazy(() => delayedImport(() => import('../pages/Home/HomePage')));
const ProductPage = lazy(() => delayedImport(() => import('../pages/ProductPage/ProductPage')));
const AddNewGoodPage = lazy(() => delayedImport(() => import('../pages/AddNewGoodPage/AddNewGoodPage')));
const AddNewServicePage = lazy(() => delayedImport(() => import('../pages/AddNewServicePage/AddNewServicePage')));
const RentItemRequestPage = lazy(() => delayedImport(() => import('../pages/RentItem/RentItemRequestPage')));
const RentItemDetailsPage = lazy(() => delayedImport(() => import('../pages/RentItem/RentItemDetailsPage')));
const MyOrderPage = lazy(() => delayedImport(() => import('../pages/MyOrderPage/MyOrderPage')));
const MessagesBox = lazy(() => delayedImport(() => import('../pages/MessagePage/MessagePage')));
const OrderDetailsPage = lazy(() => delayedImport(() => import('../pages/MyOrderPage/OrderDetailsPage')));
const SearchItemsPage = lazy(() => delayedImport(() => import('../pages/SearchItemsPage/SearchItemsPage')));
const PaymentPage = lazy(() => delayedImport(() => import('../pages/PaymentPage/PaymentPage')));
const ProfilePage = lazy(() => delayedImport(() => import('../pages/pagesWithSidebar/ProfilePage')));
const UserProfilePage = lazy(()=>delayedImport(()=>import('../pages/UserProfile/UserProfile')))
const OrderManagementCard = lazy(() => delayedImport(() => import('../components/uiComponents/OrderManagementCard')));
const TrackOrderPage = lazy(() => delayedImport(() => import('../pages/OrderManagementPage/TrackOrderPage')));
const MyWalletPage = lazy(() => delayedImport(() => import('../pages/pagesWithSidebar/MyWallet')));
const ReviewsPage = lazy(() => delayedImport(() => import('../pages/pagesWithSidebar/Reviews')));
const AnalyticsPage = lazy(() => delayedImport(() => import('../pages/pagesWithSidebar/Analytics')));
const NotificationPage = lazy(() => delayedImport(() => import('../pages/pagesWithSidebar/Notifications')));
const SettingPage = lazy(() => delayedImport(() => import('../pages/Settings/SettingPage')));
const Sidebar = lazy(() => delayedImport(() => import("../components/Sidebar/Sidebar")));
const SearchBar = lazy(() => delayedImport(() => import("../pages/Home/SearchBar")));
const ForgotPassword = lazy(() => delayedImport(() => import("../pages/Auth/ForgotPassword")));
const VerifyOtp = lazy(() => delayedImport(() => import("../pages/Auth/VerifyOtp")));
const ResetPassword = lazy(() => delayedImport(() => import("../pages/Auth/ResetPassword")));
const AllProductsPage = lazy(() => delayedImport(() => import('../pages/AllProductsPage/AllProductsPage')));

const AppRoutes = () => {
  return (
    <Suspense fallback={   <div className="flex justify-center items-center h-screen">
        <RiseLoader color="#fd3c3c" />
      </div>}>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/addnewgood" element={<AddNewGoodPage />} />
        <Route path="/addnewservice" element={<AddNewServicePage />} />
        <Route path="/rentitem" element={<RentItemRequestPage />} />
        <Route path="/rentitemdetails" element={<RentItemDetailsPage />} />
        <Route path="/myorder" element={<MyOrderPage />} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="/chat" element={<MessagesBox />} />
        <Route path="/myorder/:id" element={<OrderDetailsPage />} />
        <Route path="/search" element={<SearchItemsPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/userprofile" element={<UserProfilePage />} />
         <Route path="/ordermanagement" element={<OrderManagementsPage />} /> 
        <Route path="/ordermanagement/:id" element={<TrackOrderPage />} />
         <Route path="/mywallet" element={<MyWalletPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/settings" element={<SettingPageM />} /> 
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/all-products" element={<AllProductsPage />} />


        
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
