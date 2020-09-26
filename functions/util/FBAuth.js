const {db, admin} = require("../util/admin");


function FBAuth(req, res, next){
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        idToken = req.headers.authorization.split('Bearer ')[1];
        
    }
    else{
        console.error('No token found');
        return res.status(403).json({error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
        req.user.email = data.docs[0].data().email;
        req.user.id = data.docs[0].data().userId;
        return next();
    })
    .catch(err => {
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    })
}

module.exports.FBAuth = FBAuth;