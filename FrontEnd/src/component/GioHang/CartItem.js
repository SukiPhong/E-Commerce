import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { getOneProduct } from "../../service/api";

const CartItem = ({
  cart,
  onDeleteProduct,
  onQuantityChange,
  updateCartQuantityOnServer,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(cart.count);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getOneProduct(cart.product);
        const foundProduct = response.find(
          (product) => product._id === cart.product
        );

        if (foundProduct) {
          setSelectedProduct(
            foundProduct.quantity.find((item) => item.size === cart.size)
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [cart.product, cart.size]);

  const remainingQuantity = selectedProduct
    ? selectedProduct.numberOfSize - editedQuantity
    : 0;
  const handleSave = () => {
    updateCartQuantityOnServer(cart.product, cart.size, editedQuantity);
    setIsEditing(false);
    setIsChecked(false);
    localStorage.removeItem("cartList");
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
    let cartList = JSON.parse(localStorage.getItem("cartList")) || [];
    const index = cartList.findIndex(
      (item) => item.product === cart.product && item.size === cart.size
    );

    if (isChecked) {
      if (index === -1) {
        cartList.push({
          product: cart.product,
          size: cart.size,
          name: cart.name,
          img: cart.img,
          price: cart.price,
          count: editedQuantity,
        });
      } else {
        cartList[index].count = editedQuantity;
      }
    } else {
      if (index !== -1) {
        cartList.splice(index, 1);
      }
    }

    if (cartList.length === 0) {
      localStorage.removeItem("cartList");
    } else {
      localStorage.setItem("cartList", JSON.stringify(cartList));
    }
  };

  return (
    <div className="cartItem">
      <div className="cart1Left">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />{" "}
        <Link to={`/chitietsanpham/${cart.product}`}>
          <img src={cart.img} alt="" />
        </Link>
        <div className="infoNameSize">
          <p style={{ fontWeight: "bold", fontSize: "1.8rem" }}>{cart.name}</p>
          <p style={{ fontSize: "1.6rem" }}>Size: {cart.size}</p>
        </div>
      </div>
      <div className="cart1Right">
        <div className="cartMain">
          <div className="inputQuantity">
            <input
              className="inputNumberField"
              type="number"
              value={isEditing ? editedQuantity : cart.count}
              onChange={(e) => {
                onQuantityChange(e);
                setEditedQuantity(Number(e.target.value));
              }}
            />
            {isEditing ? (
              <button className="addQuantityBTN" onClick={handleSave}>
                Lưu
              </button>
            ) : (
              <button
                className="addQuantityBTN"
                onClick={() => setIsEditing(true)}
              >
                Sửa
              </button>
            )}
          </div>
        </div>

        <p>{(cart.price * cart.count).toLocaleString()} VNĐ</p>
        <DeleteIcon
          style={{ fontSize: "3rem", cursor: "pointer", flex: "1" }}
          onClick={onDeleteProduct}
          className="deleteProduct"
        />
      </div>
    </div>
  );
};

export default CartItem;
