"use client";

import { cva } from "class-variance-authority";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import getStripe from "@/common/get-stripejs";
import { stripePaymentIntentAction } from "@/server/actions/transaction/stripePaymentIntent";
import {
  Elements,
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";

interface Props {
  amountInCents: number;
  callback?: () => void;
}

// amount = "A positive integer representing how much to charge
// in the smallest currency unit (e.g., 100 cents to charge $1.00)"

export const StripeExpressPayment = ({ amountInCents, callback }: Props) => {
  const stripeOptions = {
    mode: "payment",
    amount: amountInCents,
    currency: "eur",
    paymentMethodTypes: ["card"],
  } as StripeElementsOptions;

  return (
    <Elements stripe={getStripe()} options={stripeOptions}>
      <PaymentElement amountInCents={amountInCents} callback={callback} />
    </Elements>
  );
};

const PaymentElement = ({ amountInCents, callback }: Props) => {
  const [elementReady, setElementReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const elementStyles = cva(" ", {
    variants: {
      visible: {
        true: "hidden",
        false: "",
      },
    },
  });

  const onReady = ({ availablePaymentMethods }) => {
    if (!availablePaymentMethods) {
      // No buttons will show
      console.log("error: no payment methods available");
    } else {
      setElementReady(true);
    }
  };

  const onConfirm = async (event) => {
    console.log("Pament accepted by user, creating int");
    if (!stripe || !elements) return;
    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.log("submitError", submitError);
      return;
    }

    const clientSecret = await stripePaymentIntentAction(amountInCents);
    console.log("got client_secret", clientSecret);

    const { error } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        return_url: "https://localhost:3000/shop",
      },
      redirect: "if_required",
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      console.log("error with payment", error);
    } else {
      console.log("payment success!");
      callback?.();
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }
  };

  return (
    <>
      <div className={elementStyles({ visible: !elementReady })}>
        <ExpressCheckoutElement onConfirm={onConfirm} onReady={onReady} />
      </div>

      {!elementReady && (
        <span className="animate-spin">
          {<AiOutlineLoading3Quarters size={25} />}
        </span>
      )}
    </>
  );
};
