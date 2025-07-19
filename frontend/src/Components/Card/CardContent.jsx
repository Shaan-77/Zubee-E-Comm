import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CardContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  //  handle adding or subtracting to cart
  const handleAddToCard = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    // console.log(productId);

    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((product, index) => {
        // console.log("Product in cart:", product);

        return (
          // <div key={product.productId} className="flex items-center justify-between border-b py-4">
          //     <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
          //     <div className="flex flex-col ml-4">
          //         <h3 className="text-lg font-semibold">{product.name}</h3>
          //         <p className="text-sm text-gray-500">Size: {product.size}</p>
          //         <p className="text-sm text-gray-500">Color: {product.color}</p>
          //     </div>
          //     <div className="flex flex-col items-end">
          //         <p className="text-lg font-semibold">${product.price}</p>
          //         <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
          //     </div>
          // </div>
          <div key={index} className="flex items-start   py-4 border-b">
            <div className="flex items-start ">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-20 object-cover mr-4 rounded"
              />
            </div>
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500 ">
                {" "}
                Size: {product.size} | color: {product.color}
              </p>
              <div className="flex  items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCard(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCard(
                      product.productId,
                      1,
                      product.quantity,
                      product.image,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto">
              ${product.price.toLocaleString()}
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color
                  )
                }
              >
                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-gray-500 hover:text-red-500 ml-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardContent;
