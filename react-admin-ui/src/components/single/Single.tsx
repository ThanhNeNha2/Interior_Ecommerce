import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";
import upload from "../../utils/upload";
import toast from "react-hot-toast";

type Props = {
  id: number;
  img?: string;
  title: string;
  info: object;
  chart?: {
    dataKeys: { name: string; color: string }[];
    data: object[];
  };
  activities?: { time: string; text: string }[];
  path: string;
};

const Single = (props: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
    address: "",
    email: "",
    image: "",
    phone: 0,
    role: "",
    username: "",
  }); // Lưu props.info vào state
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["singleUser"],
    // queryFn: () => customFetch(`/user/${id}`),
    queryFn: () =>
      apiCustom.get(`/${props.path}/${id}`).then((res) => res.data), // Dùng axios
  });

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        username: data?.user.username,
        email: data?.user.email,
        role: data?.user.role,
        phone: data?.user.phone,
        image: data?.user.image,
        address: data?.user.address,
      });
    };
    updateInfo();
  }, [data]);

  // Xử lý khi nhấn "Update"
  const handleEdit = () => {
    setIsEditing(true);
  };
  // Xử lý khi thay đổi input
  const handleChange = (key: any, value: any) => {
    setInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (infoUpdate: {}) => {
      return apiCustom.put(`/${props.path}/${id}`, infoUpdate);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries([`singleUser`]);
      toast.success("🎉 User đã được tạo thành công!");
      navigate("/users");
    },
    onError: (error) => {
      // ❌ Thất bại -> Thông báo lỗi
      toast.error("🚨 Lỗi khi tạo user. Vui lòng thử lại!");
    },
  });

  // Xử lý khi nhấn "Save"
  const handleSave = async () => {
    setIsEditing(false);
    const url = await upload(file, "user");
    mutation.mutate({ ...info, image: url });
  };
  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {isEditing ? (
              <>
                {/* Input để thay đổi ảnh */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                {/* Input để thay đổi username */}
                <input
                  type="text"
                  value={info.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Enter username"
                  className="topInfoInput"
                />
                <button onClick={handleSave} className="topInfoSave">
                  Save
                </button>
              </>
            ) : (
              <>
                {/* Hiển thị ảnh nếu có */}
                {info.image && <img src={info.image} alt="Profile" />}
                <h1>{info.username}</h1>
                <button onClick={handleEdit} className="topInfoUpdate">
                  Update
                </button>
              </>
            )}
          </div>

          <div className="details">
            {Object.entries(info)
              .filter(([key]) => key !== "username" && key !== "image") // Bỏ qua 2 trường
              .map(([key, value]) => (
                <div className="item" key={key}>
                  <span className="itemTitle">{key}</span>
                  {isEditing ? (
                    key === "role" ? ( // Nếu là "role" thì hiển thị select
                      <select
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      // Nếu không thì dùng input bình thường
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )
                  ) : (
                    <span className="itemValue">{value}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
        <hr />
        {props.chart && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={props.chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.chart.dataKeys.map((dataKey) => (
                  <Line
                    type="monotone"
                    dataKey={dataKey.name}
                    stroke={dataKey.color}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        {props.activities && (
          <ul>
            {props.activities.map((activity) => (
              <li key={activity.text}>
                <div>
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Single;
