const functions = require('firebase-functions');
const cors = require('cors');
const { signup, login } = require('./handlers/auth.js')
 
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const app = require('express')();

app.use(cors());

//Routes

app.post('/login', login)
app.post('/signup', signup)


exports.api = functions.https.onRequest(app);