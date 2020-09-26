const { db } = require('../util/admin');
const restrictionsRef = db.collection('restrictions');

exports.getAllRestrictions = (req, res) => {
    restrictionsRef
        .where('patientId', '==', req.user.id)
        .get()
        .then(data => {
            let restrictions = [];
            data.docs.map((doc) => {
                restrictions.push({
                    restrictionId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(restrictions);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

