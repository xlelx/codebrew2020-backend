const functions = require('firebase-functions');
const cors = require('cors');
const { signup, login } = require('./handlers/auth.js')
const { FBAuth } = require('./util/FBAuth');
const { getAllFollowUps } = require('./handlers/followups');
const { getAllMedications } = require('./handlers/medications');
const { getAllMedicationSchedules } = require('./handlers/medicationSchedules');
const { getAllRestrictions } = require('./handlers/restrictions');
const { getAllFaqs } = require('./handlers/faqs');
const { getAllPrescriptions } = require('./handlers/prescriptions');


 
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


app.get('/allfaqs', FBAuth, getAllFaqs)
app.get('/allmedications', FBAuth, getAllMedications)
app.get('/allprescriptions', FBAuth, getAllPrescriptions)
app.get('/allrestrictions', FBAuth, getAllRestrictions)
app.get('/allmedicationschedules', FBAuth, getAllMedicationSchedules)
app.get('/allfollowups', FBAuth, getAllFollowUps)


exports.api = functions.https.onRequest(app);