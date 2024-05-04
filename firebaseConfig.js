// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzRtyDZEOvyA_psyJmjiHzdZRc_Y56UMk",
  authDomain: "mass-general-research.firebaseapp.com",
  projectId: "mass-general-research",
  storageBucket: "mass-general-research.appspot.com",
  messagingSenderId: "1019589779134",
  appId: "1:1019589779134:web:36dea783c0306e9a7648ef",
  measurementId: "G-CEFNLWVCWR"
};

const analytics = null;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
isSupported().then((boo)=>{
    if(boo){
        analytics = getAnalytics(firebaseApp);
    }
})

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
