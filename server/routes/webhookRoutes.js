/* eslint-disable no-undef */
import { Webhook } from "svix";
import axios from "axios";

// Function to update user metadata
async function updateUserMetadata(userId, metadata) {
  const apiKey = process.env.CLERK_API_KEY;
  const apiUrl = `https://api.clerk.io/v1/users/${userId}/metadata`;

  try {
    const response = await axios.put(apiUrl, metadata, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user metadata:", error.response.data);
    throw error;
  }
}

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
    evt = wh.verify(payload, {
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
  const { id } = evt.data;
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

    const { data: newUser } = await axios.post(
      `${process.env.URL}/createUser`,
      user
    );

    if (newUser) {
      const metadata = {
        publicMetadata: {
          userId: newUser._id,
        },
      };

      updateUserMetadata(id, metadata)
        .then((updatedMetadata) => {
          console.log("User metadata updated successfully:", updatedMetadata);
        })
        .catch((error) => {
          console.error("Failed to update user metadata:", error);
        });
    }

    res.json({ message: "OK", user: newUser });
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username || "",
      photo: image_url,
    };

    const { data: updatedUser } = axios.put(
      `${process.env.URL}/updateUser?clerkId=${id}`,
      user
    );

    return res.json({ message: "OK", user: updatedUser });
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const { data: deletedUser } = await axios.delete(
      `${process.env.URL}/deleteUser/:clerkId?clerkId=${id}`
    );

    return res.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", req.body);

  return res.status(200).send("");
};
