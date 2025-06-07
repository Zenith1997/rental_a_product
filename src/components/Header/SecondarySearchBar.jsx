import { useState, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { RiseLoader } from "react-spinners";
import useSWR from "swr";
import useAxiosAuth from "../../lib/auth";
import apiRoutes from "../../lib/apiRoutes";
import { useFilterStore } from "../../store";

export default function SecondarySearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const startRef = useRef();
  const endRef = useRef();
  const inputRef = useRef();
const {setFilteredProducts} = useFilterStore();
  const axiosAuth = useAxiosAuth();
  const fetcher = (url) => axiosAuth.get(url).then(res => res.data);

  // Fetch categories
  const { data: cat } = useSWR(
    apiRoutes.getCategoryList({ page: 1, limit: 10 }),
    fetcher
  );

  // Fetch suggestions for the query
  const { data: suggestions } = useSWR(
    query.trim()
      ? apiRoutes.getProductNameList({ page: 1, limit: 10, search: query })
      : null,
    fetcher
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/get_home_items`,
        {
          product_name: query,
          category,
          ava_from: startDate,
          ava_to: endDate,
          page: 1,
          limit: 20,
        }
      );
      if (response?.data?.data?.length) {
        onResults && onResults(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        toast.info("No products found matching your search.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        onResults && onResults([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Search failed. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );
      onResults && onResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const rangeDisplay =
    startDate && endDate
      ? `${startDate} - ${endDate}`
      : startDate
      ? `${startDate} - End`
      : "";

  const handleSuggestionClick = (item) => {
    setQuery(item.product_name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current.blur();
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleInputFocus = () => {
    if (suggestions?.data?.length > 0) setShowSuggestions(true);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleInputKeyDown = (e) => {
    if (!suggestions?.data?.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.data.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.data.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions.data[highlightedIndex]) {
        e.preventDefault();
        handleSuggestionClick(suggestions.data[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSearch}
        className="flex flex-row items-center gap-4 justify-evenly py-4 text-gray-500 px-4 bg-gray-200 rounded-md shadow w-[80vw] min-w-[320px] mx-auto -mt-8"
      >
        <div className="relative w-96">
          <input
            ref={inputRef}
            type="text"
            placeholder="What are you looking for"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="bg-white rounded-md p-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-400 caret-transparent"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions-list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
            }
          />
          {showSuggestions && query && suggestions?.data?.length > 0 && (
            <div
              id="search-suggestions-list"
              className="absolute left-0 right-0 z-50 bg-black text-white rounded shadow-lg mt-1 w-full max-h-72 overflow-y-auto"
              style={{ border: '1px solid #333' }}
              role="listbox"
              tabIndex={0}
            >
              {suggestions.data.map((item, index) => (
                <div
                  key={index}
                  id={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(item)}
                  className={`px-4 py-2 cursor-pointer ${
                    index === highlightedIndex ? 'bg-gray-700' : ''
                  }`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                >
                  {item.product_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white rounded-md p-4 text-sm w-96 md:w-96 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="">All Categories</option>
          {cat?.categories?.map((option) => (
            <option key={option.value} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
        <div className="relative w-96">
          <input
            type="text"
            readOnly
            value={rangeDisplay}
            placeholder="Select date range"
            className="bg-white rounded-md p-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-400 caret-transparent"
            onFocus={() => startRef.current && startRef.current.showPicker()}
            onClick={() => startRef.current && startRef.current.showPicker()}
          />
          <input
            ref={startRef}
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setTimeout(() => endRef.current && endRef.current.showPicker(), 100);
            }}
            className="absolute left-0 top-0 opacity-0 pointer-events-none"
            tabIndex={-1}
          />
          <input
            ref={endRef}
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="absolute left-0 top-0 opacity-0 pointer-events-none"
            tabIndex={-1}
          />
        </div>
        <button
          type="submit"
          className="bg-red-700 hover:bg-red-800 w-96 md:w-96 text-white font-semibold rounded-md p-4 text-sm transition-colors shadow flex items-center justify-center"
          disabled={isSearching}
        >
          {isSearching ? <RiseLoader color="#fff" size={8} /> : "SEARCH"}
        </button>
      </form>
    </div>
  );
}

SecondarySearchBar.propTypes = {
  onResults: PropTypes.func,
};
