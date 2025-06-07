import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { Box, FormControl, IconButton, MenuItem, Select, TextField } from "@mui/material";
import RentItemCard from "../../components/uiComponents/RentItemCard";
import { useState } from "react";
import axios from "axios";
import useAxiosAuth from "../../lib/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchBar from "../../components/Header/SearchBar";

const pickupLocations = ["Location 1", "Location 2"];

const RentItemDetailsPage = () => {
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();
  const location = useLocation();
  const { data } = location.state || {};
  const { selectedValue, item, selectedDateRange } = data || {};
  const auth = useAuthUser();
  console.log("daterange", selectedDateRange);
  console.log("auth", auth.token);
  const token = auth.token;

  // Get product details based on item structure
  const productDetails = item?.product || item;
  const productId = item?.productId || item?.id;
  const productPrice = productDetails?.price || 0;

  // Form state for delivery
  const [deliveryForm, setDeliveryForm] = useState({
    add_st_name: "",
    add_city: "",
    add_zip: "",
    add_state: "",
    contact: "",
    d_date: "",
    d_time: "",
    full_name: "",
    email: "",
  });

  // Form state for pickup
  const [pickupForm, setPickupForm] = useState({
    pickup_location: "",
    pick_contact: "",
    pick_date: "",
    pick_time: "",
  });

  // Loading state for request button
  const [isLoading, setIsLoading] = useState(false);

  // Handle changes for delivery form
  const handleDeliveryChange = (e) => {
    const { id, value } = e.target;
    setDeliveryForm({
      ...deliveryForm,
      [id]: value,
    });
  };

  // Handle changes for pickup form
  const handlePickupChange = (e) => {
    const { id, value } = e.target;
    setPickupForm({
      ...pickupForm,
      [id]: value,
    });
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };
  // Handle pickup location selection
  const handlePickupLocationChange = (e) => {
    setPickupForm({
      ...pickupForm,
      pickup_location: e.target.value,
    });
  };

  // Handle request submission
  const handleRequest = async () => {
    let st_date = selectedDateRange[0];
    let end_date = selectedDateRange[1];

    // Validate required fields based on delivery type
    if (selectedValue === "delivery") {
      if (!deliveryForm.add_st_name || !deliveryForm.add_city || !deliveryForm.add_zip || 
          !deliveryForm.add_state || !deliveryForm.contact || !deliveryForm.d_date || 
          !deliveryForm.d_time || !deliveryForm.full_name) {
        toast.error("Please fill in all required delivery fields", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }
    } else {
      if (!pickupForm.pickup_location || !pickupForm.pick_contact || 
          !pickupForm.pick_date || !pickupForm.pick_time) {
        toast.error("Please fill in all required pickup fields", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      toast.info("Processing your rental request...", {
        position: "bottom-right",
        autoClose: 2000,
      });

      // Create request payload based on selected option
      const requestData = {
        product_id: productId,
        st_date: st_date,
        end_date: end_date,
        delivery_type: selectedValue === "delivery" ? "Standard" : "Pickup",
        amount: productPrice,

        // Add form data based on selected delivery option
        ...(selectedValue === "delivery"
          ? // Delivery option
            {
              add_st_name: deliveryForm.add_st_name,
              add_city: deliveryForm.add_city,
              add_zip: deliveryForm.add_zip,
              add_state: deliveryForm.add_state,
              contact: deliveryForm.contact,
              d_date: deliveryForm.d_date,
              d_time: deliveryForm.d_time,
              full_name: deliveryForm.full_name,
              email: deliveryForm.email || "",
            }
          : // Pickup option
            {
              pickup_location: pickupForm.pickup_location,
              pick_date: pickupForm.pick_date,
              pick_time: pickupForm.pick_time,
              pick_contact: pickupForm.pick_contact,
            }),
      };

      console.log("Submitting request data:", requestData);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/order_create`,
        requestData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Rental request submitted successfully! We'll contact you shortly.", {
          position: "bottom-right",
          autoClose: 5000,
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
      
      // More specific error messages based on error type
      if (error.response?.status === 401) {
        toast.error("Please log in to submit a rental request", {
          position: "bottom-right",
          autoClose: 5000,
        });
      } else if (error.response?.status === 400) {
        toast.error("Invalid request data. Please check your input.", {
          position: "bottom-right",
          autoClose: 5000,
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to submit rental request. Please try again.",
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-20 border-t shadow-md items-center w-full">
       <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
      <div className="w-[75%] flex justify-between my-8 mb-16 gap-10">
        <div className="w-[65%] flex flex-col">
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <div className="flex items-center px-4 py-5 border-b border-gray-100">
                    <IconButton 
                        onClick={() => navigate(-1)}
                        className="mr-2 hover:bg-gray-100"
                        size="small"
                    >
                        <ArrowBackIcon/>
                    </IconButton>
                    {/* <SearchBar /> */}
                </div>
            <h1 className="text-2xl font-medium">Delivery details</h1>
          </Box>
          <h1 className="text-xs mb-10 text-[#B1A8A8]">
            Please provide the necessary information for delivery your rented
            item.
          </h1>

          {selectedValue === "delivery" ? (
            <>
              <Box sx={{ width: "100%", marginBottom: 3 }}>
                <label className="mb-4 font-medium" htmlFor="street">
                  Delivery address *
                </label>
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="add_st_name"
                  placeholder="Enter street name"
                  value={deliveryForm.add_st_name}
                  onChange={handleDeliveryChange}
                />
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="add_city"
                  placeholder="Enter city name"
                  value={deliveryForm.add_city}
                  onChange={handleDeliveryChange}
                />
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="add_zip"
                  placeholder="Enter postal/ZIP code"
                  value={deliveryForm.add_zip}
                  onChange={handleDeliveryChange}
                />
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="add_state"
                  placeholder="Enter state/province name"
                  value={deliveryForm.add_state}
                  onChange={handleDeliveryChange}
                />
              </Box>

              <Box sx={{ width: "100%", marginBottom: 3 }}>
                <label className="mb-4 font-medium" htmlFor="phoneNumber">
                  Phone number *
                </label>
                <TextField
                  fullWidth
                  id="contact"
                  value={deliveryForm.contact}
                  onChange={handleDeliveryChange}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Box sx={{ width: "100%", marginBottom: 3 }}>
                  <label className="mb-4 font-medium" htmlFor="deliveryDate">
                    Delivery date *
                  </label>
                  <TextField
                    fullWidth
                    id="d_date"
                    type="date"
                    value={deliveryForm.d_date}
                    onChange={handleDeliveryChange}
                  />
                </Box>
                <Box sx={{ width: "100%", marginBottom: 3 }}>
                  <label className="mb-4 font-medium" htmlFor="d_time">
                    Delivery time *
                  </label>
                  <TextField
                    fullWidth
                    id="d_time"
                    type="time"
                    value={deliveryForm.d_time}
                    onChange={handleDeliveryChange}
                  />
                </Box>
              </Box>

              <Box sx={{ width: "100%", marginBottom: 3 }}>
                <label className="mb-4 font-medium" htmlFor="fullName">
                  Contact information *
                </label>
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="full_name"
                  placeholder="Enter full name"
                  value={deliveryForm.full_name}
                  onChange={handleDeliveryChange}
                />
                <TextField
                  sx={{ width: "100%", marginBottom: 2 }}
                  fullWidth
                  id="email"
                  placeholder="Enter email address"
                  value={deliveryForm.email}
                  onChange={handleDeliveryChange}
                />
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ width: "100%", marginBottom: 3 }}>
                <label
                  className="mb-4 text-[#626060] font-medium"
                  htmlFor="pickupLocation"
                >
                  Select pickup location *
                </label>
                <FormControl fullWidth>
                  <Select
                    id="pickup_location"
                    value={pickupForm.pickup_location}
                    onChange={handlePickupLocationChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select location
                    </MenuItem>
                    {pickupLocations.map((location, index) => (
                      <MenuItem value={location} key={index + 1}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ width: "100%", marginBottom: 3 }}>
                <label className="mb-4 font-medium" htmlFor="phoneNumber">
                  Phone number *
                </label>
                <TextField
                  fullWidth
                  id="pick_contact"
                  value={pickupForm.pick_contact}
                  onChange={handlePickupChange}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Box sx={{ width: "100%", marginBottom: 3 }}>
                  <label className="mb-4 font-medium" htmlFor="pickupDate">
                    Pickup date *
                  </label>
                  <TextField
                    fullWidth
                    id="pick_date"
                    type="date"
                    value={pickupForm.pick_date}
                    onChange={handlePickupChange}
                  />
                </Box>
                <Box sx={{ width: "100%", marginBottom: 3 }}>
                  <label className="mb-4 font-medium" htmlFor="pick_time">
                    Pickup time *
                  </label>
                  <TextField
                    fullWidth
                    id="pick_time"
                    type="time"
                    value={pickupForm.pick_time}
                    onChange={handlePickupChange}
                  />
                </Box>
              </Box>
            </>
          )}

          <button
            onClick={handleRequest}
            className="bg-[#D10002] text-[#FFF] px-20 py-4 mb-4 w-1/2 rounded-md shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Request to rent"}
          </button>
        </div>

        <div className="w-[40%] flex justify-center items-start">
          <RentItemCard selectedDateRange={selectedDateRange} item={productDetails} />
        </div>
      </div>
    </div>
  );
};

export default RentItemDetailsPage;
