/* eslint-disable no-undef */
import Stripe from "stripe";

import Transaction from "../mongodb/models/transaction.model.js";
import User from "../mongodb/models/user.model.js";

export const checkoutCredits = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { transaction } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const amount = Number(transaction.amount) * 100;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: { name: transaction.plan },
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: transaction.plan,
        credits: transaction.credits,
        buyerId: transaction.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/profile?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/?canceled=true`,
    });

    res.status(201).json({ url: session.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Failed to process checkout" });
  }
};

export const stripePOST = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const payload = req.body;

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const { id, amount_total, metadata } = event.data.object;

      const transaction = {
        stripeId: id,
        amount: amount_total ? amount_total / 100 : 0,
        plan: metadata?.plan || "",
        credits: Number(metadata?.credits) || 0,
        buyerId: metadata?.buyerId || "",
        createdAt: new Date(),
      };

      const newTransaction = await createTransaction(transaction);

      return res.json({ message: "OK", transaction: newTransaction });
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Stripe POST Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to process Stripe webhook" });
  }
};

// Function to create a transaction
export const createTransaction = async (transaction) => {
  try {
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    const updateUserCredits = await User.findOneAndUpdate(
      { _id: transaction.buyerId },
      { $inc: { creditBalance: transaction.credits } },
      { new: true }
    );

    if (!updateUserCredits) {
      throw new Error("User credits update failed");
    }

    return newTransaction;
  } catch (error) {
    console.error("Transaction Creation Error:", error);
    throw new Error("Failed to create transaction");
  }
};
