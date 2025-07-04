import React, { useEffect, useState } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import SlideImgSingleProduct from "../SingleProduct_IMG/SlideImgSingleProduct";
import DescriptionAndReviews from "../DescriptionAndReviews/DescriptionAndReviews";
import { useParams } from "react-router-dom";
import {
  addProductToCart,
  addProductToWishlist,
  getAllReview,
  getProductById,
} from "../../services/api";
import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";

import {
  mainCategoryTranslate,
  subCategoryTranslate,
} from "../../constants/categoryTranslate";

const DetailProduct = () => {
  const { id } = useParams();
  const [singleItem, setSingleItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const queryClient = useQueryClient();
  const [SizeId, setSizeId] = useState("");

  const [valueAddCart, setValueAddCart] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    const response = await getAllReview(id);
    if (response.status === 200) {
      setReviews(response.data.reviews);
    }
  };

  const addWishlistMutation = useMutation({
    mutationFn: ({ user_id, product_id }) =>
      addProductToWishlist(user_id, product_id),
    onSuccess: (res, variables) => {
      const { user_id } = variables;
      if (res.status === 201) {
        notification.success({
          message: "Thêm sản phẩm vào danh sách yêu thích thành công",
        });
        queryClient.invalidateQueries(["wishlist", user_id]);
      } else if (res.status === 409) {
        notification.success({
          message: "Sản phẩm đã có trong danh sách yêu thích",
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: "Thêm vào danh sách yêu thích thất bại",
        description: error.response?.data?.message || "Đã xảy ra lỗi.",
      });
    },
  });

  // Kiểm tra và tính toán điểm đánh giá trung bình chỉ khi có đánh giá
  let averageRating = 0;
  let fullStars = 0;
  let hasHalfStar = false;
  let emptyStars = 5;

  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = totalRating / reviews.length;
    fullStars = Math.floor(averageRating);
    hasHalfStar = averageRating - fullStars >= 0.5;
    emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  }

  const fetchSingleProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setSingleItem(res.data.product || null);
      localStorage.setItem(
        "mainCategory",
        JSON.stringify(res.data.product.mainCategory)
      );

      if (res.data.product?.sizes?.length > 0) {
        setSizeId(res.data.product?.sizes?.[0]?.size_id._id);
        const sizeData = res.data.product.sizes.map((size) => {
          return {
            name: size.size_id?.name || "N/A",
            stock: size.stock,
          };
        });
        setSelectedSize(sizeData[0]?.name || "");
      }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
    fetchReviews();
  }, [id]);

  if (loading) return <div className="px-[130px] py-5">Đang tải...</div>;
  if (error) return <div className="px-[130px] py-5 text-red-500">{error}</div>;
  if (!singleItem)
    return <div className="px-[130px] py-5">Không tìm thấy sản phẩm</div>;

  const sizeData =
    singleItem.sizes?.map((size) => {
      return {
        id: size.size_id?._id || "N/A",
        name: size.size_id?.name || "N/A",
        stock: size.stock,
      };
    }) || [];
  const selectedStock =
    sizeData.find((size) => size.name === selectedSize)?.stock || 0;

  const handleAddCart = async (user_id, product_id) => {
    try {
      const res = await addProductToCart(user_id, product_id, SizeId);
      if (res.status === 201) {
        notification.success({
          message: "Thêm sản phẩm vào giỏ hàng thành công",
        });
      }
    } catch (error) {
      console.log("Error adding product to cart:", error);
    }
  };

  const handleAddWishlist = (user_id, product_id) => {
    addWishlistMutation.mutate({ user_id, product_id });
  };
  return (
    <div className="">
      <div className="flex mt-[30px] px-[130px] flex-wrap gap-5">
        <div className="flex gap-3 h-[500px] w-[48%] min-w-[300px]">
          <div className="flex flex-col gap-3 w-[20%] h-full">
            {singleItem.image_url?.length > 1 &&
              singleItem.image_url
                .filter((_, index) => index !== 0)
                .map((item, index) => (
                  <div key={index} className="w-full h-[100px] rounded">
                    <img
                      src={item}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    />
                  </div>
                ))}
          </div>
          <div hidden>
            <SlideImgSingleProduct
              images={singleItem.image_url || []}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </div>
          <div className="flex-1 rounded">
            {singleItem.image_url?.[0] ? (
              <img
                src={singleItem.image_url[0]}
                alt={singleItem?.nameProduct || "Product image"}
                className="w-[90%] h-full object-cover rounded cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
            ) : (
              <div className="w-[90%] h-full bg-gray-200 flex items-center justify-center rounded">
                No Image Available
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 min-w-[300px]">
          <span className="font-poppins text-[28px] font-medium">
            {singleItem?.nameProduct || "Tên sản phẩm"}
          </span>
          <p className="font-poppins text-[18px]">
            <span className="text-red-500 font-semibold mr-2">
              ${singleItem.salePrice || "N/A"}
            </span>
            <del className="text-gray-400">
              ${singleItem.originalPrice || "N/A"}
            </del>
          </p>
          <div className="flex items-center gap-4">
            {reviews.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(fullStars)].map((_, i) => (
                    <IoStar key={`full-${i}`} />
                  ))}
                  {hasHalfStar && <IoStarHalf />}
                  {[...Array(emptyStars)].map((_, i) => (
                    <IoStarOutline key={`empty-${i}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({averageRating.toFixed(1)} / 5)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <IoStarOutline key={`empty-${i}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(0 / 5)</span>
              </div>
            )}
            <div className="border border-gray-300 h-[20px]"></div>
            <span className="text-[14px] text-gray-400">
              {reviews.length} Đánh giá của khách hàng
            </span>
          </div>
          <span>{singleItem.descriptionShort || "Không có mô tả"}</span>
          <ul className="flex flex-col justify-center gap-3">
            <li className="flex">
              <span className="w-[15%]">Giới tính </span>
              <p>
                :{" "}
                {singleItem.gender === "Men"
                  ? "Nam"
                  : singleItem.gender === "Women"
                  ? "Nữ"
                  : singleItem.gender === "Unisex"
                  ? "Cả nam và nữ"
                  : singleItem.gender === "Kids"
                  ? "Trẻ em"
                  : "N/A"}
              </p>
            </li>
            <li className="flex">
              <span className="w-[15%]">Loại </span>
              <p className="ml-2">
                : {mainCategoryTranslate[singleItem.mainCategory] || "N/A"}
              </p>
            </li>
            <li className="flex">
              <span className="w-[15%]">Thẻ sản phẩm</span>
              <p className="ml-2">
                :{" "}
                {singleItem.subCategory
                  ?.map((item) => subCategoryTranslate[item] || item)
                  .join(", ") || "N/A"}
              </p>
            </li>
            <li className="flex">
              <span className="w-[15%]">Số lượng</span>
              <p className="ml-2">
                : {selectedStock} (Size {selectedSize})
              </p>
            </li>
          </ul>
          <div className="flex flex-col gap-2">
            <span className="text-[15px] text-gray-400">Size</span>
            <div className="flex gap-3">
              {sizeData.length > 0 ? (
                sizeData.map((size) => (
                  <button
                    key={size.name}
                    className={`w-[30px] h-[30px] text-[14px] rounded transition-all ${
                      selectedSize === size.name
                        ? "bg-colorMain text-white"
                        : "text-black"
                    }`}
                    style={{
                      background: selectedSize === size.name ? "" : "#F9F1E7",
                    }}
                    onClick={() => {
                      setSelectedSize(size.name), setSizeId(size.id);
                    }}
                    aria-label={`Select size ${size.name}`}
                  >
                    {typeof size.name === "string" ? size.name : "N/A"}
                  </button>
                ))
              ) : (
                <span className="text-gray-400">Không có kích thước</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <button
                className={`border border-gray-400 px-3 py-[2px] rounded-l ${
                  valueAddCart === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={valueAddCart === 1}
                onClick={() => setValueAddCart(valueAddCart - 1)}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="border border-gray-400 px-3 py-[2px]">
                {valueAddCart}
              </span>
              <button
                className={`border border-gray-400 px-3 py-[2px] rounded-r ${
                  valueAddCart >= selectedStock
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={valueAddCart >= selectedStock}
                onClick={() => setValueAddCart(valueAddCart + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className={`px-3 py-[5px] text-black rounded text-[14px] hover:opacity-80 ${
                selectedStock < 0 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{ background: "#FFCC99" }}
              onClick={() => {
                handleAddCart(user._id, singleItem._id);
              }}
              aria-label="Add to cart"
              disabled={selectedStock < 0 ? true : false}
            >
              Add To Cart
            </button>
            <button
              className="px-3 py-[5px] text-black rounded text-[14px] hover:opacity-80"
              style={{ background: "#FFCC99" }}
              onClick={() => handleAddWishlist(user._id, singleItem._id)}
              aria-label="Compare product"
            >
              Add Favourite
            </button>
          </div>
        </div>
      </div>
      <hr className="my-7" />
      <DescriptionAndReviews
        description={singleItem?.description}
        quantityReview={reviews.length}
      />
    </div>
  );
};

export default DetailProduct;
