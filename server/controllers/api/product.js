const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Product = require("./../../models/product");
const Message = require("./../../models/message");

get = async (req, res, next) => {
  try {
    const products = await Product.find({
      ownerships: { $elemMatch: { owner: req.user.id } },
    }).populate("ownerships.owner");

    return res
      .status(200)
      .json({ success: true, message: "Product get successful", products });
  } catch (err) {
    next(err);
  }
};

getFakeProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const fakeProducts = await Message.find({}).populate("lastScannedBy");

    const fakeProductIds = fakeProducts.map((product) => product.productId);

    let products = await Product.find({
      productId: { $in: fakeProductIds },
      ownerships: { $elemMatch: { owner: req.user.id } },
    })
      .populate("ownerships.owner")
      .lean();

    products.forEach((product) => {
      const lastScannedBy = fakeProducts.filter(
        (p) => p.productId === product.productId
      );

      product.lastScannedBy = lastScannedBy[0].lastScannedBy;
    });

    return res.status(200).json({
      success: true,
      message: "Fake product get successful",
      products,
    });
  } catch (err) {
    next(err);
  }
};

getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      productId,
    }).populate("ownerships.owner");

    const message = await Message.findOne({ productId });

    let genuine = true;

    if (message) {
      genuine = false;
    }

    return res.status(200).json({
      success: true,
      message: "Product get successful",
      product,
      genuine,
    });
  } catch (err) {
    next(err);
  }
};

add = async (req, res, next) => {
  try {
    const { productId, name, serialNumber, manufacturingDate } = req.body;

    let product = await Product.create({
      productId,
      name,
      serialNumber,
      manufacturingDate,
      ownerships: [
        {
          owner: req.user.id,
          received: new Date(),
          sent: "",
        },
      ],
    });

    const owner = await User.findOne({ _id: req.user.id });

    product.ownerships[0].owner = owner;

    return res
      .status(200)
      .json({ success: true, message: "Product add successful", product });
  } catch (err) {
    next(err);
  }
};

edit = async (req, res, next) => {
  try {
    const { name, serialNumber, manufacturingDate, productId } = req.body;

    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $set: {
          name,
          serialNumber,
          manufacturingDate,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Product update successful", product });
  } catch (err) {
    next(err);
  }
};

send = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findOne({ productId }).populate(
      "ownerships.owner"
    );

    for (let owner of product.ownerships) {
      if (owner.owner.role === req.user.role && owner.sent !== null) {
        await Message.create({
          productId,
          lastScannedBy: req.user.id,
        });

        throw createError.Conflict(
          `Already scanned and shipped by a ${req.user.role}`
        );
      }
    }

    let ownerships = product.ownerships;

    let existingOwner = false;

    ownerships.forEach((owner) => {
      if (owner.owner._id == req.user.id) {
        existingOwner = true;
        owner.sent = new Date();
      }
    });

    let sentByLastOwner = false;
    if (ownerships[ownerships.length - 1].sent) {
      sentByLastOwner = true;
    }

    if (!existingOwner && !sentByLastOwner) {
      throw createError.Conflict(
        `The product has not been sent by the ${
          ownerships[ownerships.length - 1].owner.role
        }`
      );
    }

    if (!existingOwner) {
      ownerships.push({
        owner: req.user.id,
        sent: new Date(),
        received: new Date(),
      });
    }

    await Product.findOneAndUpdate(
      { productId },
      { $set: { ownerships } },
      { new: true }
    );

    const productUpdated = await Product.findOne({ productId }).populate(
      "ownerships.owner"
    );

    return res.status(200).json({
      success: true,
      message: "Product status update successful",
      product: productUpdated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { get, getFakeProducts, add, edit, send, getProduct };
