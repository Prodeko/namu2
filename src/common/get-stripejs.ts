import { clientEnv } from "@/env/client.mjs";
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      clientEnv.NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY,
    );
  }
  return stripePromise;
};

export default getStripe;
