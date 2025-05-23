import React from "react";

const Footer = () => {
  return (
    <div className=" border-t border-gray-200">
      <div className="py-10 mx-[150px] flex gap-20 border-b border-gray-200 ">
        <div className="flex flex-col gap-10">
          <h1 className="font-poppins font-bold text-[20px]">TRENDORY.</h1>
          <span className="text-[16px]  text-gray-400">
            400 University Drive Suite 200 Coral Gables, FL 33134 USA
          </span>
        </div>
        <div>
          <ul className="flex flex-col gap-10">
            <li className="font-poppins font-medium text-[16px] text-gray-400">
              Links
            </li>
            <li className="font-poppins font-medium text-[16px]">Home</li>
            <li className="font-poppins font-medium text-[16px]">Shop</li>
            <li className="font-poppins font-medium text-[16px]">About</li>
            <li className="font-poppins font-medium text-[16px]">Contact</li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-10">
            <li className="font-poppins font-medium text-[16px] text-gray-400">
              Help
            </li>
            <li className="font-poppins font-medium text-[16px]">
              Payment Options
            </li>
            <li className="font-poppins font-medium text-[16px]">Returns</li>
            <li className="font-poppins font-medium text-[16px]">
              Privacy Policies
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-10">
          <span className="font-poppins font-medium text-[16px] text-gray-400">
            Newsletter
          </span>
          <div className="flex  ">
            <input type="text" className="py-1 px-2 ring-1 ring-gray-300  " />
            <button className="py-1 px-2 text-sm font-medium bg-gray-300 ring-1 ring-gray-300">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
      <div className="mx-[150px] py-5">
        <span className="text-[16px]   ">
          2025 trendory. All rights reverved
        </span>
      </div>
    </div>
  );
};

export default Footer;
