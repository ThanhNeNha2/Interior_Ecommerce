import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import CoverImg from "../../components/Cover/CoverImg";
import Products from "../../components/Products/Products";
import Quality from "../../components/Quality/Quality";
import Footer from "../../components/Footer/Footer";
import { IoList } from "react-icons/io5";
import { TbGridDots } from "react-icons/tb";
import { CgScreenWide } from "react-icons/cg";
import { instance } from "../../Custom/Axios/AxiosCustom";
import { useSearchParams } from "react-router-dom";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const gender = searchParams.get("gender");

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    gender: gender || "",
    minPrice: "",
    maxPrice: "",
    isOnSale: false,
  });

  // State for sorting and pagination
  const [sort, setSort] = useState("Default");
  const [perPage, setPerPage] = useState(32);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category)
        queryParams.append("mainCategory", filters.category);
      if (filters.gender) queryParams.append("gender", filters.gender);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.isOnSale) queryParams.append("isOnSale", true);
      queryParams.append("limit", perPage);

      if (sort !== "Default") {
        if (sort === "Price: Low to High")
          queryParams.append("sortByPrice", "asc");
        if (sort === "Price: High to Low")
          queryParams.append("sortByPrice", "desc");
        if (sort === "Newest") queryParams.append("isNew", "true");
      }

      const res = await instance.get(`/product?${queryParams.toString()}`);

      setProducts((prev) => res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    fetchProducts();
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle per-page change
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
  };

  // Handle "Xem thêm " button
  const handleShowMore = () => {
    setPerPage((prev) => prev + 16);
  };

  // Update filters.gender when searchParams gender changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      gender: gender || "",
    }));
  }, [gender]);

  // Fetch products when filters, sort, or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters.gender, sort, perPage]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <CoverImg namePage={"Sản phẩm"} />
      <div
        className="px-6 sm:px-10 md:px-20 pb-6 mb-10"
        style={{ background: "#F9F1E7" }}
      >
        {/* Top Section */}
        <div className="w-full h-16 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <IoList className="text-xl" />
                <span className="font-poppins font-medium">Bộ lọc</span>
              </button>
              <div className="flex items-center gap-3 text-gray-700">
                <TbGridDots className="text-xl" />
                <CgScreenWide className="text-xl" />
              </div>
            </div>
            <hr className="h-8 border-l border-gray-300 mx-4" />
            <span className="font-poppins text-sm text-gray-600">
              Hiển thị 1–{Math.min(perPage * perPage, products.length)} trên
              tổng số {products.length} sản phẩm
            </span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 px-3 py-1.5 rounded-md font-poppins font-medium text-gray-700 hover:bg-gray-50"
            >
              <option value="Default">Mặc định</option>
              <option value="Price: Low to High">Giá: Thấp đến cao</option>
              <option value="Price: High to Low">Giá: Cao đến thấp</option>
              <option value="Newest">Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          <div className="flex flex-col items-center py-3">
            <span className="font-poppins font-medium text-lg text-gray-800">
              Tìm kiếm phong cách của bạn
            </span>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Tìm theo tên</span>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Tìm sản phẩm..."
                className="border border-gray-300 py-1.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Danh mục</span>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="border border-gray-300 py-1.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <option value="">Tất cả</option>
                <option value="Topwear">Áo</option>
                <option value="Bottomwear">Quần</option>
                <option value="OnePiece">Đồ liền</option>
                <option value="Footwear">Giày dép</option>
                <option value="Accessories">Phụ kiện</option>
                <option value="Underwear">Đồ lót</option>
                <option value="Sportswear">Đồ thể thao</option>
                <option value="Sleepwear">Đồ ngủ</option>
                <option value="Swimwear">Đồ bơi</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Giới tính</span>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="border border-gray-300 py-1.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <option value="">Tất cả</option>
                <option value="Men">Nam</option>
                <option value="Women">Nữ</option>
                <option value="Kids">Trẻ em</option>
                <option value="Unisex">Phi giới tính</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Giá tối thiểu</span>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="border border-gray-300 py-1.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Giá tối đa</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000000"
                className="border border-gray-300 py-1.5 px-3 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={filters.isOnSale}
                  onChange={handleFilterChange}
                />
                <span className="text-sm text-gray-600">Đang giảm giá</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#B88E2F] text-white font-medium rounded-md hover:bg-[#a47926] transition-colors duration-200"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading, Error, and Empty States */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-4">No products found.</div>
      )}

      {/* Product List */}
      <Products listProducts={products} />
      <div className="flex justify-center items-center mt-7">
        <button
          className="py-2 px-5 bg-white border border-colorMain text-colorMain text-base font-medium font-poppins hover:bg-gray-200 rounded"
          onClick={handleShowMore}
        >
          Xem thêm
        </button>
      </div>
      <Quality />
      <Footer />
    </div>
  );
};

export default ListProduct;
