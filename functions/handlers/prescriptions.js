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

exports.postPrescription = async (req, res) => {
    const medications = [...req.body.medications];

    const newPrescription = {
        clinic: req.body.clinic,
        dateExpire: new Date().toISOString(),
        dateGenerated: new Date().toISOString(),
        patientFirstname: req.body.patientFirstName,
        patientLastName: req.body.patientLastName,
        patientId: req.body.patientId,
        diagnosis: req.body.diagnosis,
        doctorId: req.body.doctorId
    }

    // diagnosis should not be empty 
    if (newPrescription.diagnosis.trim() === '') {
        return res.status(400).json({body: "Should not be empty!"});
    }

    try {
        const prescriptionDoc = await prescriptionsRef.add(newPrescription);

        await medications.forEach(async medication => {
            const newMedication = {
                patientId: req.body.patientId,
                name: medication.medicationName,
                prescriptionId: prescriptionDoc.id,
                startDate: medication.startDate,
                endDate: medication.endDate,
                restrictions: medication.restrictions,
                instructions: medication.instructions
            }

            try {
                // add to medication
            const medicationDoc = await db.collection('medications').add(newMedication);
            console.log(medicationDoc.data());
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'something went wrong again'});
            }
        })
        return res.status(200).json(newPrescription);
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong' });
    }
}

    

    // // if diagnosis is not empty, create a new prescription document in firestore
    // else {
    //     prescriptionsRef
    //     .add(newPrescription)
    //     .then(doc => {
    //         const resPrescription = newPrescription;
    //         resPrescription.prescriptionId = doc.id;

    //         // medications.forEach(element => {
    //         //     const newMedication = {
    //         //         patientId: patientId,
    //         //         name: medication.medicationName,
    //         //         prescriptionId: prescriptionId,
    //         //         startDate: medication.startDate,
    //         //         endDate: medication.endDate,
    //         //         restrictions: medication.restrictions,
    //         //         instructions: medication.instructions
    //         //     }
            
    //         //     // diagnosis should not be empty 
    //         //     if (newMedication.body.name.trim() === '') {
    //         //         return res.status(400).json({body: "Should not be empty!"});
    //         //     }
            
    //         //     // if medication name is not empty, create a new prescription document in firestore
                
    //         //     medicationsRef
    //         //     .add(newMedication)
    //         //     .then(doc => {
    //         //         const resMedication = newMedication;
    //         //         resMedication.medicationId = doc.id;
    //         //         res.json(resMedication);
    //         //     })
    //         //     .catch(err => {
    //         //         res.status(500).json({ error: 'something went wrong' });
    //         //     })
                
                
    //         // });
            
        
    //         res.json(resPrescription);
            
    //     })
    //     .catch(err => {
    //         res.status(500).json({ error: 'something went wrong' });
    //     })
    // }





