const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId ,isOnline }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
  try {
    const roomId = [userId, targetUserId].sort().join("_");

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: []
      });
    }

    // Push message and grab the new length
    const newMsgIndex = chat.messages.push({
      senderId: userId,
      text,
    }) - 1;

    await chat.save();
    
    // Grab the actual saved message document containing the generated _id and createdAt
    const savedMessage = chat.messages[newMsgIndex];

    // Emit the complete, formatted object matching your fetchChat structure
    io.to(roomId).emit("msgReceived", {
      _id: savedMessage._id,
      userId: userId,
      firstName: firstName,
      text: text,
      createdAt: savedMessage.createdAt || new Date(),
    });

  } catch (err) {
    console.log(err);
  }
});

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
