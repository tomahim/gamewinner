const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Note: to use this function, you need to grant the service account that
// runs your Cloud Functions the "Storage Admin" role on your Cloud Storage
// bucket.
exports.backupFirestore = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // Ensure the user is an admin.
  if (context.auth.token.email !== "thimblot@gmail.com") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "The function must be called by an admin user."
    );
  }

  const firestore = admin.firestore();
  const bucket = "gs://board-game-tracker-b92c5.appspot.com"; // Replace with your bucket name
  const client = new admin.firestore.v1.FirestoreAdminClient();

  const listAllCollections = async (documentRef) => {
    const collections = await documentRef.listCollections();
    const collectionIds = collections.map((col) => col.id);
    for (const collectionId of collectionIds) {
      const subcollections = await listAllCollections(
        documentRef.collection(collectionId)
      );
      collectionIds.push(...subcollections);
    }
    return collectionIds;
  };

  try {
    const collections = await listAllCollections(firestore);
    const timestamp = new Date().toISOString();
    const backupPath = `${bucket}/backups/${timestamp}`;

    await client.exportDocuments({
      name: client.databasePath(
        process.env.GCP_PROJECT,
        "(default)"
      ),
      outputUriPrefix: backupPath,
      collectionIds: collections,
    });

    return {
      message: `Successfully backed up Firestore to ${backupPath}`,
    };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while backing up Firestore."
    );
  }
});

exports.automatedBackup = functions.pubsub.schedule('every sunday 00:00').onRun(async (context) => {
  const firestore = admin.firestore();
  const bucket = "gs://board-game-tracker-b92c5.appspot.com"; // Replace with your bucket name
  const client = new admin.firestore.v1.FirestoreAdminClient();

  const listAllCollections = async (documentRef) => {
    const collections = await documentRef.listCollections();
    const collectionIds = collections.map((col) => col.id);
    for (const collectionId of collectionIds) {
      const subcollections = await listAllCollections(
        documentRef.collection(collectionId)
      );
      collectionIds.push(...subcollections);
    }
    return collectionIds;
  };

  try {
    const collections = await listAllCollections(firestore);
    const timestamp = new Date().toISOString();
    const backupPath = `${bucket}/backups/${timestamp}`;

    await client.exportDocuments({
      name: client.databasePath(
        process.env.GCP_PROJECT,
        "(default)"
      ),
      outputUriPrefix: backupPath,
      collectionIds: collections,
    });

    console.log(`Successfully backed up Firestore to ${backupPath}`);
  } catch (err) {
    console.error(err);
  }
});