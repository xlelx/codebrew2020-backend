const { db } = require('../util/admin');
const faqsRef = db.collection('faq');

exports.getAllFaqs = (req, res) => {
    faqsRef
        .where('patientId', '==', req.user.id)
        .get()
        .then(data => {
            let faqs = [];
            data.docs.map((doc) => {
                faqs.push({
                    faqId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(faqs);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

