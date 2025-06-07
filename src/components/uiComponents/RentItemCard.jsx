/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, CardMedia, Typography, Divider, Box, Table, TableBody, TableRow, TableCell } from "@mui/material";

const RentItemCard = ({ selectedDateRange, item }) => {
    console.log(item)
    const { price,name,images,product,} = item;
    console.log("images",images)
    console.log("price",price)
    const [startDate, endDate] = selectedDateRange || [];

    const calculateDays = (start, end) => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const dayInMs = 1000 * 60 * 60 * 24;
        return Math.ceil((endTime - startTime) / dayInMs);
    };

    const formatDate = (date) => {
        const currentYear = new Date().getFullYear();
        const dateObj = new Date(date);
        const options = { month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" };
        if (dateObj.getFullYear() !== currentYear) {
            options.year = "numeric";
        }
        return dateObj.toLocaleString("en-US", options).replace(",", " |");
    };

    const totalDays = calculateDays(startDate, endDate);
    const totalPrice = ((price||product?.price / 30) * totalDays).toFixed(2);
if(product){
    return (
        <Card className="rounded-xl shadow-lg p-1 w-full mx-auto border border-[#B3BBC68A]">
            {/* Car Image */}
            <CardContent>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <CardMedia
                        component="img"
                        image={product?.images[0]}
                        alt={product?.name||name}
                        className="rounded-lg mb-4"
                        style={{ width: 70 }}
                    />

                    {/* Car Name and Price */}
                    <div className="flex flex-col justify-center items-start mb-4">
                        <Typography variant="h6" className="font-bold">
                            {product?.name||name}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: 16 }} className="text-[#7A7597] font-bold">
                            ${product?.price||price}
                            <span className="text-gray-500 text-xs font-medium"> /{product?.price_type}</span>
                        </Typography>
                    </div>
                </Box>

                <Divider sx={{ marginY: 1, color: '#E6E8EC' }} />

                {/* Rental Details in Table */}
                <Table sx={{ "& td": { border: 0, padding: "8px 0" } }}>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography color="#938C8C">Pick-up Date & Time</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{formatDate(startDate)}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography color="#938C8C">Return Date & Time</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{formatDate(endDate)}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography color="#938C8C">Amount</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography sx={{ fontSize: 20, fontWeight: 500 }} >${(product?.price||price).toFixed(2)} <span className="text-[#B1A8A8] text-sm font-normal">/month</span></Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography color="#938C8C">Total Days</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>{totalDays}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography color="#938C8C">Fees</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography>${totalPrice}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Divider sx={{ marginY: 1, color: '#E6E8EC' }} className />

                {/* Total */}
                <div className="flex justify-between items-center font-bold text-lg mt-2">
                    <Typography color="#938C8C" sx={{ fontSize: 18, fontWeight: 500 }}>Total</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 500 }} >${totalPrice}</Typography>
                </div>
            </CardContent>
        </Card>
    );

}
return (
    <Card className="rounded-xl shadow-lg p-1 w-full mx-auto border border-[#B3BBC68A]">
        {/* Car Image */}
        <CardContent>
            <Box sx={{ display: "flex", gap: 1 }}>
                <CardMedia
                    component="img"
                    image={images[0]}
                    alt={product?.name||name}
                    className="rounded-lg mb-4"
                    style={{ width: 70 }}
                />

                {/* Car Name and Price */}
                <div className="flex flex-col justify-center items-start mb-4">
                    <Typography variant="h6" className="font-bold">
                        {product?.name||name}
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: 16 }} className="text-[#7A7597] font-bold">
                        ${product?.price||price}
                        <span className="text-gray-500 text-xs font-medium"> /Per month</span>
                    </Typography>
                </div>
            </Box>

            <Divider sx={{ marginY: 1, color: '#E6E8EC' }} />

            {/* Rental Details in Table */}
            <Table sx={{ "& td": { border: 0, padding: "8px 0" } }}>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography color="#938C8C">Pick-up Date & Time</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography>{formatDate(startDate)}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="#938C8C">Return Date & Time</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography>{formatDate(endDate)}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="#938C8C">Amount</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography sx={{ fontSize: 20, fontWeight: 500 }} >${(product?.price||price).toFixed(2)} <span className="text-[#B1A8A8] text-sm font-normal">/month</span></Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="#938C8C">Total Days</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography>{totalDays}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography color="#938C8C">Fees</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography>${totalPrice}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Divider sx={{ marginY: 1, color: '#E6E8EC' }} className />

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-lg mt-2">
                <Typography color="#938C8C" sx={{ fontSize: 18, fontWeight: 500 }}>Total</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 500 }} >${totalPrice}</Typography>
            </div>
        </CardContent>
    </Card>
);
  
};

export default RentItemCard;
