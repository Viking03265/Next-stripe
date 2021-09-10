import { google } from 'googleapis';

export default async function handler(req, res) {
    
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

//   console.log (keywords)
  res.json(keywords)
}