/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react'
import SearchBar from '../../components/Header/SearchBar'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import ImageUpload from '../../components/uiComponents/ImageUploadCard';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import apiRoutes from '../../lib/apiRoutes';
import useFetcher from '../../lib/fetcher';
import useSWR from 'swr';
import useAxiosAuth from '../../lib/auth';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const paymentTypes = [
  "Per Month",
  "Per Year",
  "Per Hour",
]

const extendedPeriods = [1, 2, 3]

// switch-btn styles
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#D10002',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#D10002',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#D10002',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const AddNewGoodPage = () => {
  const [currentState, setCurrentState] = useState(1);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: 1,
    category_id: null,
    location: "",
    description: "",
    brand_name: "",
    model: "",
    year_manufacture: null,
    condition: "",
    images: [],
    ava_from: "",
    ava_to: "",
    contact: "",
    email: "",
    selling_type: [],
    delivery_type: [],
    keywords_list: [],
    price_type: "",
    price: null,
    extend_status: false,
    rate_p_oned: null,
    rate_p_twod: null,
    rate_p_threed: null,
    max_ex_period: null,
    schedule_status: false,
    is_inactive: false,
    scheduleDateTime: null,
    customRates: [],
    custom_date:new Date(),
  });

  const [displayOptionalFields, setDisplayOptionalFields] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetcher = useFetcher();
  const { data: cat } = useSWR(
    apiRoutes.getCategoryList({
      page: 1,
      limit: 10,
    }),
    fetcher
  );

  const axiosAuth = useAxiosAuth();

  const handleImagesChange = useCallback((imageUrls) => {
    setUploadedImages(imageUrls);
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
  }, []);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle selling type changes
  const handleSellingTypeChange = (type, checked) => {
    setFormData(prev => {
      const currentTypes = [...prev.selling_type];
      if (checked) {
        if (!currentTypes.includes(type)) {
          currentTypes.push(type);
        }
      } else {
        const index = currentTypes.indexOf(type);
        if (index > -1) {
          currentTypes.splice(index, 1);
        }
      }
      return {
        ...prev,
        selling_type: currentTypes
      };
    });
  };

  // Handle keywords
  const handleKeyDown = (event) => {
    const { key, target } = event;
    if ((key === "Enter" || key === " ") && target.value.trim() !== "") {
      event.preventDefault();
      const newKeyword = target.value.trim();
      if (!keywords.includes(newKeyword) && keywords.length < 5) {
        setKeywords(prev => [...prev, newKeyword]);
        setFormData(prev => ({
          ...prev,
          keywords_list: [...prev.keywords_list, newKeyword]
        }));
      }
      target.value = "";
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(prev => prev.filter(keyword => keyword !== keywordToDelete));
    setFormData(prev => ({
      ...prev,
      keywords_list: prev.keywords_list.filter(keyword => keyword !== keywordToDelete)
    }));
  };

  // Handle custom rates
  const handleCustomRateChange = (index, field, value) => {
    setFormData(prev => {
      const newCustomRates = [...prev.customRates];
      if (!newCustomRates[index]) {
        newCustomRates[index] = { period: "", rate: "" };
      }
      newCustomRates[index][field] = value;
      return {
        ...prev,
        customRates: newCustomRates
      };
    });
  };

  const addCustomRate = () => {
    setFormData(prev => ({
      ...prev,
      customRates: [...prev.customRates, { period: "", rate: "" }]
    }));
  };

  // Handle date changes
  const handleStartDateChange = (newValue) => {
   // console.log("date", newValue)
    setStartDate(newValue);
    setFormData(prev => ({
      ...prev,
      ava_from: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
    }));
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setFormData(prev => ({
      ...prev,
      ava_to: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        selling_type: formData.selling_type.join(","),
        custom_date:"",
        delivery_type: formData.delivery_type.join(","),
        scheduleDateTime: formData.scheduleDateTime ? dayjs(formData.scheduleDateTime).format('YYYY-MM-DD HH:mm:ss') : null
      };
  
      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/save_product`,
        payload
      );
      
      if (formData.schedule_status) {
        toast.success('Product scheduled successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.success('Product added successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || 'Failed to add product. Please try again.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleContinueBtn = () => {
    setCurrentState(2);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentState(1);
    window.scrollTo(0, 0);
  };

  // date
  const date24HoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(formData.scheduleDateTime || date24HoursFromNow);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col items-center w-full">
      <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
        {/* <SearchBar /> */}
        <div className="w-full flex flex-col items-center p-10 gap-10 bg-custom-gradient">
          <div className='bg-white w-[70%] flex flex-col px-10 py-5 rounded-xl'>
            <div className='flex justify-between items-center mb-10 border-b-2 pb-3'>
              <h1 className='text-[#808EA0] text-xl'>Fill in the details</h1>
              <button className='px-5 py-3 shadow-xl font-semibold border rounded-2xl'>Save & Exit</button>
            </div>

            <div className='flex flex-col w-full px-20 border-b-2 pb-20'>
              {currentState === 1 ? (
                <>
                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Name of the item *</label>
                    <TextField 
                      fullWidth 
                      placeholder="Name of the item" 
                      id="fullWidth"
                      value={formData.product_name}
                      onChange={(e) => handleInputChange("product_name", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Select category *</label>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.category_id}
                        placeholder="Category"
                        onChange={(e) => handleInputChange("category_id", e.target.value)}
                      >
                        {cat?.categories?.map((category, index) => (
                          <MenuItem value={category?.id} key={index + 1}>{category?.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Location *</label>
                    <TextField 
                      fullWidth 
                      id="fullWidth"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Description *</label>
                    <TextField
                      id="outlined-multiline-static"
                      multiline
                      rows={8}
                      fullWidth
                      placeholder="Describe the main features of your item"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Brand Name *</label>
                    <TextField 
                      fullWidth 
                      id="fullWidth" 
                      placeholder="Enter brand name of your item"
                      value={formData.brand_name}
                      onChange={(e) => handleInputChange("brand_name", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Model *</label>
                    <TextField 
                      fullWidth 
                      id="fullWidth" 
                      placeholder="Enter model type"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Year of manufacture *</label>
                    <TextField 
                      fullWidth 
                      id="fullWidth"
                      type="number"
                      value={formData.year_manufacture}
                      onChange={(e) => handleInputChange("year_manufacture", e.target.value)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', marginBottom: 3 }}>
                    <label className='mb-4 text-[#626060] font-medium' htmlFor='name'>Condition of your item *</label>
                    <div className='flex-wrap flex gap-7 w-full'>
                      {['Brand New', 'Like New', 'Very Good', 'Good'].map((condition, index) => (
                        <div key={index} className='flex justify-between items-center p-3 rounded-md w-[48%] shadow-md border'>
                          <div className='h-full'>
                            <h2 className='text-lg font-medium'>{condition}</h2>
                            <p className='text-[#B1A8A8] text-xs'>
                              {condition === 'Brand New' ? 'Never used it, still in original packing' :
                               condition === 'Like New' ? 'Used once or twice, no visible wear' :
                               condition === 'Very Good' ? 'Minor signs of use, well-maintained' :
                               'Visible wear, fully functional'}
                            </p>
                          </div>
                          <Radio
                            checked={formData.condition === condition}
                            onChange={() => handleInputChange("condition", condition)}
                            sx={{
                              color: pink[800],
                              '&.Mui-checked': {
                                color: pink[600],
                              },
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Box>

                  <ImageUpload 
                    onImagesChange={handleImagesChange}
                    initialImages={formData.images}
                  />
                </>
              ) : (
                <>
                    {/* Second state */}
                    <label className="text-[#626060] font-medium" htmlFor="name">
                      Availability *
                    </label>
                    <div className="flex flex-col gap-4">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="From"
                          value={startDate}
                          onChange={handleStartDateChange}
                          slotProps={{ textField: { fullWidth: true } }}
                          minDate={dayjs()}
                          maxDate={endDate || undefined}
                        />
                        <DatePicker
                          label="To"
                          value={endDate}
                          onChange={handleEndDateChange}
                          slotProps={{ textField: { fullWidth: true } }}
                          minDate={startDate || dayjs()}
                        />
                      </LocalizationProvider>
                    </div>

                    {/* Contact and Email fields */}
                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <label className="mb-4 text-[#626060] font-medium" htmlFor="name">
                        Enter contact number *
                      </label>
                      <TextField
                        fullWidth
                        placeholder="Enter your contact number"
                        id="fullWidth"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                      />
                    </Box>

                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <label className="mb-4 text-[#626060] font-medium" htmlFor="name">
                        Enter email address *
                      </label>
                      <TextField
                        fullWidth
                        placeholder="Enter your email address"
                        id="fullWidth"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </Box>

                    {/* Selling type section */}
                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <label className="mb-4 text-[#626060] font-medium" htmlFor="name">
                        Selling type *
                      </label>
                      <Box sx={{ display: "flex", flexDirection: "row", ml: 3 }}>
                        <FormControlLabel
                          sx={{ color: "#808EA0" }}
                          label="Delivery only"
                          control={
                            <Checkbox
                              sx={{
                                "&.Mui-checked": {
                                  color: "#DF4D4E",
                                },
                              }}
                              checked={formData.selling_type.includes("delivery")}
                              onChange={(e) => handleSellingTypeChange("delivery", e.target.checked)}
                            />
                          }
                        />
                        <FormControlLabel
                          sx={{ color: "#808EA0" }}
                          label="Pickup only"
                          control={
                            <Checkbox
                              sx={{
                                "&.Mui-checked": {
                                  color: "#DF4D4E",
                                },
                              }}
                              checked={formData.selling_type.includes("pickup")}
                              onChange={(e) => handleSellingTypeChange("pickup", e.target.checked)}
                            />
                          }
                        />
                        <FormControlLabel
                          sx={{ color: "#808EA0" }}
                          label="Available both"
                          control={
                            <Checkbox
                              checked={formData.selling_type.includes("both")}
                              onChange={(e) => handleSellingTypeChange("both", e.target.checked)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#DF4D4E",
                                },
                              }}
                            />
                          }
                        />
                      </Box>
                    </Box>

                    {/* Keywords section */}
                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <Typography sx={{ color: "#626060" }} className="mb-4" component="label" htmlFor="chips-input">
                        Add search keywords *
                      </Typography>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={keywords}
                        onChange={(_, newKeywords) => {
                          if (newKeywords.length <= 5) {
                            setKeywords(newKeywords);
                            setFormData(prev => ({
                              ...prev,
                              keywords_list: newKeywords
                            }));
                          }
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((keyword, index) => (
                            <Chip
                              key={index}
                              variant="outlined"
                              label={keyword}
                              {...getTagProps({ index })}
                              onDelete={() => handleDeleteKeyword(keyword)}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            placeholder={`Type and press Enter. ${5 - keywords.length} tags remaining`}
                            onKeyDown={handleKeyDown}
                          />
                        )}
                      />
                    </Box>

                    {/* Price section */}
                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <label className="mb-4 text-[#626060] font-medium" htmlFor="name">
                        Set your price *
                      </label>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3 }}>
                        <FormControl sx={{ width: "300px" }}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.price_type}
                            placeholder={formData.price_type}
                            sx={{ color: "#4D6079" }}
                            onChange={(e) => handleInputChange("price_type", e.target.value)}
                          >
                            {paymentTypes.map((paymentType, index) => (
                              <MenuItem value={paymentType} key={index + 1}>
                                {paymentType}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          placeholder="$"
                          id="fullWidth"
                          sx={{ color: "#4D6079" }}
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                        />
                      </Box>
                    </Box>
   <Box sx={{ width: "100%", marginBottom: 3 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label
                      className="mb-4 text-[#626060] font-medium"
                      htmlFor="name"
                    >
                      {" "}
                      Rental extension options
                    </label>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={formData.extend_status}
                          onChange={(e) =>
                            handleInputChange("extend_status", !formData.extend_status)
                          }
                        />
                      }
                    />
                  </Box>
                   {formData.extend_status && (
                    <>
                      <Box sx={{ width: "60%", marginBottom: 3 }}>
                        <Box
                          sx={{
                            marginBottom: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label
                            className="mb-4 text-[#626060] font-medium"
                            htmlFor="name"
                          >
                            {" "}
                            Rate per additional day
                          </label>
                          <TextField
                            sx={{ width: "30%" }}
                            placeholder="$"
                            id="fullWidth"
                            value={formData.rate_p_oned}
                            onChange={(e) =>
                              handleInputChange("rate_p_oned", e.target.value)
                            }
                          />
                        </Box>
                        <Box
                          sx={{
                            marginBottom: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label
                            className="mb-4 text-[#626060] font-medium"
                            htmlFor="name"
                          >
                            {" "}
                            Rate per additional two days
                          </label>
                          <TextField
                            sx={{ width: "30%" }}
                            placeholder="$"
                            id="fullWidth"
                            value={formData.rate_p_twod}
                            onChange={(e) =>
                              handleInputChange("rate_p_twod", e.target.value)
                            }
                          />
                        </Box>
                        <Box
                          sx={{
                            marginBottom: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label
                            className="mb-4 text-[#626060] font-medium"
                            htmlFor="name"
                          >
                            {" "}
                            Rate per additional three days
                          </label>
                          <TextField
                            sx={{ width: "30%" }}
                            placeholder="$"
                            id="fullWidth"
                            value={formData.rate_p_threed}
                            onChange={(e) =>
                              handleInputChange("rate_p_threed", e.target.value)
                            }
                          />
                        </Box>

                        <Box sx={{ width: "100%", marginBottom: 3 }}>
                          <label
                            className="mb-4 text-[#626060] font-medium"
                            htmlFor="name"
                          >
                            {" "}
                            Add custom rate
                          </label>
                          {formData.customRates.map((rate, index) => (
                            <Box
                              key={index}
                              sx={{
                                marginBottom: 2,
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <TextField
                                fullWidth
                                placeholder="Number of dates"
                                id="fullWidth"
                                value={rate.period}
                                onChange={(e) =>
                                  handleCustomRateChange(index, "period", e.target.value)
                                }
                              />
                              <TextField
                                fullWidth
                                placeholder="Rate"
                                id="fullWidth"
                                value={rate.rate}
                                onChange={(e) =>
                                  handleCustomRateChange(index, "rate", e.target.value)
                                }
                              />
                            </Box>
                          ))}
                        </Box>

                        <Box
                          sx={{
                            width: "100%",
                            marginBottom: 3,
                            display: "flex",
                            alignItems: "center",
                            
                          }}
                          onClick={addCustomRate}
                        >
                          <AddIcon />
                          <label
                            className="mb-4 text-[#626060] font-medium ml-1"
                            htmlFor="name"
                          >
                            {" "}
                            Add another custom rate
                          </label>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <label
                          className="mb-4 text-[#626060] font-medium"
                          htmlFor="name"
                        >
                          Maximum extension period
                        </label>
                        <FormControl sx={{ width: "300px", border: "none" }}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.max_ex_period}
                            placeholder="3 days"
                            sx={{ color: "#4D6079", border: "none" }}
                            onChange={(e) =>
                              handleInputChange("max_ex_period", e.target.value)
                            }
                          >
                            {extendedPeriods.map((extendedPeriod, index) => (
                              <MenuItem value={extendedPeriod} key={index + 1}>
                                {extendedPeriod} days
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </>
                  )}
                </Box>
                    {/* Schedule section */}
                    <Box sx={{ width: "100%", marginBottom: 3 }}>
                      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ width: "80%", marginBottom: 3 }}>
                          <div className="flex items-center gap-4">
                            <h1 className="text-3xl text-[#1A3353] font-medium">
                              Schedule
                            </h1>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  checked={formData.schedule_status}
                                  onChange={(e) => handleInputChange("schedule_status", e.target.checked)}
                                />
                              }
                            />
                          </div>
                          {formData.schedule_status && (
                            <>
                              <h6 className="mb-4 text-[#808EA0] italic text-sm">
                                Select when you want your post to be published
                              </h6>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  label="Date & Time"
                                  value={formData.scheduleDateTime}
                                  onChange={(newValue) => handleInputChange("scheduleDateTime", newValue)}
                                  slotProps={{ textField: { fullWidth: true } }}
                                />
                              </LocalizationProvider>
                              <h1 className="text-xl text-black font-medium">
                                {formattedDate} <KeyboardArrowDownOutlinedIcon />
                              </h1>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </>
              )}
            </div>

            {currentState === 1 ? (
              <button
                onClick={handleContinueBtn}
                className="ml-auto bg-[#D10002] text-[#FFF] px-20 my-10 py-4 mb-4 rounded-md shadow-md"
              >
                Continue
              </button>
            ) : (
              <div className="flex w-full justify-center items-center gap-10 mt-10">
                <Button
                  onClick={handleBack}
                  sx={{
                    borderRadius: 3,
                    alignSelf: 'center',
                    paddingY: 1.5,
                    width: '40%',
                  }}
                  variant="outlined"
                  color="error"
                >
                  BACK
                </Button>
                <Button
                  sx={{
                    borderRadius: 3,
                    alignSelf: 'center',
                    paddingY: 1.5,
                    width: '40%',
                    backgroundColor: '#D10002',
                    color: '#FFFFFF',
                  }}
                  variant="outlined"
                  onClick={handleSubmit}
                >
                  {!formData.schedule_status ? "Add good" : "Schedule"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AddNewGoodPage;


