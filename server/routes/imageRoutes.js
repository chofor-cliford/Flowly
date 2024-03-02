/* eslint-disable no-undef */
import User from "../mongodb/models/user.model.js";
import Image from "../mongodb/models/image.model.js";
import { v2 as cloudinary } from "cloudinary";

const populateUser = (query) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName, lastName, clerkId",
  });

// ADD IMAGE
export const addImage = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { userId } = req.query;
    const { image } = req.body;

    const author = await User.findById(userId);

    if (!author) {
      return res.status(404).json({ message: "User not found" });
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    res.status(200).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE IMAGE
export const updateImage = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    const { userId } = req.query;

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      return res
        .status(404)
        .json({ message: "Unauthorized or image not found" });
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );

    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE IMAGE
export const deleteImage = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { imageId } = req.query;

    await Image.findByIdAndDelete(imageId);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  // implement finally after making the api call in the client, okay!
};

// GET IMAGE BY ID
export const getImageById = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { imageId } = req.query;

    const image = await populateUser(Image.findById(imageId));

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL IMAGES
export const getAllImages = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { searchQuery, page, limit } = req.query;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=flowly";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource) => resource.public_id);

    let query = {};

    if (searchQuery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    res.status(200).json({
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
