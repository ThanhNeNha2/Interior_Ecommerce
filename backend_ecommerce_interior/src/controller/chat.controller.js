import CHAT from "../models/Chat.model";
import MESSAGE from "../models/Message.model.js";

export const getAllChat = async (req, res) => {
  try {
    const chat = await CHAT.find().populate("members", "username image");
    return res.status(200).json({
      message: "Lấy danh sách chat thành công",
      idCode: 0,
      chat,
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      message: "Truy cập danh sách chat không thành công",
      idCode: 1,
      error: error.message,
    });
  }
};

export const getChatById = async (req, res) => {
  const { chatId } = req.params; // Lấy chatId từ params

  try {
    // 1. Lấy thông tin của cuộc trò chuyện và reset unreadCount về 0
    const chat = await CHAT.findByIdAndUpdate(
      chatId,
      { unreadCount: 0 }, // Đặt lại về 0
      { new: true } // Trả về bản ghi đã cập nhật
    ).populate("members", "username email image");

    if (!chat) {
      return res.status(404).json({
        message: "Không tìm thấy cuộc trò chuyện",
        idCode: 1,
      });
    }

    // 2. Lấy danh sách tin nhắn liên quan
    const messages = await MESSAGE.find({ chatId }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tăng dần

    return res.status(200).json({
      message: "Lấy thông tin chat thành công",
      idCode: 0,
      data: {
        chat,
        messages,
      },
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      message: "Truy cập thông tin CHAT không thành công",
      idCode: 1,
      error: error.message,
    });
  }
};

export const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Kiểm tra nếu chat đã tồn tại
    const existingChat = await CHAT.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "CHAT đã tồn tại",
        idCode: 0,
        data: existingChat,
      });
    }

    // Nếu chưa có, tạo chat mới
    const newChat = new CHAT({
      members: [senderId, receiverId],
    });
    const savedChat = await newChat.save();

    return res.status(200).json({
      message: "Tạo chat thành công",
      idCode: 0,
      data: savedChat,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Tạo chat không thành công",
      idCode: 1,
      error: error.message,
    });
  }
};
