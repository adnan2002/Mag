import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.magnolia.mag',
  appName: 'Mag',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "956162261899-rvp2p9qictoiqno905gu1fsgjkhqsq00.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
