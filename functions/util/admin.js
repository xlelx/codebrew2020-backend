var admin = require("firebase-admin");

var serviceAccount = require("../key/admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codebrew-2020-2ee6c.firebaseio.com"
});

const db = admin.firestore();

module.exports = {admin, db};