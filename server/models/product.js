const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    manufacturingDate: {
      type: String,
      required: true,
    },
    ownerships: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        received: {
          type: Date,
        },
        sent: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
