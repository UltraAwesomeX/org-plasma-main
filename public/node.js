import admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Function to delete all users
async function deleteAllUsers(nextPageToken) {
  try {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const deletePromises = listUsersResult.users.map(userRecord => {
      console.log(`Deleting user: ${userRecord.uid}`);
      return admin.auth().deleteUser(userRecord.uid);
    });

    await Promise.all(deletePromises);

    if (listUsersResult.pageToken) {
      await deleteAllUsers(listUsersResult.pageToken);
    } else {
      console.log("All users deleted.");
    }
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

// Run the function
deleteAllUsers();
