import admin from 'firebase-admin';
var serviceAccount = require('../firebase/serviceAccountKey.json');



// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

    console.log('Firebase Admin SDK initialized.');
};

// Export the function for use in other modules
export { initializeFirebaseAdmin };

// Export the admin instance
export default admin;




