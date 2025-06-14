import React from "react";
import { Link } from "react-router-dom";

const ItemType = ({ img1, img2, img3, img4 }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-4 sm:px-6 lg:px-8 gap-12 2xl:gap-8 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-2xl">
        <h2 className="font-poppins font-bold text-4xl sm:text-5xl 2xl:text-4xl text-gray-900">
          Trang phục theo đối tượng
        </h2>
        <p className="font-poppins font-normal text-lg sm:text-xl 2xl:text-lg mt-3 text-gray-600">
          Khám phá bộ sưu tập quần áo cao cấp được tuyển chọn của chúng tôi dành
          cho mọi lứa tuổi.
        </p>
      </div>

      {/* Image Grid Section */}
      <div className="flex flex-col justify-center sm:flex-row gap-6 lg:gap-8 w-full max-w-7xl">
        {/* Men's Clothes */}
        <Link to="/ListProduct?gender=Men">
          <div className="flex flex-col items-center gap-6 2xl:gap-5 group">
            <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 h-[500px] w-[300px]">
              <img
                src={img2}
                alt="Men's clothing"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-poppins font-semibold text-xl sm:text-2xl 2xl:text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Quần áo nam
            </span>
          </div>
        </Link>
        {/* Women's Clothes */}
        <Link to="/ListProduct?gender=Women">
          <div className="flex flex-col items-center gap-6 2xl:gap-5 group">
            <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 h-[500px] w-[300px]">
              <img
                src={img1}
                alt="Women's clothing"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-poppins font-semibold text-xl sm:text-2xl 2xl:text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Quần áo nữ
            </span>
          </div>
        </Link>
        {/* Children's Clothes */}
        <Link to="/ListProduct?gender=Kids">
          <div className="flex flex-col items-center gap-6 2xl:gap-5 group">
            <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 h-[500px] w-[300px]">
              <img
                src={img3}
                alt="Children's clothing"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-poppins font-semibold text-xl sm:text-2xl 2xl:text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Quần áo trẻ em
            </span>
          </div>
        </Link>
        {/* Unisex's Clothes */}
        <Link to="/ListProduct?gender=Unisex">
          <div className="flex flex-col items-center gap-6 2xl:gap-5 group">
            <div className="overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 h-[500px] w-[300px]">
              <img
                src={img4}
                alt="Unisex's clothing"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-poppins font-semibold text-xl sm:text-2xl 2xl:text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Quần áo Unisex
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ItemType;
