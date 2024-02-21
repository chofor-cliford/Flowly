import User from "../mongodb/models/user.model.js";

// CREATE
export const createUser = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ
export const getUserById = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const userId = req.query.userId;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const clerkId = req.query.clerkId;
    const user = req.body;

    const foundUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!foundUser) {
      return res.status(404).json({ message: "User update failed" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const clerkId = req.query.clerkId;

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User delete failed" });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE
export const UpdateCredits = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userId = req.query.userId;
    const creditFee = req.body.creditFee;

    const updateUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updateUserCredits) {
      return res.status(404).json({ message: "User credits update failed" });
    }

    res.status(200).json(updateUserCredits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
