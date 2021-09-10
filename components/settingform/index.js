import DefaultButton from './components/defaultbutton'
import SubmitButton from './components/submitbutton'
import ErrorMessage from './components/errormessage'

import { useSession, signOut } from "next-auth/client"
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";

const SettingForm = () => {
  
  const apiUrl = "http://localhost:3000"  
  const [session, loading] = useSession()

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [renewDate, setRenewDate] = useState(null);

  const retrieve = async () => {
    const res = await fetch(apiUrl + "/api/stripe/retrieve", {
      method: 'POST',
      body: JSON.stringify(session.user),
      headers: { "Content-Type": "application/json" }
    })

    const ret = await res.json()
    setSubscription(ret.data.subscription)

    const ts = new Date(ret.data.subscription.current_period_end * 1000);
    
    setRenewDate(ts.toLocaleDateString());
  }

  useEffect(() => {
    retrieve();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();     
    const res = await fetch(apiUrl + "/api/stripe/update", {
      method: 'POST',
      body: JSON.stringify(session.user),
      headers: { "Content-Type": "application/json" }
    })

    const ret = await res.json()
    setSubscription(ret.data.subscription)

    const ts = new Date(ret.data.subscription.current_period_end * 1000);
    
    setRenewDate(ts.toLocaleDateString());
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    const res = await fetch(apiUrl + "/api/stripe/cancel", {
      method: 'POST',
      body: JSON.stringify(session.user),
      headers: { "Content-Type": "application/json" }
    })

    const ret = await res.json()
    if (ret.data) {
      signOut()
    }
  }

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <h1>Billings</h1>        
      <hr></hr>
      <h3>Current User</h3>
      <ul className="List">
        <li><b>Full Name: </b>{session.user.name} </li>
        <li><b>Email: </b>{session.user.email}</li>
      </ul>
      <hr></hr>
      <h3>Current Plan</h3>
      <ul className="List">
        <li><h4>Typographic growth</h4></li>
        <li><h4>$49 per month</h4></li>
        <li></li>
        <li><b>Status: </b> {subscription && subscription.status}</li>
        <li>Your plan renews on {renewDate && renewDate}</li>
      </ul>
      <hr></hr>
      {subscription && subscription.status === 'trialing' && (
        <SubmitButton processing={processing} error={error} disabled={!stripe}>
          Update plan
        </SubmitButton>
      )}      
      <DefaultButton name="Cancel plan" onClick={handleCancel}/>
      {error && <ErrorMessage error={error}/>}
      <hr></hr>
      <h3>Payment Methods</h3>
      <ul className="List">
        <li>Visa:  &nbsp;xxxx 4242</li>
      </ul>
      <hr></hr>
    </form>
  );
};

export default SettingForm;