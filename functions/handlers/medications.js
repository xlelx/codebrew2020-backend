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

exports.getAllRestrictions = (req, res) => {
    medicationsRef
        .where('patientId', '==', req.user.id)
        .get()
        .then(data => {
            let restrictions = [];
            data.docs.map((doc) => {
                restrictions.push({
                    medicationId: doc.id,
                    source: doc.medicationName,
                    description: doc.restrictions
                })
            })
            return res.json(restrictions);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

// exports.postMedication = (medication, prescriptionId, patientId) => {

//     const newMedication = {
//         patientId: patientId,
//         name: medication.medicationName,
//         prescriptionId: prescriptionId,
//         startDate: medication.startDate,
//         endDate: medication.endDate,
//         restrictions: medication.restrictions,
//         instructions: medication.instructions
//     }

//     // diagnosis should not be empty 
//     if (newMedication.body.name.trim() === '') {
//         res.status(400).json({body: "Should not be empty!"});
//     }

//     // if medication name is not empty, create a new prescription document in firestore
//     else {
//         medicationsRef
//         .add(newMedication)
//         .then(doc => {
//             const resMedication = newMedication;
//             resMedication.medicationId = doc.id;
//             res.json(resMedication);
//         })
//         .catch(err => {
//             res.status(500).json({ error: 'something went wrong' });
//         })
//     }

// }
