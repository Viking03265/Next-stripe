import CancelButton from './components/cancelbutton'
import SubmitButton from './components/submitbutton'
import Field from './components/field';
import ErrorMessage from './components/errormessage'

import { signIn, useSession } from "next-auth/client"
import { useState } from "react";
import { useRouter } from "next/router"

const apiUrl = "http://localhost:3000"

const LoginForm = ({csrfToken}) => {

    const [session, loading] = useSession()
    const router = useRouter()

    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");

    const handleSubmit = async (event) => {      
      event.preventDefault();    
      await signIn ('email',
        {
          email,
          callbackUrl: `${window.location.origin}/dashboard` 
        }
      )
    };
  
    return (
      <form className="Form" onSubmit={handleSubmit}>
      {/* <form className="Form" action="/api/auth/signin/email"> */}
        <h1>Log in</h1>
        <input name='csrfToken' type="hidden" defaultValue={csrfToken}></input>
        <fieldset className="FormGroup">                  
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </fieldset>
        <SubmitButton>
          Log in
        </SubmitButton>
        <CancelButton name="Cancel" link="/"/>
        {error && <ErrorMessage error={error}/>}
      </form>
    );
  };

  export default LoginForm;

  