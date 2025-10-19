   // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

   export const environment = {
    firebase: {
        apiKey: "AIzaSyAOcQzHeILz0JFkDyC-VG_G8zHw5-nDvqs",
        authDomain: "estore-auth-bb0df.firebaseapp.com",
        projectId: "estore-auth-bb0df",
        storageBucket: "estore-auth-bb0df.firebasestorage.app",
        messagingSenderId: "436677274375",
        appId: "1:436677274375:web:6243d72b7cfc8edd4e33a2",
        measurementId: "G-YHVJQN21CL"
    },
    production: false
    };

    
// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);
