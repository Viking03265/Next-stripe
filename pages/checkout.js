import React, { useState } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useRouter } from "next/router";

import CheckoutForm from '../components/checkoutform'

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto"
    }
  ]
};

const getStripe = async () => {
  return await loadStripe("pk_test_DFOpLrOSQju9nv39orLhOnW800zbHSvTLz");
}


const CheckOut = () => {
  const stripePromise = getStripe();

  const router = useRouter();

  const onSignin = async () => {
    router.push("/login")
  }
  
  return (
    <div>
      <div className="Navbar">
        <p className={"Description"}>          
          Already a user, {' '}<button className="LoginButton" onClick={onSignin}>Sign In</button>
        </p>
      </div>
      <div className="Container">
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckOut;
