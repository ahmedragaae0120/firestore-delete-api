const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// مفتاح API بسيط للتحقق من الـ Admin
const ADMIN_KEY = "YOUR_SECRET_KEY";

app.delete("/delete", async (req, res) => {
    try {
        const { key, collection, docId } = req.body;

        if (key !== ADMIN_KEY) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await db.collection(collection).doc(docId).delete();
        res.json({ message: "Document deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
