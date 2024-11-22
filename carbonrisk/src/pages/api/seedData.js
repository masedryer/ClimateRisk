import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Make sure to use the correct path from your environment variable
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!admin.apps.length) {
  const serviceAccount = require(path.resolve(serviceAccountPath)); // Dynamically resolve the path
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  try {
    // Read JSON data from the public folder
    const filePath = path.resolve(process.cwd(), "public/FYP_data2.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // Start Firestore batch operation
    const batch = db.batch();
    data.forEach((entry) => {
      const countryRef = db
        .collection("YearlyData")
        .doc(`${entry["Country Name"]}_${entry["Year"]}`);
      batch.set(countryRef, entry);
    });

    // Commit the batch
    await batch.commit();
    res.status(200).json({ message: "Data seeded successfully!" });
  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).json({ error: "Failed to seed data." });
  }
}
