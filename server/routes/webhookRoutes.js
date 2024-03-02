/* eslint-disable no-undef */
import { Webhook } from "svix";
import User from "../mongodb/models/user.model.js";

// Function to update user metadata


export const webhookRoute = async (req, res) => {
  // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("You need a WEBHOOK_SECRET in your .env");
  }

  // Grab the headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get the Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are missing Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Initiate Svix
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    // Console log and return error
    console.log("Webhook failed to verify. Error:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Grab the ID and TYPE of the Webhook
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username || "",
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    const newUser = await User.create(user);

    res.json({ message: "OK", user: newUser });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id: clerkId, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username || "",
      photo: image_url,
    };

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User update failed" });
    }

    return res.json({ message: "OK", user: updatedUser });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id: clerkId } = evt.data;
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User delete failed" });
    }

    return res.json({ message: "OK", user: deletedUser });
  }
};
