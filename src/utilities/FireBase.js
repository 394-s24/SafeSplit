// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/database";
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLD3Sqy-srVvLZ7JMAoHcfP_NGApU0aGc",
  authDomain: "safesplit-3eecb.firebaseapp.com",
  databaseURL: "https://safesplit-3eecb-default-rtdb.firebaseio.com",
  projectId: "safesplit-3eecb",
  storageBucket: "safesplit-3eecb.appspot.com",
  messagingSenderId: "238981325169",
  appId: "1:238981325169:web:8aff3b4f4ad825f54816d0",
  measurementId: "G-3BMNHFZ1ED",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

//fetch data from firebase and display it in console
let FetchData = async () => {

  const firebaseRef = await ref(db);

  let data = new Promise ((resolve) => {
    onValue(firebaseRef, (snapshot) => {
      resolve(snapshot.val());
    });
  })
  
  const firebaseData = await data;

  console.log("This should never be a promise", firebaseData)

  return firebaseData;
};

const formatData = (FirebaseData, user) => {
  let foundMaxMatchId = 0;
  let foundMaxRequestId = 0;
  var reqData = Array();
  // fixed for nonconsecutive indices
  for (const [key, value] of Object.entries(FirebaseData["requests"])) {
    foundMaxRequestId < parseInt(key)
      ? (foundMaxRequestId = parseInt(key))
      : null;

    const {
      email,
      locationFrom,
      locationTo,
      numRiders,
      requestTimeStart,
      requestTimeEnd,
      status,
      match_id,
    } = value;

    if (email == user) {
      var matchStart = new Date(requestTimeStart * 1000).toLocaleString();
      var matchEnd = new Date(requestTimeEnd * 1000).toLocaleString();
      reqData.push([
        matchStart,
        matchEnd,
        locationFrom,
        locationTo,
        user,
        numRiders,
        status,
        key,
        match_id,
      ]);
    }
    reqData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  var matchData = Array();
  // fixed for nonconsecutive indices
  for (const [key, value] of Object.entries(FirebaseData["matches"])) {
    foundMaxMatchId < parseInt(key) ? (foundMaxMatchId = parseInt(key)) : null;

    const {
      timeStart,
      timeEnd,
      locationFrom,
      locationTo,
      rider1,
      rider2,
      rider3,
    } = value;

    let riderArr = Array();

    rider1 ? riderArr.push(rider1) : null;
    rider2 ? riderArr.push(rider2) : null;
    rider3 ? riderArr.push(rider3) : null;

    if (riderArr.includes(user)) {
      var matchStart = new Date(timeStart * 1000).toLocaleString();
      var matchEnd = new Date(timeEnd * 1000).toLocaleString();
      matchData.push([
        matchStart,
        matchEnd,
        locationFrom,
        locationTo,
        riderArr,
        key,
      ]);
    }

    matchData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  return {
    reqData: reqData,
    matchData: matchData,
    foundMaxMatchId: foundMaxMatchId,
    foundMaxRequestId: foundMaxRequestId,
  };
};

export { db, formatData, FetchData };
