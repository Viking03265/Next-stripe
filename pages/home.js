/* eslint-disable @next/next/link-passhref */
import Link from "next/link"
import { useRouter } from "next/router"

const Home = () => {    
    const router =  useRouter()
    
    const onSignup = e => {    
        e.preventDefault()    
        router.push("/checkout")
    }

    const onLogin = e => {    
        e.preventDefault()    
        router.push("/login")
    }

    return (
        <div>
            <div className="Navbar">
                <button 
                    className="LoginButton" 
                    onClick={ onSignup }>
                        Sign Up
                </button>
                <button 
                    className="LoginButton" 
                    onClick={ onLogin }>
                        Sign In
                </button>
            </div>
            <main className={"Main"}>        
                <h1 className={"Title"}>
                    Next Stripe
                </h1>

                <div className={"Grid"}>
                    {/* <Link href="/checkout"> */}
                        <div className={"Card"}>
                            <h2>$49 / month</h2>
                            <p>Initially $1 for 7 days. After that, we charge $49 per month for this plan.</p>
                        </div>            
                    {/* </Link> */}
                </div>

                {/* <p className={"Description"}>          
                    If you have your account already, {' '}
                    <button 
                    className="LoginButton" 
                    onClick={ onLogin }>
                        Log in!
                    </button>
                </p>             */}
            </main>

            <footer className={"Footer"}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '} &copy; transforminggardens.com.au, 2021
                </a>
            </footer>    
        </div>
    )
}

export default Home;