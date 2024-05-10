import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../service/userSlice";
import { useNavigate } from "react-router";

const style = { layout: "horizontal" };

const ButtonWrapper = ({ showSpinner, currency, amount, payload }) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
  const accessToken = useSelector(selectAccessToken);
  const Swal = require("sweetalert2");

  const getCartData = () => {
    const cartData = localStorage.getItem("cartList");
    return cartData ? JSON.parse(cartData) : [];
  };
  const cartData = getCartData();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  const handleSaveOrder = async (payload) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/order/copy",
        {
          ...payload,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );

      const oid = res.data.response._id;

      await axios.put(
        `http://localhost:8000/order/status/${oid}`,
        {
          status: "Processing",
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );

      for (const product of cartData) {
        await axios.delete(
          `http://localhost:8000/user/Cart/${product.product}/${product.size}`,
          {
            headers: {
              token: `Bearer ${accessToken}`,
            },
          }
        );
      }
      Swal.fire({
        title: "BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG",
        icon: "success",
      });
      localStorage.removeItem("cart");
      localStorage.removeItem("cartList");
      navigate("/thongtin/lichsumuahang");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderId) => orderId)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            if (response.status === "COMPLETED") {
              console.log(response);
              console.log(payload);
              handleSaveOrder(payload);
            }
          })
        }
      />
    </>
  );
};

export default function Pay({ amount, payload }) {
  return (
    <div>
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          payload={payload}
          currency={"USD"}
          amount={amount}
          showSpinner={false}
        />
      </PayPalScriptProvider>
    </div>
  );
}
