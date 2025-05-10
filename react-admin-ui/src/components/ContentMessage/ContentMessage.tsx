import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { apiCustom } from "../../custom/customApi";
import { IoVideocamOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FiDownload, FiSend } from "react-icons/fi";
import { TbPointFilled } from "react-icons/tb";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
type ContentMessageProps = {
  chatId: string;
};

const ContentMessage = ({ chatId }: ContentMessageProps) => {
  // ✅ 1. Khởi tạo đúng kiểu dữ liệu (Array)
  const [messagess, setMessages] = useState<any>([]);
  const [textMess, setTextMess] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [checkTextMess, setCheckTextMess] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    setTextMess((prev) => prev + emoji.native);
  };
  // ✅ 2. Lấy dữ liệu bằng useQuery
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["message", chatId], // Thêm chatId để cache theo từng phòng chat
    queryFn: () => apiCustom.get(`/chat/${chatId}`).then((res) => res.data),
    enabled: !!chatId, // Chỉ chạy khi chatId có giá trị hợp lệ
  });

  // ✅ 3. Cập nhật state trong useEffect
  useEffect(() => {
    if (
      data?.data?.messages &&
      JSON.stringify(messagess) !== JSON.stringify(data.data.messages)
    ) {
      setMessages(data.data.messages);
      console.log("✅ Đã cập nhật tin nhắn: ", data.data.messages);
    }
  }, [data]);

  // ✅ 4. Lấy thông tin user từ localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const idUser = user?.data?.user?._id;

  // ✅ 5. Xử lý trạng thái loading và lỗi
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as any)?.message}</p>;

  // API CREATE

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      chatId,
      senderId,
      text,
    }: {
      chatId: any;
      senderId: any;
      text: any;
    }) => {
      return apiCustom.post(`message`, {
        chatId,
        senderId,
        text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allChat"]); // Cập nhật lại tin nhắn sau khi gửi
    },
  });
  const handlePostMessage = () => {
    if (!chatId || !idUser || !textMess?.trim()) {
      setCheckTextMess(true);
      return;
    }
    mutation.mutate({
      chatId,
      senderId: idUser,
      text: textMess,
    });
  };
  return (
    <div className="MRight">
      {/* UP */}
      <div className="MRightUp">
        <div className="MRightUpInfo">
          <div className="MRightUpImage">
            <img src={data?.data?.chat?.members?.[0]?.image || null} alt="" />
          </div>
          <div className="MRightUpName">
            <span>{data?.data?.chat?.members[0]?.username || null}</span>
            <div className="status">
              <span>
                <TbPointFilled />
              </span>
              <p>Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="MRightUpSetting">
          <div className="cam">
            <IoVideocamOutline />
          </div>
          <div className="phone">
            {" "}
            <BsTelephone />
          </div>
          <div className="option">
            {" "}
            <SlOptions />
          </div>
        </div>
      </div>
      {/* CONTENT */}
      <div className="chat-container">
        <div className="chat-date">Today, Jan 24</div>
        {Array.isArray(messagess) &&
          messagess.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                idUser === msg.senderId ? "sender" : "receiver"
              }`}
            >
              {!(idUser === msg.senderId) && (
                <img
                  src={
                    data?.data?.chat?.members?.[0]?.image ||
                    "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                  }
                  alt="avatar"
                  className="avatar"
                />
              )}
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="time">
                  {" "}
                  {dayjs(msg.updatedAt).format("hh:mm A")}
                </span>
              </div>
              {idUser === msg.senderId && (
                <img
                  src={
                    data?.data?.chat?.members?.[1]?.image ||
                    "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                  }
                  alt="avatar"
                  className="avatar"
                />
              )}
            </div>
          ))}
      </div>
      {/* BELOW */}
      <div className="MRightBelow">
        <div className="MRightBelowInput">
          <input
            type="text"
            className={checkTextMess ? "inputError" : "inputSuccess"}
            placeholder={
              checkTextMess ? "Please , Enter text message " : "Type a message"
            }
            value={textMess}
            onChange={(e) => {
              setTextMess(e.target.value);
              setCheckTextMess(false);
            }}
          />
          <div className="MRightBelowIcon">
            <MdOutlineInsertPhoto />
            <FaRegFaceSmile
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{ cursor: "pointer" }}
            />
            <FiDownload />
          </div>

          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker
                data={emojiData}
                onEmojiSelect={(emoji: any) =>
                  setTextMess((prev) => prev + emoji.native)
                } // ✅ Cập nhật input khi chọn emoji
                theme="light"
              />
            </div>
          )}
        </div>
        <div className="MRightBelowIconSend">
          <FiSend onClick={() => handlePostMessage()} />
        </div>
      </div>
    </div>
  );
};

export default ContentMessage;
