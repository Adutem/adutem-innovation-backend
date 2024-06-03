import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB1K8-D48MWdvjQNgLl742bCzxKDzz5zIo",
  authDomain: "acorn-auto.firebaseapp.com",
  projectId: "acorn-auto",
  storageBucket: "acorn-auto.appspot.com",
  messagingSenderId: "1080404539190",
  appId: "1:1080404539190:web:fd739ba57f39310cc9a597",
  measurementId: "G-WF1H0MMZ7R",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
