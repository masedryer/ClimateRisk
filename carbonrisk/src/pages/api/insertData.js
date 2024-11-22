import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const insertTestData = async () => {
  const data = {
    Year: 2021,
    "Country Name": "Ethiopia",
    "Forest Area Percent": 18.8205,
    "Forest Area KM": 188205,
    NDVI: 0.375521879,
    percipitation_winter: 36.53,
    percipitation_summer: 357.91,
    percipitation_spring: 282.87,
    percipitation_autumn: 248.04,
    "Max temperature": 30.09,
    "Mean temperature": 23.38,
    "Min temperature": 16.73,
    GDP: 755.7526443,
    "Electric Generation": 3328.848,
  };

  try {
    // Log Firestore initialization and collection reference
    console.log("Firestore initialized:", db);
    const collectionRef = collection(db, "yearlydata");
    console.log("Collection Reference:", collectionRef);

    console.log("Inserting data:", data);
    await addDoc(collectionRef, data);
    console.log("Data successfully inserted into Firestore!");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

// Run the insert function when the component mounts
useEffect(() => {
  insertTestData();
}, []);
