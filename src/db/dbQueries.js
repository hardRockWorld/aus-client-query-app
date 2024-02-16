import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/db/fb.js";

const addNewQuery = async (db, query, email) => {
  const queriesColl = collection(db, "queries");
  const queriesSnapshot = await getCountFromServer(queriesColl);

  const sln = queriesSnapshot.data().count + 1;
  const docData = {
    sln: sln,
    clientName: query.clientName,
    clientAddress: query.clientAddress,
    clientAge: query.clientAge,
    clientGender: query.clientGender,
    clientContactNo: query.clientContactNo,
    clientWhatsappNo: query.clientWhatsappNo,
    clientEmail: query.clientEmail,
    calledFor: query.calledFor,
    querySubject: query.querySubject,
    queryReceivedBy: query.queryReceivedBy,
    queryDate: query.queryDate,
    queryStatus: query.queryStatus,
    notes: query.notes,
    createdBy: email,
    resolutionGiven: query.resolutionGiven,
    remarks: query.remarks,
  };

  const docRef = await addDoc(queriesColl, docData);
  console.debug("Document written with ID: ", docRef.id);
  console.debug("Document is: ", docRef);

  // Return an object containing both docRef and sln
  return {
    docRef,
    sln,
  };
};

const fetchSingleDocRef = async (docRef) => {
  // Retrieve the document data using the docRef
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
};

// Get a single query by sln
const getQueryBySLN = async (sln) => {
  const queryRef = doc(db, "queries", sln);

  try {
    const queryDoc = await getDoc(queryRef);
    if (queryDoc.exists()) {
      return { ...queryDoc.data(), id: queryDoc.id };
    } else {
      console.error("Query not found!");
      return null;
    }
  } catch (error) {
    console.error("Error getting query:", error);
    return null;
  }
};

const fetchAllQueries = async () => {
  let queries = []; // Clear the queries array
  const q = query(collection(db, "queries"), orderBy("sln", "desc"));

  const querySnapshot = await getDocs(q);
  await querySnapshot.forEach((doc) => {
    queries.push({ ...doc.data(), id: doc.id });
  });

  return queries;
};

const updateEditQuery = async (db, currentQuery) => {
  let result;
  const docRef = doc(db, "queries", currentQuery.id);
  try {
    await updateDoc(docRef, {
      clientName: currentQuery.clientName,
      clientAddress: currentQuery.clientAddress,
      clientAge: currentQuery.clientAge,
      clientGender: currentQuery.clientGender,
      clientContactNo: currentQuery.clientContactNo,
      clientWhatsappNo: currentQuery.clientWhatsappNo,
      clientEmail: currentQuery.clientEmail,
      calledFor: currentQuery.calledFor,
      querySubject: currentQuery.querySubject,
      queryReceivedBy: currentQuery.queryReceivedBy,
      queryDate: currentQuery.queryDate,
      queryStatus: currentQuery.queryStatus,
      notes: currentQuery.notes,
      createdBy: currentQuery.createdBy,
      resolutionGiven: currentQuery.resolutionGiven,
      remarks: currentQuery.remarks,
    });
    result = true;
  } catch (e) {
    result = false;
  }

  return result;
};

const updateNonEditOrder = async (db, currentQuery) => {
  let result;
  const docRef = doc(db, "queries", currentQuery.id);
  try {
    await updateDoc(docRef, {
      status: currentQuery.status,
      notes: currentQuery.notes,
    });
    result = true;
  } catch (e) {
    result = false;
  }

  return result;
};

export {
  addNewQuery,
  fetchSingleDocRef,
  getQueryBySLN,
  fetchAllQueries,
  updateEditQuery,
  updateNonEditOrder,
};
