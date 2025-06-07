import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/Header/SearchBar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VisaIcon from "../../assets/svgFiles/VisaIcon";
import paypalImg from "../../assets/images/paypalImg.png";
import applePayImg from "../../assets/images/applePayImg.png";
import gpayImg from "../../assets/images/gpayImg.png";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
} from "@mui/material";
import PaymentSuccessIcon from "../../assets/svgFiles/PaymentSuccessIcon";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/Stripe/CheckoutForm";

const stripePromise = loadStripe("pk_test_51QvyziBNXUEdOXuIxmcJIm0JTA0Us1tAcSPRjaNOv0eu8hghTfO50JNuJjGhV69kfOYpEoU39wDQj3EuEQjjkXEL00KVvcIQ7I");

const PaymentSuccessFullModel = ({ open, handleClose, amount }) => {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          paddingX: 10,
          paddingY: 4,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <PaymentSuccessIcon />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            my: 5,
          }}
        >
          <h1 className="text-center font-semibold text-xl leading-loose tracking-wider">
            Your payment of ${amount}
            <br />
            was successful!
          </h1>
          <button className="bg-[#FAE6E6] text-[#000] font-medium px-20 mt-2 py-4 mb-2 rounded-2xl shadow-md">
            View receipt
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="bg-[#D10002] text-[#FFF] font-medium px-20 py-4 rounded-2xl shadow-md"
          >
            Back to home
          </button>
        </Box>
      </Box>
    </Dialog>
  );
};

PaymentSuccessFullModel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
};

const PaymentPage = () => {
  const location = useLocation();
  const item = location.state || {};
  const order = item?.orderDetails||{}
  console.log("payment page order",order)

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handlePaymentBtn = () => {
    setPaymentDialogOpen(true);console.log("teette")
  };
  const handleCloseDialog = () => {
    setPaymentDialogOpen(false);
  };

  if (!order) {
    return <div>Item not found</div>;
  }

  // Calculate total amount
  const rentFee = order.extend_amount?order.extend_amount:order.amount || 0;
  const deliveryFees = order.delivery_type === "Pickup" ? 0 : 20.0;
  const totalAmount = rentFee + deliveryFees;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  return (
    <div className="w-full flex flex-col items-center pb-20 bg-[#fafbfc] min-h-screen">
      {/* <SearchBar /> */}
      <div className="w-full flex flex-col border-t items-center">
        <div className="w-full max-w-5xl flex gap-10 justify-between mt-10">
          {/* Payment Method Selection */}
          <div className="flex w-3/5 flex-col">
            <div className="flex items-center mb-8 gap-6">
              <ArrowBackIosIcon />
              <h1 className="text-2xl font-semibold">Payment method</h1>
            </div>
            <div className="ml-8">
              <div className="grid grid-cols-2 w-full gap-4">
                <div
                  onClick={() => setPaymentMethod("visa")}
                  className={`p-4 px-8  items-center flex justify-center rounded-xl border transition-all duration-200 shadow-sm ${
                    paymentMethod === "visa"
                      ? "border-[#D10002] bg-[#fff0f0]"
                      : "border-[#CFC9C9] bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <VisaIcon />
                    <span className="text-xs mt-2 text-[#1A3353]">Credit/ Debit card</span>
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-4 px-8  items-center flex flex-col justify-center rounded-xl border transition-all duration-200 shadow-sm ${
                    paymentMethod === "paypal"
                      ? "border-[#D10002] bg-[#fff0f0]"
                      : "border-[#CFC9C9] bg-white"
                  }`}
                >
                  <img src={paypalImg} alt="paypal" className="h-8 mb-1" />
                  <span className="text-xs text-[#1A3353]">PayPal</span>
                </div>
                <div
                  onClick={() => setPaymentMethod("apple")}
                  className={`p-4 px-8  items-center flex flex-col justify-center rounded-xl border transition-all duration-200 shadow-sm ${
                    paymentMethod === "apple"
                      ? "border-[#D10002] bg-[#fff0f0]"
                      : "border-[#CFC9C9] bg-white"
                  }`}
                >
                  <img src={applePayImg} alt="apple pay" className="h-8 mb-1" />
                  <span className="text-xs text-[#1A3353]">Apple Pay</span>
                </div>
                <div
                  onClick={() => setPaymentMethod("google")}
                  className={`p-4 px-8  items-center flex flex-col justify-center rounded-xl border transition-all duration-200 shadow-sm ${
                    paymentMethod === "google"
                      ? "border-[#D10002] bg-[#fff0f0]"
                      : "border-[#CFC9C9] bg-white"
                  }`}
                >
                  <img src={gpayImg} alt="google pay" className="h-8 mb-1" />
                  <span className="text-xs text-[#1A3353]">Google Pay</span>
                </div>
              </div>
            </div>

            {/* Card Payment Form (Stripe) */}
            {paymentMethod === "visa" && (
              <div className="ml-8 mt-8 bg-white p-6 rounded-xl shadow border border-[#E6E8EC] max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Card details</h2>
                <Elements stripe={stripePromise}>
                  <CheckoutForm item={order} />
                </Elements>
                <PaymentSuccessFullModel
                  open={paymentDialogOpen}
                  handleClose={handleCloseDialog}
                  amount={totalAmount.toFixed(2)}
                />
              </div>
            )}
            {/* Coming soon messages for other methods */}
            {paymentMethod === "paypal" && (
              <div className="text-center p-6 mt-8 bg-white rounded-xl border border-[#E6E8EC] shadow">
                <p className="text-gray-600">PayPal integration coming soon</p>
              </div>
            )}
            {paymentMethod === "apple" && (
              <div className="text-center p-6 mt-8 bg-white rounded-xl border border-[#E6E8EC] shadow">
                <p className="text-gray-600">Apple Pay integration coming soon</p>
              </div>
            )}
            {paymentMethod === "google" && (
              <div className="text-center p-6 mt-8 bg-white rounded-xl border border-[#E6E8EC] shadow">
                <p className="text-gray-600">Google Pay integration coming soon</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="mt-5 w-2/5">
            <Card className="rounded-xl shadow-lg w-full mx-auto border border-[#B3BBC68A] bg-white">
              <CardContent>
                <h1 className="bg-[#EEEFF2] w-full py-4 font-medium text-black text-center mb-5 rounded-lg">
                  Payment summary
                </h1>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CardMedia
                    component="img"
                    image={order?.product?.images?.[0]}
                    alt={order?.product?.product_name}
                    className="rounded-lg mb-4"
                    style={{ width: 100 }}
                  />
                  <div className="flex flex-col justify-center orders-start mb-4">
                    <Typography sx={{ fontSize: 16 }} variant="h6" className="font-bold">
                      {order?.product?.product_name}
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: 12 }} className="text-[#7A7597] font-bold">
                      ${rentFee}
                      <span className="text-gray-500 text-xs font-medium"> /Per month</span>
                    </Typography>
                    <h1 className="text-[#938C8C] mr-5 text-xs">
                      <span style={{ color: "gold", fontSize: "14px" }}>★</span> {order?.product?.avgRating || "No ratings"}
                    </h1>
                  </div>
                </Box>
                <Table sx={{ "& td": { border: 0, padding: "8px 0" } }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography color="#938C8C">Pick-up Date & Time</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{formatDate(order.pick_date)} {formatTime(order.pick_time)}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="#938C8C">Return Date & Time</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{formatDate(order.end_date)}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="#938C8C">Delivery Type</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{order.delivery_type}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table sx={{ "& td": { border: 0, padding: "8px 0" }, mt: 3 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography color="#938C8C">{order.extend_amount?"Extension fee":"Rent fee"}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>${rentFee.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="#938C8C">Delivery fees</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>${deliveryFees.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-10 font-bold text-lg">
                  <Typography color="#938C8C" sx={{ fontSize: 18, fontWeight: 500 }}>Total</Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 500 }}>${totalAmount.toFixed(2)}</Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
