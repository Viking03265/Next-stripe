import CancelButton from './components/cancelbutton'
import SubmitButton from './components/submitbutton'
import Field from './components/field';
import WhiteLabel from './components/whitelabel';
import CardField from './components/cardfield';
import ErrorMessage from './components/errormessage'
// import ResetButton from './components/resetbutton';

import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { paymentIntent, paymentCancel, refund } from './api/stripe_api'
import { signIn, useSession } from "next-auth/client"

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
      email: "",
      phone: "",
      name: "",
      price: 1
    });
    const [fullName, setFullName] = useState({
      firstName: "",
      lastName: ""
    })

    const confirm = async () => {

      if (!stripe || !elements) { return; }
      
      const card = elements.getElement(CardElement);

      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      })
      const result = await stripe.createToken(card);

      const intent = await paymentIntent({
        name: billingDetails.name,
        email: billingDetails.email,
        amount: billingDetails.price * 100, 
        method: paymentMethod,
        currency: 'usd', 
        description: `be paid ${billingDetails.price}$ by ${billingDetails.name}`, 
        token: result.token
      });  
      
      if (intent.data) {
        const email = billingDetails.email
        signIn ('email',
          {
            email,
            callbackUrl: `${window.location.origin}/dashboard` 
          }
        )        
      }

      if (intent.error) {
        setError(intent.error);
      }      
    }
  
    const handleSubmit = async (event) => {

      event.preventDefault();
  
      if (!stripe || !elements) { return; }

      confirm();      
    };
  
    const reset = () => {
      setError(null);
      setProcessing(false);
      setBillingDetails({
        email: "",
        phone: "",
        name: "",
        price: 1
      });
    };
  
    return (
      <form className="Form" onSubmit={handleSubmit}>
        <h1>Start Your Plan</h1>
        <WhiteLabel label="Afert your 7-day trial, you will be changed $49 monthly until canceled."/>
        <fieldset className="FormGroup">
          <Field
            label="First Name"
            id="firstName"
            type="text"
            placeholder="First Name"
            required
            autoComplete="name"
            value={fullName.firstName}
            onChange={(e) => {
              setFullName({ ...fullName, firstName: e.target.value });
              setBillingDetails({ ...billingDetails, name: e.target.value + ' ' + fullName.lastName });
            }}
          />
          <Field
            label="Last Name"
            id="lastName"
            type="text"
            placeholder="Last Name"
            required
            autoComplete="name"
            value={fullName.lastName}
            onChange={(e) => {
              setFullName({ ...fullName, lastName: e.target.value });
              setBillingDetails({ ...billingDetails, name: fullName.firstName + ' ' + e.target.value });
            }}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            autoComplete="email"
            value={billingDetails.email}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, email: e.target.value });
            }}
          />
          {/* <Field
            label="Phone"
            id="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            autoComplete="tel"
            value={billingDetails.phone}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, phone: e.target.value });
            }}
          /> */}
        </fieldset>
        <fieldset className="FormGroup">
          <WhiteLabel label="Pay securely using your credit or debit card."/>
          <CardField
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </fieldset>
        <SubmitButton processing={processing} error={error} disabled={!stripe}>
          Pay ${billingDetails.price} For 7 Days
        </SubmitButton>
        <CancelButton name="Cancel" link="/"/>
        {error && <ErrorMessage error={error}/>}
      </form>
    );
  };

  export default CheckoutForm;