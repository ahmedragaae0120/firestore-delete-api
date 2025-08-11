const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

// تفعيل CORS لكل الطلبات
app.use(cors({
    origin: '*', // ممكن تحدد الدومين بتاعك بدل *
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// السماح بطلبات OPTIONS (Preflight)
app.options('*', cors());

// قراءة JSON من البودي
app.use(express.json());

const SECRET_KEY = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// تهيئة Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(SECRET_KEY)
});

// API لحذف الحساب
app.delete('/delete', async (req, res) => {
    const { collection, docId } = req.body;

    if (!collection || !docId) {
        return res.status(400).json({ error: "collection and docId are required" });
    }

    try {
        // حذف الوثيقة من Firestore
        await admin.firestore().collection(collection).doc(docId).delete();

        // حذف اليوزر من Firebase Auth
        await admin.auth().deleteUser(docId);

        res.json({ message: "User account and Firestore document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
