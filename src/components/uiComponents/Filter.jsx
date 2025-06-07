import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import DatePicker from "./DatePicker";
import { useState } from "react";
import { useFilterStore } from '../../store';
import PriceRangeSlider from "./Slider";
import PropTypes from 'prop-types';
import useAxiosAuth from "../../lib/auth";
import { toast } from 'react-toastify';

const Filter = ({ categories }) => {
  const [fcategory, setCategory] = useState('');
  const { page, limit, flocation, delivery_type, setFilter, ava_from, ava_to, product_name, priceMin, priceMax, category, filterOn, setFilteredProducts,filteredProducts } = useFilterStore();
const axiosAuth = useAxiosAuth()
  const handleFilter = async () => {
    
    setFilter('filterOn', !filterOn);
    try {
      const response = await axiosAuth.post(`${import.meta.env.VITE_BASE_URL}/api/products/get_home_items`, {
        page,
        limit,
        product_name,
        category,
        ava_from,
        ava_to,
        flocation,
        priceMin,
        priceMax,
        delivery_type
      });
      
      if (!response.data) {
        throw new Error('Filter request failed');
      }

      // Store the filtered products in the store
      setFilteredProducts(response?.data?.data);
      console.log("filteredProducts", filteredProducts)
      
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error("Failed to apply filters. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

   

  const handleChange = (event) => {
    setCategory(event.target.value);
    setFilter('category', event.target.value);
  };

  const handleReset = () => {
    setCategory('');
    setFilter('filterOn', !filterOn);
    setFilter('category', '');
    setFilter('flocation', '');
    setFilter('ava_from', '');
    setFilter('ava_to', '');
    setFilter('priceMin', '');
    setFilter('priceMax', '');
    setFilter('delivery_type', '');

  };

  const isAnyFilterActive = () => {
    return category || flocation || ava_from || ava_to || priceMin || priceMax || delivery_type;
  };

  return (
    <div className="bg-white shadow-lg w-[25vw] rounded-lg border border-gray-200 overflow-hidden">
      {/* Header - Enhanced styling */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 flex justify-between items-center border-b border-orange-200">
        <div className="flex items-center gap-2">
          <h2 className="text-xl text-gray-800">Filter Options</h2>
          {isAnyFilterActive() && (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">
              Active
            </span>
          )}
        </div>
        <button 
          onClick={handleReset}
          className="text-orange-600 hover:text-orange-800 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-all duration-200 flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All
        </button>
      </div>

      {/* Main content area with enhanced padding and spacing */}
      <div className="px-6 py-6 space-y-8">
        {/* Date Duration */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-bold mb-2">
            Date Range
          </label>
          <DatePicker />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex justify-between flex-row">

          <label className="block text-gray-700 font-bold mb-2">
            Price Range
          </label>
          <p className="text-gray-600 mb-3 bg-gray-50 px-4 py-2 rounded-lg">
            ${priceMin || '0'} - ${priceMax || '0'}
          </p>
          </div>
          <PriceRangeSlider />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category-select" className="block font-bold  mb-2">
            Category
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={fcategory}
              onChange={handleChange}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 hover:border-orange-300 active:border-orange-400"
            >
              <option value="" disabled>Select a category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location-input" className="block font-bold  mb-2">
            Location
          </label>
          <div className="relative">
            <input
              id="location-input"
              onChange={(e) => setFilter('flocation', e.target.value)}
              type="text"
              value={flocation || ''}
              className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 hover:border-orange-300 active:border-orange-400"
              placeholder="Enter your location"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="space-y-2">
          <label className="block font-bold  mb-2">
            Delivery Option
          </label>
          <RadioGroup
            row
            aria-labelledby="delivery-options-radio-group"
            name="delivery-options"
            className="mt-1"
          >
            <Box sx={{ display: 'flex', width: '100%', gap: 4 }}>
              <FormControlLabel 
                onClick={(e) => setFilter('delivery_type', e.target.value)}
                value="Delivery" 
                control={<Radio sx={{ 
                  '&.Mui-checked': { color: '#f97316' },
                  '&:hover': { backgroundColor: 'rgba(249, 115, 22, 0.04)' }
                }} />} 
                label="Delivery" 
              />
              
              <FormControlLabel 
                onClick={(e) => setFilter('delivery_type', e.target.value)}
                value="Pick-up" 
                control={<Radio sx={{ 
                  '&.Mui-checked': { color: '#f97316' },
                  '&:hover': { backgroundColor: 'rgba(249, 115, 22, 0.04)' }
                }} />} 
                label="Pick-up" 
              />
            </Box>
          </RadioGroup>
        </div>

        {/* Apply/Reset Button */}
        <button 
          onClick={handleFilter}
          className={`w-full ${
            filterOn 
              ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
              : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
          } text-white py-3.5 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filterOn ? 'focus:ring-red-300' : 'focus:ring-orange-300'
          }`}
        >
          {filterOn ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filter
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Apply Filters
            </>
          )}
        </button>
      </div>
    </div>
  );
};

Filter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired
    })
  )
};

export default Filter;  