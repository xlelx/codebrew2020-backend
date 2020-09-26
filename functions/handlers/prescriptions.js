const { db } = require('../util/admin');
const prescriptionsRef = db.collection('prescriptions');
const { postMedication } = require('./medications');

exports.getAllPrescriptions = (req, res) => {
    prescriptionsRef
        .orderBy('dateExpire', 'asc') 
        .where('patientId', '==', req.user.id)
        .get()
        .then(data => {
            let prescriptions = [];
            data.docs.map((doc) => {
                prescriptions.push({
                    prescriptionId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(prescriptions);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.postPrescription = (req, res) => {
    const medications = req.body.medications;
    const restrictions = req.body.warnings;

    const newPrescription = {
        clinic: req.body.clinic,
        dateExpire: req.body.prescriptionEndDate,
        dateGenerated: req.body.prescriptionStartDate,
        patientFirstname: req.body.patientFirstName,
        patientLastName: req.body.patientLastName,
        patientId: req.body.patientId,
        diagnosis: req.body.diagnosis,
        doctorId: req.body.doctorId
    }

    // diagnosis should not be empty 
    if (newPrescription.body.diagnosis.trim() === '') {
        res.status(400).json({body: "Should not be empty!"});
    }

    // if diagnosis is not empty, create a new prescription document in firestore
    else {
        prescriptionsRef
        .add(newPrescription)
        .then(doc => {
            const resPrescription = newPrescription;
            resPrescription.prescriptionId = doc.id;

            // ADD THE MEDICATIONS FROM THIS PRESCRIPTION TO DATABASE
            for (var i=0; i<medications.length; i++) {
                postMedication(medication, resPrescription.prescriptionId, req.body.patientId);
            }

            // ADD THE WARNING FROM THIS PRESCRIPTION TO DATABASE if any
            
            
            
            res.json(resPrescription);
            
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
        })
    }

}




