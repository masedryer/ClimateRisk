// src/scripts/uploadDataToFirestore.js
import { db, collection, addDoc } from "../lib/firebase";
import data from "FYP_data2.json"; // Import your data.json

const uploadData = async () => {
  try {
    for (const project of data) {
      // Add each project to the Firestore collection
      const docRef = await addDoc(collection(db, "projects"), project);
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Call the function to upload data
uploadData();
