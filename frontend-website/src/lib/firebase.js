




import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCt-qCG_s16g14DiYMMFKKTAA41YBDvBGE",
  authDomain: "k4-gallery.firebaseapp.com",
  projectId: "k4-gallery",
  storageBucket: "k4-gallery.firebasestorage.app",
  messagingSenderId: "947077350982",
  appId: "1:947077350982:web:b9ff28eb0577fd07082c47",
  measurementId: "G-NBBBGQDMFG"
};


const app = initializeApp(firebaseConfig);

// YE LINES DEKHO - 'export' hona zaroori hai!
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
