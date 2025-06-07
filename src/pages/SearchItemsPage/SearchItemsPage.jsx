/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../../components/uiComponents/ItemCard";
import SearchBar from "../../components/Header/SearchBar";
import {
    TextField,
    InputAdornment,
    Button,
    Slider,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/system";
import CalenderCard from "../../components/uiComponents/CalenderCArd";

import { productList } from "../../assets/dummyData/ProductList";

const CustomSlider = styled(Slider)({
    color: "#D10002",
    height: 4,
    "& .MuiSlider-thumb": {
        width: 12,
        height: 12,
        backgroundColor: "#D10002",
        "&:hover, &.Mui-focusVisible, &.Mui-active": {
            boxShadow: "0px 0px 0px 8px rgba(209, 0, 2, 0.16)",
        },
    },
    "& .MuiSlider-track": {
        backgroundColor: "#D10002",
    },
    "& .MuiSlider-rail": {
        color: "#D9D9D9",
    },
    "& .MuiSlider-markLabel": {
        color: "#4D6079",
        fontSize: "12px",
        fontWeight: 400,
    },
});

const CustomRadio = styled(Radio)({
    color: "#D9D9D9",
    "&.Mui-checked": {
        color: "#D10002",
    },
});

const SearchItemsPage = () => {
    const [searchParams] = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([100, 1500]);
    const [deliveryMethod, setDeliveryMethod] = useState("pickup");
    const [location, setLocation] = useState("");

    useEffect(() => {
        const query = searchParams.get("query")?.toLowerCase() || "";
        const filtered = productList.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    }, [searchParams]);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleDeliveryChange = (event) => {
        setDeliveryMethod(event.target.value);
    };

    const handleDateChange = (selectedDateRange) => {
        //console.log("Selected Date Range:", selectedDateRange);
    };

    return (
        <div className="w-full items-center flex flex-col">
            {/* <SearchBar /> */}
            <div className="pt-10 px-5 md:px-10 lg:px-20 flex flex-col lg:flex-row gap-5 border-t">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4">
                    <div className="border border-[#CCD2D9] rounded-3xl overflow-hidden">
                        <div className="flex justify-between w-full p-5 bg-[#EEEFF2]">
                            <h2 className="font-semibold">Filter</h2>
                            <Button
                                variant="text"
                                sx={{
                                    color: "#67778C",
                                    fontSize: "11px",
                                }}
                                onClick={() => {
                                    setPriceRange([100, 1500]);
                                    setDeliveryMethod("pickup");
                                    setLocation("");
                                }}
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="p-5 px-7">
                            <h1>Date duration</h1>
                            <CalenderCard
                                calenderUiProps={{
                                    startName: "Start Date",
                                    endName: "End Date",
                                }}
                                onDateChange={handleDateChange}
                                layoutClass={location ? "flex-col" : "flex-row"}
                            />

                            <h1 className="mt-5">Location</h1>
                            <TextField
                                label="Enter Location"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />

                            <div className="mt-6">
                                <h1>Price range</h1>
                                <CustomSlider
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    marks={[
                                        { value: 100, label: "$100" },
                                        { value: 500, label: "$500" },
                                        { value: 1000, label: "$1000" },
                                        { value: 1500, label: "$1500" },
                                    ]}
                                    min={100}
                                    max={1500}
                                />
                            </div>

                            <div className="mt-6">
                                <h1>Delivery Method</h1>
                                <RadioGroup
                                    value={deliveryMethod}
                                    onChange={handleDeliveryChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="delivery"
                                        control={<CustomRadio />}
                                        label="Delivery"
                                    />
                                    <FormControlLabel
                                        value="pickup"
                                        control={<CustomRadio />}
                                        label="Pick up"
                                    />
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full lg:w-3/4">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredProducts.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center">
                            No results found for your search query.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchItemsPage;
