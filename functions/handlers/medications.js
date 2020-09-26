const Medications = {};
const { db } = require('../util/admin');

getAllMedications = (req, res) => {
    followUpsRef
        .where('patientId', '==', req.params.patientId)
        // does this put latest-prescribed medication first?
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let medications = [];
            data.docs.map((doc) => {
                medications.push({
                    medicationId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(medications);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

getMedication = (req, res) => {
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


export default Medications;