import USER from "../models/User.model";
import * as bcrypt from "bcrypt";

//  CREATE USER
export const createUser = async (req, res) => {
  try {
    const { password } = req.body;
    console.log("check dau vao cua email ", req.body.email);
    const checkEmail = await USER.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.status(500).json({
        message: "Email đã tồn tại ",
        idCode: 1,
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await USER.create({ ...req.body, password: hashPassword });
    return res.status(200).json({
      message: "OK",
      idCode: 0,
      user,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Tạo tài khoản không thành công ",
      idCode: 1,
    });
  }
};

// GET ALL USER
export const getUser = async (req, res) => {
  try {
    const getAllUser = await USER.find({}).select("-password");
    return res.status(200).json({
      message: "OK",
      idCode: 0,
      getAllUser,
    });
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({
      message: "Truy cap danh sach nguoi dung khong thanh cong",
      idCode: 1,
    });
  }
};

//  UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const checkExitId = await USER.findOne({ _id: req.params.id });
    if (!checkExitId) {
      return res.status(200).json({
        message: "User khong ton tai ",
        idCode: 1,
      });
    }
    const updateUser = await USER.findByIdAndUpdate(req.params.id, req.body);

    return res.status(200).json({
      message: "OK",
      idCode: 0,
      updateUser,
    });
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({
      message: "Update tài khoản không thành công ",
      idCode: 1,
    });
  }
};

//  DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const checkExitId = await USER.findOne({ _id: req.params.id });
    if (!checkExitId) {
      return res.status(200).json({
        message: "User khong ton tai ",
        idCode: 1,
      });
    }
    await USER.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "OK",
      idCode: 0,
    });
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({
      message: "Delete tài khoản không thành công ",
      idCode: 1,
    });
  }
};
