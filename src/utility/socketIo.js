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
      //save message in the data base
      try{
        const roomId = [userId, targetUserId].sort().join("_");

        let chat = await Chat.findOne({
          participants : {$all : [userId , targetUserId]}

        })
        if(!chat){
          chat =  new Chat({
            participants :[userId , targetUserId],
            messages : []
          })
        }
        chat.messages.push({
          senderId : userId,
          text,
        })

        await chat.save();

        io.to(roomId).emit("msgReceived", {
        firstName,
        text,
        userId,
      });

      }
      catch(err){
         console.log(err)
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
