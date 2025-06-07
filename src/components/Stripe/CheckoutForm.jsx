import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import useAxiosAuth from "../../lib/auth";
import { RiseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

const CheckoutForm = ({ item }) => {
  const navigate = useNavigate();
  console.log("order item", item);
  const stripe = useStripe(); // ✅ Must be inside a function component
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const axiosAuth = useAxiosAuth();
  console.log("Payment item", item);
  console.log("payment item", item);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setMessage("Stripe not loaded.");
      setLoading(false);
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log("Stripe payment method", paymentMethod);
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosAuth.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders/order${item?.extend_amount ? "_extend" : ""}_payment`,
        {
          orderId: item?.id,
          paymentMethodId: paymentMethod.id,
        }
      );
      console.log("payment method", response.data);
      setMessage(`✅ Payment ${response.data.paymentIntent.status} !`);
      toast.success("Payment successful");
      navigate("/myorder");
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || "Payment failed"}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        className="w-full bg-[#D10002] text-white font-semibold py-3 mt-8 rounded-lg shadow hover:bg-[#b30002] transition-colors"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? <RiseLoader color="#000" size={10} /> : "Pay"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

CheckoutForm.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    extend_amount: PropTypes.number,
    product: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      price: PropTypes.number
    })
  }).isRequired
};

export default CheckoutForm;
