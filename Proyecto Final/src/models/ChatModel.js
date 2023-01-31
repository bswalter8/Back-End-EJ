import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    tipo: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    fechahora: { type: String, required: true }
  });

const ChatModel = mongoose.model('chat-msg', chatSchema);

export default ChatModel;