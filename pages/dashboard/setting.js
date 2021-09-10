import React, { useState } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { signIn, useSession } from "next-auth/client"
import LoginForm from '../../components/loginform';
import SettingForm from '../../components/settingform'

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

const Setting = () => {
  
  const [session, loading] = useSession()
  const stripePromise = getStripe();

  return (
    <>
    {!session && (
      <div className="Container">
        <LoginForm />
      </div>
    )}
    { session && (
      <div className="ContentWrapper">
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
          <SettingForm />
        </Elements>
      </div>
    )}
    </>
  );
};

export default Setting;