import React, { useEffect, useState } from "react";
import { IoHeartOutline, IoShareSocial } from "react-icons/io5";
import { RiArrowLeftRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { addProductToCart, addProductToWishlist } from "../../services/api";
import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { subCategoryTranslate } from "../../constants/categoryTranslate";

const Products = ({ listProducts }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const queryClient = useQueryClient();
  const addWishlistMutation = useMutation({
    mutationFn: ({ user_id, product_id }) =>
      addProductToWishlist(user_id, product_id),

    onSuccess: (res, variables) => {
      if (res.status === 201) {
        notification.success({
          message: "Thêm sản phẩm vào danh sách yêu thích thành công",
        });
        queryClient.invalidateQueries(["wishlist", variables.user_id]);
      } else if (res.status === 409) {
        notification.success({
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }
    },

    onError: (error) => {
      notification.error({
        message: "Lỗi khi thêm vào danh sách yêu thích",
        description: error?.response?.data?.message || "Đã xảy ra lỗi.",
      });
    },
  });

  const handleAddWishlist = (user_id, product_id) => {
    addWishlistMutation.mutate({ user_id, product_id });
  };

  const handleAddCart = async (user_id, product_id, size_id) => {
    try {
      const res = await addProductToCart(user_id, product_id, size_id);
      if (res.status === 201) {
        notification.success({
          message: "Thêm sản phẩm vào giỏ hàng thành công",
        });
      }
    } catch (error) {
      console.log("Error adding product to cart:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center px-6 sm:px-10 md:px-20 gap-6 py-8 bg-gray-50">
      {listProducts.map((product, i) => (
        <div
          key={i}
          className="group relative w-full sm:w-[calc(25%-18px)] md:w-[calc(25%-24px)] h-auto rounded-lg shadow-md overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
          aria-label={`Sản phẩm: ${product.nameProduct}`}
        >
          <div className="h-[70%] relative">
            {product.image_url?.[0] ? (
              <img
                src={product.image_url[0]}
                alt={product.nameProduct}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                Không có hình ảnh
              </div>
            )}
            <div
              className={`absolute top-4 right-4 w-10 h-10 ${
                product.salePercentage && product.salePercentage !== "New"
                  ? "bg-red-500"
                  : "bg-green-500"
              } rounded-full flex justify-center items-center text-white text-xs font-medium`}
            >
              {product.salePercentage && product.salePercentage !== "New"
                ? `${product.salePercentage}%`
                : "New"}
            </div>
          </div>
          <div className="flex flex-col p-3 h-[30%] justify-between">
            <div>
              <span className="font-poppins text-base font-semibold text-gray-900 line-clamp-2">
                {product.nameProduct}
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.subCategory.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-sm mr-1"
                  >
                    {subCategoryTranslate[item] || item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start justify-between mt-2">
              {/* Giá */}
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-lg text-red-600">
                  {product.salePrice?.toLocaleString("vi-VN") || "N/A"} VNĐ
                </span>
                <del className="text-sm text-gray-400">
                  {product.originalPrice?.toLocaleString("vi-VN") || "N/A"} VNĐ
                </del>
              </div>

              {/* Giới tính */}
              <span className="mt-1 text-sm text-gray-700 font-medium">
                Dành cho:{" "}
                {product.gender === "Men"
                  ? "Nam"
                  : product.gender === "Women"
                  ? "Nữ"
                  : product.gender === "Unisex"
                  ? "Nam, Nữ"
                  : product.gender === "Kids"
                  ? "Trẻ em"
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-center items-center gap-6 opacity-0 group-hover:!opacity-100 transition-opacity duration-300 z-[5]">
            <div className="flex gap-3">
              <button
                className="bg-white py-2 px-4  text-sm font-poppins font-medium rounded-lg hover:bg-gray-200 text-yellow-600"
                aria-label="Thêm vào giỏ hàng"
                onClick={() => {
                  let selectedSizeId = "";

                  if (product.sizes[0].stock > 0) {
                    selectedSizeId = product.sizes[0].size_id._id;
                  } else if (product.sizes[1] && product.sizes[1].stock > 0) {
                    selectedSizeId = product.sizes[1].size_id._id;
                  }

                  if (selectedSizeId) {
                    handleAddCart(user._id, product.id, selectedSizeId);
                  } else {
                    notification.warning(
                      "Sản phẩm này đã hết hàng ở tất cả các size !"
                    );
                  }
                }}
              >
                Thêm giỏ hàng
              </button>
              <Link to={`/SingleProduct/${product.id}`}>
                <button
                  className="bg-white py-2 px-4 font-poppins   text-sm font-medium rounded-lg hover:bg-gray-200 text-yellow-600"
                  aria-label={`Xem chi tiết ${product.nameProduct}`}
                >
                  Xem chi tiết
                </button>
              </Link>
            </div>
            <div className="flex gap-6 text-white">
              <div
                className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"
                aria-label="Chia sẻ sản phẩm"
                onClick={() => console.log(`Chia sẻ ${product.nameProduct}`)}
              >
                <IoShareSocial />
                <span className="font-poppins font-medium text-sm">Share</span>
              </div>
              <div
                className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"
                aria-label="So sánh sản phẩm"
                onClick={() => console.log(`So sánh ${product.nameProduct}`)}
              >
                <RiArrowLeftRightLine />
                <span className="font-poppins font-medium text-sm">
                  Compare
                </span>
              </div>
              <div
                className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"
                aria-label="Yêu thích sản phẩm"
                onClick={() => {
                  handleAddWishlist(user._id, product.id);
                }}
              >
                <IoHeartOutline />
                <span className="font-poppins font-medium text-sm">Love</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
