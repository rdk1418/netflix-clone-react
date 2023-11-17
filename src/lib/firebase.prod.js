import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'ASIAVJBBSJKXL7EDE2U4',
    secretAccessKey: 'fPfn6PTwYVoaxWuc+ZeU8gGSkDkTyMJGYxmH5qUn',
    sessionToken: 'FwoGZXIvYXdzEGcaDB5YK9/pKkl5LOCKySK/Af92LG8D3XwB/dTBCubhJRMB7uOvqv8MuXAUWjLA1KBiCUpdW6oMNysOf0wX2LWfOMbX+pA1WMHY1LFFAOZPg0FVN5ZWDqAOydP+XKAFqjZxDd9ngND+QJLf0DXx4R2RwXd7WZ90NGZnc8mN65sFjF6b+4Z23gKqSvEY2NvCb7tw72Q0HKze9qEhG2F16g252K+PtfqMJLFkCq+KFf3vdlS/3DJQkxjak/kTqxpChE/+DH+fKa4tUT3u3IAeIJTeKL2E3KoGMi3zMW24o2yENirY9t8ekYfutmXs85XpMKVkSTsgm97+iGB0Y0YMsg5E8TFDeAc='
  }
});

const secretName = 'ApplicationFirebaseCreds';
const client = new AWS.SecretsManager();

// Function to initialize Firebase
export function initializeFirebase() {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, function(err, data) {
      if (err) {
        console.error("Error retrieving secret:", err);
        reject(err);
        return;
      }

      console.log("Secret retrieved successfully");

      if ('SecretString' in data) {
        const secretObj = JSON.parse(data.SecretString);
        const firebaseConfig = {
          apiKey: secretObj.apiKey,
          authDomain: secretObj.authDomain,
          projectId: secretObj.projectId,
          storageBucket: secretObj.storageBucket,
          messagingSenderId: secretObj.messagingSenderId,
          appId: secretObj.appId
        };

        const firebase = initializeApp(firebaseConfig);
        const firestore = getFirestore(firebase);
        const auth = getAuth(firebase);

        resolve({ firebase, firestore, auth });
      } else {
        console.log("Secret is in binary format, additional handling required");
        reject(new Error("Secret in binary format"));
      }
    });
  });
}
