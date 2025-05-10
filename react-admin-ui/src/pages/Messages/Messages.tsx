import React, { useEffect, useState } from "react";
import "./Messages.scss";
import { LuPencilLine } from "react-icons/lu";
import { IoSearchSharp } from "react-icons/io5";
import { RiMessage2Line } from "react-icons/ri";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";
import ContentMessage from "../../components/ContentMessage/ContentMessage";
const Messages = () => {
  const [chats, setChats] = useState<any[]>([]); // ✅ Khởi tạo đúng kiểu dữ liệu
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["allChat"],
    queryFn: () => apiCustom.get("/chat").then((res) => res.data),
  });

  // useEffect sẽ chạy khi "data" thay đổi
  useEffect(() => {
    if (data?.chat && JSON.stringify(chats) !== JSON.stringify(data.chat)) {
      setChats(data.chat);
    }
  }, [data]);
  console.log(chats);

  // Config ngày
  const date = new Date(); // Lấy ngày hiện tại
  // Sử dụng literal types thay vì string
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // "long" | "short" | "narrow"
    year: "numeric", // "numeric" | "2-digit"
    month: "long", // "long" | "short" | "narrow" | "2-digit" | "numeric"
    day: "2-digit", // "2-digit" | "numeric"
  };
  // Định dạng ngày kiểu "Sunday, 25 May, 2025"
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const [chatId, setChatId] = useState("");

  // Hàm handleMessage chỉ để cập nhật chatId
  const handleMessage = (id: string) => {
    console.log("check id trả về:", id);
    setChatId(id);
  };
  return (
    <div className="Messages">
      {/*  */}
      <div className="MLeft">
        {/* UP */}
        <div className="MLeftUp">
          <div className="MLeftUpContent">
            <span>Messages </span>
            <p>{formattedDate}</p>
          </div>
          <div className="MLeftUpIcon">
            <LuPencilLine />
          </div>
        </div>
        {/* Search */}
        <div className="MLeftInput">
          <input type="text" name="" id="" placeholder={`  Search Chart`} />
          <div className="MLeftInputIcon">
            <IoSearchSharp />
          </div>
        </div>
        {/* Mess OF User */}
        <div className="userMessage">
          {Array.isArray(chats) &&
            chats
              .filter((chat) => chat.unreadCount > 0) // Lọc các phần tử có unreadCount > 0
              .map((chat, index) => (
                <div
                  key={index}
                  className="userMessage__item"
                  onClick={() => handleMessage(chat._id)}
                >
                  <div className="userMessage__avatar">
                    <img src={chat.members[0]?.image} alt="avatar" />
                  </div>
                  <div className="userMessage__details">
                    <h4>{chat.members[0]?.username}</h4>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <div className="userMessage__index">
                    <div className="userMessage__time">
                      {dayjs(chat.lastMessageAt).format("hh:mm A")}
                    </div>
                    <div className="userMessage__notification">
                      {chat.unreadCount}
                    </div>
                  </div>
                </div>
              ))}

          <div className="AllMess">
            <div>
              <RiMessage2Line />
            </div>
            <span>All Message</span>
          </div>
          {Array.isArray(chats) &&
            chats
              .filter((chat) => chat.unreadCount < 1) // Lọc các phần tử có unreadCount > 0
              .map((chat, index) => (
                <div
                  key={index}
                  className={`userMessage__item ${
                    chat._id === activeChatId ? "active" : ""
                  }`}
                  onClick={() => {
                    handleMessage(chat._id);
                    setActiveChatId(chat._id); // ✅ Đánh dấu phần tử đã active
                  }}
                >
                  <div className="userMessage__avatar">
                    <img src={chat.members[0]?.image} alt="avatar" />
                  </div>
                  <div className="userMessage__details">
                    <h4>{chat.members[0]?.username}</h4>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <div className="userMessage__index">
                    <div className="userMessage__time">
                      {dayjs(chat.lastMessageAt).format("hh:mm A")}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      {/*  */}
      <ContentMessage chatId={chatId} />
    </div>
  );
};

export default Messages;
