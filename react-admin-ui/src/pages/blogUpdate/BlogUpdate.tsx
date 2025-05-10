import React, { useEffect, useState } from "react";
import "../addBlog/AddBlog.scss";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import upload from "../../utils/upload";
const BlogUpdate = () => {
  // quan ly thong tin nhap vao
  const [listInfoBlog, setListInfoBlog] = useState({
    titleBlog: "",
    imgMainBlog: "",
    descripShort: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [initValue, setInitValue] = useState("");
  // Lấy thông tin của blog ra để in ra
  const { id } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["singleBlog"],
    // queryFn: () => customFetch(`/user/${id}`),
    queryFn: () => apiCustom.get(`/blog/${id}`).then((res) => res.data), // Dùng axios
  });
  // Sau khi lấy data từ API
  useEffect(() => {
    if (data) {
      setListInfoBlog({
        titleBlog: data?.blog?.titleBlog || "",
        descripShort: data?.blog?.descripShort || "",
        description: data?.blog?.description || "",
        imgMainBlog: data?.blog?.imgMainBlog || "",
      });
      setInitValue(data?.blog?.description || ""); // ✅ Chỉ set 1 lần
    }
  }, [data]);

  // Hàm lấy thông tin từ Editor
  const editorRef = useRef<any>(null);
  const handleEditorChange = (content: string) => {
    const trimmedContent = content.trim(); // ✅ Loại bỏ khoảng trắng thừa
    setListInfoBlog((prev) => {
      if (prev.description.trim() === trimmedContent) return prev;
      return { ...prev, description: trimmedContent };
    });
  };

  const handleChangeInfoBlog = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    valueChange: string
  ) => {
    setListInfoBlog((prev) => ({
      ...prev,
      [valueChange]: e.target.value || "",
    }));
  };
  // API CREATE
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (info: {}) => {
      return apiCustom.put(`/blog/${id}`, info);
    },
    onSuccess: (response) => {
      toast.success("🎉 Blog đã được tạo thành công!");
      navigate("/blogs");
    },
    onError: (error) => {
      // ❌ Thất bại -> Thông báo lỗi
      toast.error("🚨 Lỗi khi tạo blog. Vui lòng thử lại!");
    },
  });

  // XÁC NHẬN UPDATE BLOG
  const handleConfirm = async () => {
    const { titleBlog, descripShort, description } = listInfoBlog;

    // Kiểm tra nếu thiếu thông tin
    if (!titleBlog.trim() || !descripShort.trim() || !description.trim()) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin tất cả các trường!");
      return;
    }
    const url = await upload(file, "blog");

    // Nếu đủ thông tin thì gọi mutation
    mutation.mutate({ ...listInfoBlog, imgMainBlog: url });
  };
  return (
    <div className="addblog">
      <div className="contentP">
        <h2>Update Blog</h2>
        <hr />
        <div className="managerInputP">
          <div className="fileUpdate">
            <div
              className="item"
              style={{
                color: "black",
              }}
            >
              <label>Image Blog</label>
              <input
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="manageImg">
              <img src={listInfoBlog.imgMainBlog} alt="" />
            </div>
          </div>
          <div
            className="item"
            style={{
              color: "black",
            }}
          >
            <label>Title Blog</label>
            <input
              type="text"
              placeholder="Enter Title Blog  "
              value={listInfoBlog.titleBlog}
              onChange={(e) => handleChangeInfoBlog(e, "titleBlog")}
            />
          </div>{" "}
          <div className="item">
            <label>Description Shot</label>
            <textarea
              placeholder="Enter Description Shot"
              value={listInfoBlog.descripShort}
              onChange={(e) => handleChangeInfoBlog(e, "descripShort")}
            />
          </div>{" "}
          <div className="item">
            <label>Description</label>
            <Editor
              apiKey="slkxn3po6ill32zhn1nahxuyjlhmvh226r9uawyyc4iam4tu"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={initValue} // ✅ Chỉ set 1 lần
              init={{
                height: 500,
                menubar: false,
                paste_as_text: true,
                directionality: "ltr", // ✅ Cố định text từ trái sang phải
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
                content_style: `
      body { 
        font-family:Helvetica,Arial,sans-serif; 
        font-size:14px; 
        direction: ltr !important;
        text-align: left !important;
      }
    `,
              }}
              onEditorChange={handleEditorChange}
            />
          </div>{" "}
        </div>

        <div className="btnP">
          <button
            className="pConfirm"
            onClick={() => {
              handleConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogUpdate;
