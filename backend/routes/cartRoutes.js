const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Function to get the cart for a user ID or guest ID

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add product to the cart for a guest or logged in user
// @access  Private
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine if the user is logged in or a guest
    let cart = await getCart(userId, guestId);

    // If the cart exists, update it; otherwise, create a new cart
    if (cart) {
      const productInex = cart.products.findIndex((p) => {
        return (
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        );
      });

      if (productInex > -1) {
        // If the product already exists in the cart, update the quantity
        cart.products[productInex].quantity += Number(quantity);
      } else {
        // If the product does not exist, add it to the cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images?.[0]?.url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart for guest or logged in user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images?.[0]?.url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      console.log("Product retrieved:", product);
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  @route   PUT /api/cart
//  @desc    Update product quantity in the cart for a guest or logged in user
//  @access Public

router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex((p) => {
      return (
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
      );
    });

    if (productIndex > -1) {
      //  update the quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        // If quantity is 0, remove the product from the cart
        cart.products.splice(productIndex, 1); // Remove the product from the cart
      }

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/cart
// @desc    Remove product from the cart
// @access  Public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex((p) => {
      return (
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
      );
    });

    if (productIndex > -1) {
      // Remove the product from the cart
      cart.products.splice(productIndex, 1);

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  @route   GET /api/cart
//  @desc    Get cart for a guest or logged in user
// //  @access  Public

router.get("/", async (req, res) => {
  const { guestId, userId } = req.query;

  try {
    // Get the cart for the user or guest
    const cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/cart/merge
// @desc    Merge guest cart with user cart
// @access  Private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Find the guest cart and the user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart is empty" });
      }

      if (userCart) {
        // If user cart exists, merge the products
        guestCart.products.forEach((product) => {
          const productIndex = userCart.products.findIndex((p) => {
            return (
              p.productId.toString() === product.productId.toString() &&
              p.size === product.size &&
              p.color === product.color
            );
          });

          if (productIndex > -1) {
            // If the product already exists in the user cart, update the quantity
            userCart.products[productIndex].quantity += product.quantity;
          } else {
            // If the product does not exist, add it to the user cart
            userCart.products.push(product);
          }
        });

        // Recalculate the total price for the user cart
        userCart.totalPrice = userCart.products.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);

        await userCart.save();

        // Delete the guest cart
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }
        res.status(200).json(userCart);
      } else {
        // if the user  has no existing cart, assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined; // Remove guestId as it's no longer needed
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        // Guest cart has already been merged, return the user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
