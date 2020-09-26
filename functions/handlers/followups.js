const { db } = require('../util/admin');
const followUpsRef = db.collection('followups');


exports.getAllFollowUps = (req, res) => {
    followUpsRef
        .orderBy('dateTime', 'asc') 
        .where('patientId', '==', req.user.id)
        .get()
        .then(data => {
            let followUps = [];
            data.docs.map((doc) => {
                followUps.push({
                    followUpId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(followUps);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}


