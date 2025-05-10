import axios from "axios";

const deleteImage = async (public_id: string) => {
  try {
    const url = `https://api.cloudinary.com/v1_1/dqgn2mwuw/image/destroy`;

    const formData = new FormData();
    formData.append("public_id", public_id);
    formData.append("invalidate", "true"); // Xóa cache để phản ánh ngay lập tức

    const authToken = btoa("289266436172648:z5c74HQQTuNdBY5gNFoj95MGIVQ"); // Nên để trong .env

    // Gửi yêu cầu POST thay vì DELETE
    const res = await axios.post(url, formData, {
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Delete response:", res.data);
  } catch (err) {
    console.error("❌ Error deleting image:", err);
  }
};

export default deleteImage;
