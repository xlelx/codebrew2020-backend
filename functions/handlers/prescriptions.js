const { db } = require('../util/admin');
const prescriptionsRef = db.collection('prescriptions');

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
    const newPrescription = {
        
    }
}



