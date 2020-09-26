const { db } = require('../util/admin');
const medicationsRef = db.collection('medications');

exports.getAllMedications = (req, res) => {
    medicationsRef
        .where('patientId', '==', req.user.id)
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
