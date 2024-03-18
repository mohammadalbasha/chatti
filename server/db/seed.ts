import DB from "./index";
import { faker } from "@faker-js/faker";
import { User } from "../modules/auth/models/user.model";
import {
  Conversation,
  PrivateConversation,
  PublicConversation,
} from "../modules/conversations/models/conversation.model";
import { Message } from "../modules/messages/models/message.model";
// Connect to MongoDB
DB.instance().initialize();

// Function to generate a private conversation for two users
const generatePrivateConversation = async (userA: any, userB: any) => {
  const conversation = new PrivateConversation({
    userA: userA._id,
    userB: userB._id,
    lastUpdate: new Date(),
  });

  // Generate a large number of messages for the conversation
  const numMessages = 100;
  for (let i = 0; i < numMessages; i++) {
    //const sender = faker.random.arrayElement([userA, userB]);
    const sender = Math.random() > 0.5 ? userA : userB;
    const message = new Message({
      message: faker.lorem.sentence(),
      sender: sender._id,
      conversation: conversation,
    });

    await message.save();

    conversation.messages.push(message);
  }
  conversation.save();
};

// Function to generate a specified number of users and private conversations
const generateUsersAndConversations = async (numUsers: number) => {
  const users: any[] = [];

  // Generate the specified number of users
  for (let i = 0; i < numUsers; i++) {
    const user = new User({
      name: faker.name.firstName(),
      password: faker.internet.password(),
    });

    await user.save();
    users.push(user);
  }

  // Create private conversations between each pair of different users
  for (let i = 0; i < users.length; i++) {
    const userA = users[i];

    for (let j = i + 1; j < users.length; j++) {
      const userB = users[j];
      await generatePrivateConversation(userA, userB);
    }
  }
};

// Generate a specified number of users and private conversations
const numUsers = 100;
(async () => {
  // await User.deleteMany();
  // await Conversation.deleteMany();
  // await Message.deleteMany();
  // await PublicConversation.deleteMany();
  generateUsersAndConversations(numUsers)
    .then(() => {
      console.log("Data generation completed.");
      DB.instance().closeConnection();
    })
    .catch((error) => {
      console.error("Error generating data:", error);
    });
})();
