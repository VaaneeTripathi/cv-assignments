// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyA_kn2Q3avBQhO7UjcCdvHIjANl-N15yhE",
    authDomain: "vaaneetripathi.github.io",
    databaseURL: "https://cv-assignment-32566-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cv-assignment-32566",
    storageBucket: "cv-assignment-32566.firebasestorage.app",
    messagingSenderId: "274746989601",
    appId: "1:274746989601:web:a7562c27f3e0e94fe89760",
    measurementId: "G-Y7NVCRGB3D"
};

// Google OAuth Client ID (from Firebase project)
const GOOGLE_CLIENT_ID = '274746989601-deh77sm2h8bmftlbipk2uvdn4j6icnu4.apps.googleusercontent.com';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Configure auth settings
auth.useDeviceLanguage();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error);

// Export for use in other scripts
window.firebaseAuth = auth;
window.firebaseDatabase = database;
window.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
