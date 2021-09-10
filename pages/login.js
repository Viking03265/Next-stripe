import { getCsrfToken } from 'next-auth/client'
import LoginForm from '../components/loginform'

export default function SignIn({ csrfToken }) {
  return (
    <div className="Container">
      <LoginForm csrfToken={ csrfToken }/>
    </div>    
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}