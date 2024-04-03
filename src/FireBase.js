
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/database';
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
  measurementId: "G-3BMNHFZ1ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);


//fetch data from firebase and display it in console
function FetchData() {
    var data;
    onValue(ref(db, '/requests'), snap => {
            if (snap.val()) {
                data = snap.val();
                console.log(data);
                return Object.values(data);
            }
        }, error => {
            data = error;
        }
    );
}





export {db};
