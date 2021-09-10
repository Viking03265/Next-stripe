import { google } from 'googleapis';
import {Line} from 'react-chartjs-2';
import { Card, Button } from "react-bootstrap";
import ReactPaginate from 'react-paginate';

import styles from '/styles/Home.module.css'
import { signIn, signOut, useSession } from "next-auth/client"

import { useRouter } from 'next/router';

export async function getServerSideProps({ query }) {
  
  // const key = require("../secrets.json");
  // const client = new google.auth.JWT(
  //   key.client_email,
  //   null,
  //   key.private_key,
  //   ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  //   null
  // );

  const auth = await google.auth.fromAPIKey('AIzaSyBXevCyhsEuMmQlx1MEgv-WlZ-V3vEsWs8');

  const sheets = google.sheets({ version: 'v4', auth: auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '11gf8m4sbdmh5IHtH85Km2ximiuVwzNjJ1ALulsxUWzY',
    range: 'Sheet1!A1:P27',
    majorDimension: 'ROWS'
  });

  const data =  response.data.values;
  const keys = data.shift();
  const keywords = data.reduce((agg, arr) => {
    agg.push(arr.reduce((obj, item, index) => {
      obj[keys[index]] = item;
      return obj;
    }, {}));
    return agg;
  }, [])

  // console.log(keywords.keys[1])

  // .map(function(value,index) { return value[1]; })


  return {
    props: {
      // volume,
      keywords      
    },
  };
}


const renderCard = (card, index, keywords) => {

  const state = {
    labels: ['March', 'April', 'May',
             'June', 'July'],
    datasets: [
      {
        label: '',
        lineTension: 0.5,
        backgroundColor:  'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [1, 80, 81, 56],
        fill: 'rgba(75,192,192,1)',
      }
    ],
  
    options: {
      scales: {
          yAxes: [{
              ticks: {
                  display: false
              }
          }]
      }}
  }
  
  return (    
    <Card key={index} className={styles.card} style={{display:"inline-flex"}}>
      <Card.Body>
      <Card.Title>{keywords.title}</Card.Title>
        
        <Line
      data={state}
      options={{

          scales: {
              yAxes: [{
                  ticks: {
                      display: false
                  }
              }]
          }
      }}
    />
      </Card.Body>
    </Card>
  );
};


export default function Post({ keywords }) {

  const [session, loading] = useSession()
  const router = useRouter()

  const apiUrl = "http://localhost:3000"  

  const handleManageAccount = async () => {
    // console.log (session.user);
    const res = await fetch(apiUrl + "/api/stripe/portal", {
      method: 'POST',
      body: JSON.stringify(session.user),
      headers: { "Content-Type": "application/json" }
    })

    const ret = await res.json()
    // console.log(ret)
    if (ret.url) { router.push(ret.url); }
    if (ret.error) { console.log(ret); router.push('/checkout') }
  }

  const handleSignOut = async e => {
    signOut({
      callbackUrl: `${window.location.origin}`
    });
  }

  const handleSignUp = async e => {
    router.push('/checkout')
  }

  const handleSignIn = async e => {
    router.push('/login')
  }

  return (
    <div className ={styles.body}>
    {!session && (
        <div className="Navbar BGWhite">
          <Button className={styles.button} onClick={handleSignUp}>Sign Up</Button>
          <Button className={styles.button} onClick={handleSignIn}>Sign In</Button>
        </div>
    )}
    {session && (
        <div className="Navbar BGWhite">
          <Button className={styles.button} onClick={handleManageAccount}>Manage Account</Button>
          <Button className={styles.button} onClick={handleSignOut}>Log Out</Button>
        </div>
    )}
    <div className={styles.wrapper}>
      { keywords.map(renderCard) }
    </div>
    <ReactPaginate previousLabel={'Previous'} onPageChange={console.log()} containerClassName={styles.paginate}/>
  </div>
  );
}
