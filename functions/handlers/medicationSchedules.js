const { db } = require('../util/admin');
const medicationSchedulesRef = db.collection('medicationSchedules');

exports.getAllMedicationSchedules = (req, res) => {
    medicationSchedulesRef
        .where('patientId', '==', req.user.id)
        .orderBy('startDate', 'asc')  
        .get()
        .then(data => {
            let medicationSchedules = [];
            data.docs.map((doc) => {
                medicationSchedules.push({
                    medicationSchedulesId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(medicationSchedules);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

