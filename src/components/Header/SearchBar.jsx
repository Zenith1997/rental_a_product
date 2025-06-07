import {
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Drawer,
} from "@mui/material";
import { Search, Tune } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Filter from "../uiComponents/Filter";
import useSWR from "swr";
import apiRoutes from "../../lib/apiRoutes";
import useFetcher from "../../lib/fetcher";
import useSearchStore from "../../store/searchStore";
import { useFilterStore } from "../../store";
import useAxiosAuth from "../../lib/auth";
import { ClearIcon } from "@mui/x-date-pickers";
import { toast } from 'react-toastify';
import { RiseLoader } from "react-spinners";

const categories = [
  { value: "Goods", label: "Goods" },
  { value: "Services", label: "Services" },
];

const SearchBar = () => {
  const {
    page,
    limit,
    flocation,
    delivery_type,
    setFilter,
    ava_from,
    ava_to,
    priceMin,
    priceMax,
    category,
    setFilteredProducts,
  } = useFilterStore();
  const fetcher = useFetcher();
  const [isOpen, setisOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const axiosAuth = useAxiosAuth();
  const searchContainerRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (query) => {
    if (!query?.trim()) {
      setFilteredProducts(null);
      return;
    }

    setIsSearching(true);
    try {
      setFilter("product_name", query);
      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/get_home_items`,
        {
          page,
          limit,
          product_name: query,
          category,
          ava_from,
          ava_to,
          flocation,
          priceMin,
          priceMax,
          delivery_type,
        }
      );
      
      if (response?.data?.data) {
        setFilteredProducts(response.data.data);
      } else {
        setFilteredProducts([]);
        toast.info("No products found matching your search.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error(error.response?.data?.message || "Search failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      setFilteredProducts(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    performSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredProducts(null);
    setShowSuggestions(false);
  };

  const { data: cat } = useSWR(
    apiRoutes.getCategoryList({
      page: 1,
      limit: 10,
    }),
    fetcher
  );

  const { data: suggestions } = useSWR(
    searchQuery?.trim() ? apiRoutes.getProductNameList({
      page: 1,
      limit: 10,
      search: searchQuery,
    }) : null,
    fetcher
  );

  const handleFilter = () => {
    setFilter("flocation", "");
    setFilter("delivery_type", "");
    setFilter("ava_from", "");
    setFilter("ava_to", "");
    setFilter("priceMin", "");
    setFilter("priceMax", "");
    setFilter("category", "");
    setFilter("filterOn", false);
    setisOpen((prev) => !prev);
  };

  const handleClose = () => {
    setisOpen((prev) => !prev);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.product_name);
    performSearch(suggestion.product_name);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col  items-center w-[100vw] relative px-4 py-3" ref={searchContainerRef}>
      <Box
        display="flex"
        alignItems="center"
        className="bg-white-100 border px-4 border-gray-200 rounded-full shadow-sm w-[60vw]"
        sx={{ 
          borderWidth: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(45, 55, 72, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(45, 55, 72, 0.5)',
            boxShadow: '0 0 0 1px rgba(45, 55, 72, 0.5)',
          },
          '&:focus-within': {
            borderColor: '#4A5568',
            boxShadow: '0 0 0 2px rgba(45, 55, 72, 0.3)',
            backgroundColor: 'rgba(45, 55, 72, 0.05)',
          }
        }}
      >
        <TextField
          select
          defaultValue="Goods"
          variant="standard"
          className="bg-transparent"
          InputProps={{
            disableUnderline: true,
            classes: { root: "text-sm font-medium" },
          }}
          SelectProps={{
            MenuProps: {
              classes: {
                paper: "shadow-lg",
              },
            },
          }}
          sx={{
            width: 100,
            "& .MuiSelect-select": {
              padding: "12px 8px",
              fontSize: "14px",
              color: 'rgba(45, 55, 72, 0.8)',
              transition: 'color 0.3s ease',
              '&:focus': {
                color: '#2D3748',
              }
            },
            "& .MuiSelect-icon": {
              color: 'rgba(45, 55, 72, 0.8)',
              transition: 'color 0.3s ease',
            },
            '&:hover .MuiSelect-select': {
              color: '#2D3748',
            },
            '&:hover .MuiSelect-icon': {
              color: '#2D3748',
            }
          }}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <span className="mx-3 text-gray-400">|</span>

        <TextField
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="What are you looking for?"
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
            classes: { root: "h-12 text-sm" },
            endAdornment: (
              <InputAdornment position="end" className="mr-2">
                {isSearching ? (
                  <RiseLoader color="#4A5568" size={8} />
                ) : (
                  <>
                    {searchQuery && (
                      <IconButton 
                        onClick={handleClearSearch}
                        size="small"
                        className="mr-1"
                        sx={{
                          color: 'rgba(45, 55, 72, 0.7)',
                          '&:hover': {
                            color: '#2D3748',
                            backgroundColor: 'rgba(45, 55, 72, 0.1)',
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                    <IconButton 
                      onClick={handleSearchClick}
                      size="small"
                      className="mr-1"
                      sx={{
                        color: 'rgba(45, 55, 72, 0.7)',
                        '&:hover': {
                          color: '#2D3748',
                          backgroundColor: 'rgba(45, 55, 72, 0.1)',
                        }
                      }}
                    >
                      <Search />
                    </IconButton>
                    <IconButton 
                      onClick={handleFilter}
                      size="small"
                      sx={{
                        color: 'rgba(45, 55, 72, 0.7)',
                        '&:hover': {
                          color: '#2D3748',
                          backgroundColor: 'rgba(45, 55, 72, 0.1)',
                        }
                      }}
                    >
                      <Tune />
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            "& input": {
              padding: "12px 8px",
              fontSize: "14px",
              color: 'rgba(45, 55, 72, 0.8)',
              transition: 'all 0.3s ease',
              '&::placeholder': {
                color: 'rgba(45, 55, 72, 0.5)',
                transition: 'color 0.3s ease',
              },
              '&:focus': {
                color: '#2D3748',
                '&::placeholder': {
                  color: 'rgba(45, 55, 72, 0.7)',
                }
              }
            },
          }}
        />
      </Box>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery && suggestions?.data?.length > 0 && (
        <Box
          className="bg-white shadow-lg border border-gray-200 rounded-lg mt-1 w-full"
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: "300px",
            overflowY: "auto",
            marginTop: "4px",
            backgroundColor: '#F7FAFC',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(45, 55, 72, 0.1)',
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(45, 55, 72, 0.2)",
              borderRadius: "4px",
              '&:hover': {
                backgroundColor: "rgba(45, 55, 72, 0.3)",
              }
            },
          }}
          role="listbox"
          tabIndex={0}
          onKeyDown={(e) => {
            const items = suggestions.data;
            const currentIndex = items.findIndex(
              (item) => item.product_name === searchQuery
            );

            if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              handleSuggestionClick(items[nextIndex]);
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              handleSuggestionClick(items[prevIndex]);
            }

            if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
        >
          {suggestions.data.map((item, index) => (
            <Box
              key={index}
              onClick={() => handleSuggestionClick(item)}
              className={`px-4 py-2.5 w-full cursor-pointer transition-all duration-200 text-sm flex items-center gap-3 border-b border-gray-200 last:border-b-0 ${
                item.product_name === searchQuery ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              role="option"
              aria-selected={item.product_name === searchQuery}
            >
              <Search className="text-gray-500" sx={{ fontSize: 18 }} />
              <span className="text-gray-700 font-medium">
                {item.product_name}
              </span>
            </Box>
          ))}
        </Box>
      )}

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "25vw",
            padding: "24px",
            backgroundColor: '#F7FAFC',
          },
        }}
      >
        <Filter categories={cat?.categories} />
      </Drawer>
    </div>
  );
};

export default SearchBar;
