/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { Box, IconButton, Radio } from '@mui/material';
import CalenderCard from "../../components/uiComponents/CalenderCArd";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const RentItemRequestPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {};
    const [selectedValue, setSelectedValue] = React.useState("delivery"); // Default to 'delivery'
    const [selectedDateRange, setSelectedDateRange] = React.useState([null, null]);
console.log("item show",item)
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCalendarDates = (dates) => {
        setSelectedDateRange(dates);
    };

    const handleContinue = () => {
        navigate("/rentitemdetails", {
            state: {
                data: {
                    item,
                    selectedValue,
                    selectedDateRange,
                },
            },
        });
    };

    return (
        <div className="w-full  border-t shadow-md flex flex-col justify-center items-start pl-40">
            <Box sx={{ display: 'flex', gap: 1, marginY: 6, alignItems: 'center' }}>
            <div className="flex items-center px-4 py-5 border-b border-gray-100">
                    <IconButton 
                        onClick={() => navigate(-1)}
                        className="mr-2 hover:bg-gray-100"
                        size="small"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    {/* <SearchBar /> */}
                </div>
                <h1 className="text-2xl font-medium">Request to rent</h1>
            </Box>

            <Box sx={{ width: '80%', marginBottom: 2 }}>
                <h2 className="text-xs font-medium">
                    Please choose the start and end date for your rental <span className="text-[#908CA8] text-xs italic">NOTE: Rentals must be booked at least 24 hours in advance</span>
                </h2>
                <CalenderCard
                    calenderUiProps={{ startName: "Start date *", endName: "End date *" }}
                    onDateChange={handleCalendarDates}
                    item={item}
                />
            </Box>

            <Box sx={{ width: '50%', marginBottom: 2 }}>
                <h2 className="text-xs font-medium">Choose whether you’d prefer delivery to your address or to pick up the item yourself.</h2>
                <Box sx={{ display: 'flex', width: '100%', marginY: 3, gap: 8 }}>
                    <div
                        onClick={() => setSelectedValue('delivery')}
                        style={{
                            backgroundColor: selectedValue === "delivery" ? "#EEEFF2" : "#FFFFFF",
                            borderColor: selectedValue === "delivery" ? '#808EA0' : "#E6E8EC",
                        }}
                        className='flex  justify-between items-center px-2 w-1/3 py-1 rounded-md shadow-md border'>
                        <h2 className='text-'>Delivery</h2>
                        <Radio
                            checked={selectedValue === "delivery"}
                            onChange={handleRadioChange}
                            value="delivery"
                            name="delivery-option"
                            sx={{
                                color: '#D9D9D9',
                                '&.Mui-checked': {
                                    color: '#D10002',
                                },
                            }}
                        />
                    </div>
                    <div
                        onClick={() => setSelectedValue('pickup')}
                        style={{
                            backgroundColor: selectedValue === "pickup" ? "#EEEFF2" : "#FFFFFF",
                            borderColor: selectedValue === "pickup" ? '#808EA0' : "#E6E8EC",
                        }}
                        className='flex  justify-between items-center px-2 w-1/3 py-1 rounded-md shadow-md border'>
                        <h2 className='text-'>Pick up</h2>
                        <Radio
                            checked={selectedValue === "pickup"}
                            onChange={handleRadioChange}
                            value="pickup"
                            name="delivery-option"
                            sx={{
                                color: '#D9D9D9',
                                '&.Mui-checked': {
                                    color: '#D10002',
                                },
                            }}
                        />
                    </div>
                </Box>
            </Box>
            <button onClick={handleContinue} className="bg-[#D10002] text-[#FFF] px-20 py-4 mb-4 rounded-md shadow-md">
                Continue
            </button>
        </div >
    );
};

export default RentItemRequestPage;
