"use server";

import Stripe from "stripe";

import { serverEnv } from "@/env/server.mjs";

const stripe = new Stripe(serverEnv.STRIPE_TESTMODE_SECRET_KEY);

export const stripePaymentIntentAction = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "eur",
    payment_method_types: ["card"],
    statement_descriptor_suffix: "NAMU",
  });
  return paymentIntent.client_secret as string;
};
