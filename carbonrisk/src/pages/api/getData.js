// pages/api/getData.js

import { firestore } from "../../lib/firebase";

export default async function handler(req, res) {
  const { country, year } = req.query;

  if (!country || !year) {
    return res.status(400).json({ message: "Country and Year are required" });
  }

  try {
    // Query Firestore for the matching country and year
    const snapshot = await firestore
      .collection("yearlydata")
      .where("country", "==", country)
      .where("year", "==", year)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    // Format and return the data
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ message: "Error fetching data" });
  }
}
