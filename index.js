const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// تهيئة Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const SECRET_KEY = JSON.parse(process.env.SERVICE_ACCOUNT_KEY); // نفس المفتاح اللي بتحقق منه

// API لحذف الحساب
app.delete('/delete', async (req, res) => {
    const { collection, docId } = req.body;



    try {
        // 1. حذف الوثيقة من Firestore
        await admin.firestore().collection(collection).doc(docId).delete();

        // 2. حذف اليوزر من Firebase Auth
        await admin.auth().deleteUser(docId);

        res.json({ message: "User account and Firestore document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// بدء السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
