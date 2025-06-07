/* eslint-disable react/prop-types */
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const CalenderCard = ({ calenderUiProps, onDateChange, item}) => {
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const location = useLocation();

    // Convert availability dates to dayjs objects
    const availableFrom = item?.ava_from ? dayjs(item.ava_from) : dayjs();
    const availableTo = item?.ava_to ? dayjs(item.ava_to) : dayjs().add(1, 'year');

    const handleCalendarOpen = () => {
        setCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setCalendarOpen(false);
    };

    const handleApplyDateRange = () => {
        setCalendarOpen(false);
        // Format dates before passing to parent
        const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
        const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;
        onDateChange([formattedStartDate, formattedEndDate]);
    };

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    return (
        <Box sx={{ width: '100%', marginBottom: 3 }}>
            <div className={`flex justify-between items-center ${location.pathname === "/search" ? "flex-col" : ""}`}>
                <Box sx={{
                    width: location.pathname === "/search" ? "100%" : '45%',
                    marginTop: 1
                }}>
                    <label
                        className={`
                        ${location.pathname === "/search" ? "hidden" : ""}
                        mb-4 font-medium text-[#808EA0] italic`}
                        htmlFor="name"
                    >
                        {calenderUiProps.startName}
                    </label>
                    <TextField
                        onClick={handleCalendarOpen}
                        fullWidth
                        placeholder="Select Dates"
                        id="fullWidth"
                        value={startDate ? dayjs(startDate).format('MM/DD/YYYY') : ""}
                    />
                </Box>

                <Box sx={{
                    marginTop: 2,
                    width: location.pathname === "/search" ? "100%" : '45%',
                }}>
                    <label
                        className={`
                        ${location.pathname === "/search" ? "hidden" : ""}
                        mb-4 font-medium text-[#808EA0] italic`}
                        htmlFor="name"
                    >
                        {calenderUiProps.endName}
                    </label>
                    <TextField
                        onClick={handleCalendarOpen}
                        fullWidth
                        placeholder="Select Dates"
                        id="fullWidth"
                        value={endDate ? dayjs(endDate).format('MM/DD/YYYY') : ""}
                    />
                </Box>

                <Dialog open={calendarOpen} onClose={handleCalendarClose} maxWidth="md">
                    <Box sx={{ padding: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ marginBottom: 2, textAlign: "center" }}
                        >
                            Select Dates
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex flex-col gap-4">
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    minDate={availableFrom}
                                    maxDate={endDate || availableTo}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    minDate={startDate || availableFrom}
                                    maxDate={availableTo}
                                />
                            </div>
                        </LocalizationProvider>
                        <Button
                            onClick={handleApplyDateRange}
                            sx={{
                                backgroundColor: '#D10002',
                                color: '#fff',
                                paddingX: 4,
                                paddingY: 1,
                                marginTop: 3,
                                float: "right",
                            }}
                        >
                            Apply
                        </Button>
                    </Box>
                </Dialog>
            </div>
        </Box>
    );
};

export default CalenderCard;
