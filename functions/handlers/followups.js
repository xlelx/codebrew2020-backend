const FollowUps = {};
const { db } = require('../util/admin');

const followUpsRef = db.collection('followups');
const currPatientId;

getAllFollowUps = (req, res) => {
    followUpsRef
        .where('patientId', '==', req.params.patientId)
        // does this put earliest appointment first?
        .orderBy('dateTime', 'asc')
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

getFollowUp = (req, res) => {
    let followUpData = {}
    followUpsRef
        .where('patientId', '==', req.params.patientId)
        .where('followupId', '==', req.params.followUpId)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'FollowUp Appointment not foound' });
            }
            followUpData = doc.data();
            followUpData.followUpId = doc.id();
            return res.json(followUpData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}



export default FollowUps;