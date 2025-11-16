const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// This new backup system reads your entire database. This can be slow and
// will count against your Firestore read quotas, but it works on the free plan.
// Note: This function might time out on very large databases.

const readAllData = async (documentRef) => {
  const collections = await documentRef.listCollections();
  const data = {};
  for (const collection of collections) {
    const collectionId = collection.id;
    data[collectionId] = {};
    const querySnapshot = await collection.get();
    for (const doc of querySnapshot.docs) {
      const docData = doc.data();
      const subcollections = await readAllData(doc.ref);
      if (Object.keys(subcollections).length > 0) {
        docData._subcollections = subcollections;
      }
      data[collectionId][doc.id] = docData;
    }
  }
  return data;
};

exports.backupFirestore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  if (context.auth.token.email !== "thimblot@gmail.com") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "The function must be called by an admin user."
    );
  }

  try {
    const firestore = admin.firestore();
    const backupData = await readAllData(firestore);
    return {
      message: "Backup data successfully retrieved.",
      backupData: backupData,
    };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while backing up Firestore."
    );
  }
});
