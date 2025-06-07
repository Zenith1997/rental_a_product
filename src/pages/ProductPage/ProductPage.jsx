/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductImages from "./ProductImages";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ReviewCard from "../../components/uiComponents/ReviewCard";
import { Button } from "@mui/material";
import SearchBar from "../../components/Header/SearchBar";
import AddReviewModal from "./AddReviewModel";
import apiRoutes from "../../lib/apiRoutes";
import useFetcher from "../../lib/fetcher";
import useSWR from "swr";
import LoginPage from "../Auth/LoginPage";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { RiseLoader } from "react-spinners";
import axios from "axios";
import useAxiosAuth from "../../lib/auth";
import { toast } from 'react-toastify';

const ProductPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { item } = location.state || {};

  console.log("id",item);
  const pid = item.product?item.product.id:item.id;
  //console.log("pid",pid)
  //const sellerId = item?.product?.userId;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const axiosAuth = useAxiosAuth();
  const handleAddReview = () => {
    setIsReviewModalOpen(true);
  };
  const handleRentNowBtn = () => {
    if (isAuthenticated) {
      navigate("/rentitem", { state: { item } });
    } else {
      setLoginDialogOpen(true);
    }
  };
  // const [isLoading, setIsLoading] = useState(false);

  const handleAddToWishList = async () => {
    try {
      const requestData = {
        productId:item.product?.id? item?.product?.id:item?.id,
      };

      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/add_wishlist_product`,
        requestData
      );

      if (response.status === 201) {
        toast.success("Product added to wishlist successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(
        "Request failed:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add to wishlist", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const fetcher = useFetcher();
  const {
    data: products,
    error,
    isLoading,
  } = useSWR(apiRoutes.getProductById(pid), fetcher);
  console.log("ByID", products);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500); // ← Set minimum loading time here (e.g., 500ms)
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // if (showLoader || isLoading) {
  //   return (
  //     <div className="mt-[700px] flex flex-row justify-center align-bottom w-full h-[100vh]">
  //       <RiseLoader color="#fd3c3c" />
  //     </div>
  //   );
  // }

  if (error) return <div>Error loading products</div>;
  if (!products) return <div>Error loading data</div>;
  return (
    <div className="flex   flex-col items-center w-full">
         <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
      <ProductImages images={products?.images} />

      <div className="w-[70%] flex justify-between my-8 mb-16 gap-10">
        <div className="w-[65%] flex flex-col  ">
          <h2 className=" bg-[#FAE6E6] p-1 mb-5 text-center w-28 rounded-lg font-semibold">
            {products.brand_name}{" "}
          </h2>

          <div className="flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-2xl font-logoFont font-bold">
                {products.name}{" "}
              </h1>
              {/* ratings */}
              <div>
                {Array.from(
                  { length: Math.round(item.avgRatings) },
                  (_, index) => (
                    <span
                      key={index}
                      style={{ color: "gold", fontSize: "24px" }}
                    >
                      ★
                    </span>
                  )
                )}
                <span className="ml-2">{products.avgRating}</span>
              </div>
            </div>

            <div className="flex justify-between pb-6 border-b mb-10">
              {/* <h1 className="text-[#938C8C] text-md">{item.address} </h1> */}
              <h5 className="text-[#938C8C] text-md">
                {/* {item.reviews.length} Reviews */}
              </h5>
            </div>
          </div>

          <table>
            <tr className="text-[#938C8C]">
              <td className="pb-3">Condition:</td>
              <td className="pb-3"> {products.condition} </td>
            </tr>
            <tr className="text-[#938C8C]">
              <td className="pb-3">Brand:</td>
              <td className="pb-3"> {products.brand_name} </td>
            </tr>
            <tr className="text-[#938C8C]">
              <td className="pb-3">Model:</td>
              <td className="pb-3"> {products.model} </td>
            </tr>
            <tr className="text-[#938C8C]">
              <td className="pb-3">Year of manufacture:</td>
              <td className="pb-3"> {products.year_manufacture} </td>
            </tr>
          </table>

          <div className="my-10">
            <h1 className="text-xl font-logoFont font-bold">Description</h1>
            <p className="text-[#938C8C] leading-loose">
              {products.description}
            </p>
          </div>

          <div onClick={()=>navigate("/userprofile",{state:{user:products.user,sellerId:products.userId}})} className="my-10">
            <h1 className="text-xl font-logoFont font-bold mb-5">Posted by</h1>
            <div>
              <div className="flex justify-start items-center">
                <div className="flex justify-start items-center">
                  <img
                    className="w-12 h-12 mr-3 rounded-full"
                    src={products.user?.profile_img}
                    alt="profile img"
                  />
                  <div>
                    <h1 className="text-sm font-bold">
                      {products.user?.first_name}{" "}
                    </h1>
                    <h1 className="text-[#626060]">
                      Gold Member Since Nov, 2023
                    </h1>
                  </div>
                </div>
                <button className="bg-[#FAE6E699] text-[#D10002] px-10 py-2 rounded-lg shadow-md mx-auto">
                  {" "}
                  <ChatBubbleIcon /> Message renter
                </button>
              </div>
              <h2 className="text-[#67778C] mt-5 text-xs">
                Posted on {products.user?.createdAt}
              </h2>
            </div>
          </div>

          <div>
            <div>
              <span
                style={{ color: "black", fontSize: "20px", fontWeight: 500 }}
              >
                <span className="text-3xl mr-4">★</span> 5.0 Reviews
              </span>
              <button
                onClick={handleAddReview}
                className="bg-[#FAE6E699] text-[#D10002] px-1 py-1 rounded-lg shadow-md text-xs ml-10"
              >
                📝 add review
              </button>
              <AddReviewModal
                open={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
              />
            </div>
            <div className="w-full flex-wrap flex gap-1 my-10 justify-between">
              {products.reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <Button
              sx={{ width: "190px", alignSelf: "center", paddingY: 1.5 }}
              variant="outlined"
              color="error"
            >
              Show all reviews
            </Button>
          </div>
        </div>

        <div className="w-[40%] flex justify-center  items-start ">
          <div className="flex w-full flex-col justify-center items-center border shadow-md py-9 px-5 rounded-xl">
            <h1 className="text-[#938C8C] text-xl">
              Total Price{" "}
              <span className="text-black font-semibold text-2xl">
                ${products.price}
              </span>
              <spam className="text-sm"> /{products.price_type}</spam>
            </h1>
            <div className="flex flex-col w-full  justify-center items-center mt-10">
              <button
                onClick={handleRentNowBtn}
                className="bg-[#D10002] text-[#FFF] px-10 w-full py-4 mb-4 rounded-md shadow-md mx-auto"
              >
                Rent Now
              </button>
              <Button
                onClick={handleAddToWishList}
                sx={{ alignSelf: "center", paddingY: 1.5, width: "100%" }}
                variant="outlined"
                color="error"
              >
                Add to wishlist
              </Button>
            </div>
            <p className="text-md text-center mt-2 font-normal">
              You won&apos;t be charged yet{" "}
            </p>
          </div>
          <LoginPage
            navigate={"/rent"}
            open={loginDialogOpen}
            handleClose={handleCloseLoginDialog}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
