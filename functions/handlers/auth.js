
const {validateLoginData, validateSignupData} = require('../util/validators')

const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);


exports.getAllPatients = (req, res) => {
  db.collection('users')
    .where('isDoctor', '==', true)
    .get()
    .then(data => {
      let patients = []
      data.forEach(doc => {
        patients.push({
          ...doc.data(),
          userId: doc.id
        })
      })
      return res.json(patients)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  const { valid, errors } = validateSignupData(newUser)

  if (!valid) return res.status(400).json(errors)
  let token, userId
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'this handle is already taken' })
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idtoken => {
      token = idtoken
      const userCredentials = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: new Date().toISOString(),
        userId
      }
      return db.doc(`/users/${userId}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err)
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'email is already in use' })
      }
      return res
        .status(500)
        .json({ general: 'Something went wrong. Please try again. ' })
    })
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  const { valid, errors } = validateLoginData(user)

  if (!valid) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.log(err)
      return res
        .status(400)
        .json({ general: 'Wrong credentials, please try again' })
    })
}
