import {initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD7OoeQLul4l0pOol3W209lKejKITh1CJ0",
    authDomain: "blackhole-d1844.firebaseapp.com",
    projectId: "blackhole-d1844",
    storageBucket: "blackhole-d1844.appspot.com",
    messagingSenderId: "828462953865",
    appId: "1:828462953865:web:2808d91edd37a1e2071d58"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };