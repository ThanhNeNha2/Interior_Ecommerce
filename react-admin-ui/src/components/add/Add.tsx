import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";
import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import upload from "../../utils/upload";
type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const [infoCreate, setInfoCreate] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    address: "",
    role: "USER",
    image: "",
  });

  const handleChangeInfoCreate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string
  ) => {
    setInfoCreate((prev) => ({ ...prev, [key]: e.target.value }));
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (info: {}) => {
      return apiCustom.post(`/${props.slug}`, info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`all${props.slug}`]);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra có trường nào bị bỏ trống không (trừ trường "image")
    for (const key in infoCreate) {
      if (
        key !== "image" &&
        infoCreate[key as keyof typeof infoCreate].trim() === ""
      ) {
        toast.error(`Trường ${key} không được để trống!`);
        return;
      }
    }

    // Kiểm tra độ dài mật khẩu (phải từ 6 ký tự trở lên)
    if (infoCreate.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra số điện thoại (phải từ 9 đến 12 số)
    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phoneRegex.test(infoCreate.phone)) {
      toast.error("Số điện thoại phải từ 9 đến 12 chữ số!");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (infoCreate.password !== infoCreate.passwordConfirm) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Nếu tất cả hợp lệ, loại bỏ passwordConfirm và gửi dữ liệu
    const { passwordConfirm, ...infoCreateChoose } = infoCreate;
    toast.success("Đăng ký thành công!");
    props.setOpen(false);
    const url = await upload(file, "user");
    mutation.mutate({ ...infoCreateChoose, image: url }); // Gửi dữ liệu lên server
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Image Blog</label>
            <input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>{" "}
          <div className="item">
            <label>UserName</label>
            <input
              type="text"
              placeholder="Enter user name"
              value={infoCreate.username}
              onChange={(e) => handleChangeInfoCreate(e, "username")}
            />
          </div>{" "}
          <div className="item">
            <label>Email</label>
            <input
              type="email"
              value={infoCreate.email}
              placeholder="Enter Email"
              onChange={(e) => handleChangeInfoCreate(e, "email")}
            />
          </div>{" "}
          <div className="item">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => handleChangeInfoCreate(e, "password")}
            />
          </div>{" "}
          <div className="item">
            <label>Password Confirm</label>
            <input
              type="password"
              placeholder="Enter Password Confirm"
              onChange={(e) => handleChangeInfoCreate(e, "passwordConfirm")}
            />
          </div>
          <div className="item">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Enter phone"
              onChange={(e) => handleChangeInfoCreate(e, "phone")}
            />
          </div>{" "}
          <div className="item">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter address"
              onChange={(e) => handleChangeInfoCreate(e, "address")}
            />
          </div>{" "}
          <div className="item">
            <label>Role</label>
            <select onChange={(e) => handleChangeInfoCreate(e, "role")}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
