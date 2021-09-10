import NextAuth from "next-auth"
import Providers from "next-auth/providers"

const apiUrl = "http://localhost:3000"

export default NextAuth({

  session: {    
    jwt: true,
    maxAge: 24 * 60 * 60 // a day
  },

  jwt: {
    secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnX', //use a random secret token here
    encryption: true
  },

  database: process.env.MONGODB_URI,

  providers: [
    // Providers.Credentials({
    //   name: 'Credentials',
    //   async authorize(credentials, req) {
    //     const res = await fetch(apiUrl + "/api/stripe/login", {
    //       method: 'POST',
    //       body: JSON.stringify(credentials),
    //       headers: { "Content-Type": "application/json" }
    //     })

    //     const user = await res.json()

    //     // If no error and we have user data, return it
    //     if (res.ok && user && !user.error) {
    //       return user
    //     }

    //     // Return null if user data could not be retrieved
    //     return null
    //   }
    // })
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  pages: {
    // signIn: '/login',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/verify', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  callbacks: {
    async signIn(user, account, profile) { 
      return true 
    },

  //   // async redirect(url, baseUrl) { return baseUrl },
  //   async session(session, token) { 
  //     session.accessToken = token.accessToken;
  //     session.user = token.credentials;
  //     return session 
  //   },

  //   async jwt(token, user) { 
  //     if (user) {
  //       token.accessToken = user.token;
  //       token.credentials = user.data;
  //     }

  //     return token 
  //   }
  },

  debug: true,
})