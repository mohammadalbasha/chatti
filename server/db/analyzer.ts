import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://user:password@localhost:27017";
const dbName = "test";

(async () => {
  // Connect to MongoDB
  const client = new MongoClient(uri);

  client.connect();
  const db = client.db(dbName);

  try {
    const messagesCollection = db.collection("messages");

    // before indexing = 39 ms
    // after indexing 1 ms

    const result = await messagesCollection.createIndex({ sender: 1 });

    // // Find documents in the "users" collection
    // const users = await messagesCollection.find().explain();

    const messages = await messagesCollection
      .find({
        sender: ObjectId.createFromHexString("65b668efc64393b602a99c52"),
      })
      .explain("executionStats");

    console.log(
      "Users found:",
      messages.queryPlanner.winningPlan,
      messages.executionStats
    );
  } catch (error) {
    console.error("Error finding users:", error);
  } finally {
    // Close the MongoDB connection
    client.close();
  }
})();
