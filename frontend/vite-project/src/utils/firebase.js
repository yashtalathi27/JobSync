// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider, signInWithPopup} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9mZNQbNnNml5r9b7jUlbQCR8sht33GbY",
    authDomain: "jobsync-2407b.firebaseapp.com",
    projectId: "jobsync-2407b",
    storageBucket: "jobsync-2407b.firebasestorage.app",
    messagingSenderId: "728581045518",
    appId: "1:728581045518:web:25742753d5db546bbcab5f",
    measurementId: "G-8LLLKV9QH5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app)
const provider=new GoogleAuthProvider();


export async function googleAuth() {
    try {
        let data = await signInWithPopup(auth,provider);
        // console.log(data);
        return data;
    }catch (error) {
        console.log(error );
    }
}