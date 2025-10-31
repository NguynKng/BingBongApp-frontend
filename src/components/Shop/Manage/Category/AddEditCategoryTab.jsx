import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { shopAPI } from "../../../../services/api";

function AddEditCategoryTab({ shop }) {
  const { id } = useParams(); // id của category (nếu có)
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    _id: "",
    name: "",
    isActive: true,
  });

  // Nếu có id → tìm category để edit
  useEffect(() => {
    if (shop?.categories) {
      if (id) {
        const existing = shop.categories.find((cat) => cat._id === id);
        if (existing) {
          setCategory({
            _id: existing._id,
            name: existing.name,
            isActive: existing.isActive,
          });
        }
      } else {
        setCategory({
          _id: "",
          name: "",
          isActive: true,
        });
      }
    }
  }, [id, shop]);

  // Tạo slug tự động khi gõ tên
  const handleNameChange = (e) => {
    const name = e.target.value;
    setCategory((prev) => ({ ...prev, name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      if (id) {
        const updatedCategory = {
          _id: category._id,
          name: category.name,
          isActive: category.isActive,
        };
        const response = await shopAPI.updateShopCategory(
          shop._id,
          updatedCategory
        );
        if (response.success) {
          toast.success("Cập nhật danh mục thành công");
          navigate(`/shop/${shop.slug}/manage/categories`);
        }
      } else {
        const newCategory = {
          _id: "",
          name: category.name,
          isActive: category.isActive,
        };

        const response = await shopAPI.addShopCategory(shop._id, newCategory);

        if (response.success) {
          toast.success("Thêm danh mục thành công");
          navigate(`/shop/${shop.slug}/manage/categories`);
        }
      }
    } catch (error) {
      toast.error("Cập nhật danh mục thất bại");
      return;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center sm:flex-row flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/shop/${shop.slug}/manage/categories/add`}
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center hover:bg-blue-800 transition"
          >
            Thêm
          </Link>
          <Link
            to={`/shop/${shop.slug}/manage/categories`}
            className="px-4 py-2 rounded-md bg-gray-700 text-white text-center hover:bg-gray-600 transition"
          >
            Quản lý
          </Link>
        </div>
      </div>
      <h1 className="text-4xl font-medium text-center my-2">
        {id ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tên danh mục */}
        <div>
          <label className="block font-medium mb-1">Tên danh mục</label>
          <input
            type="text"
            value={category.name}
            onChange={handleNameChange}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên danh mục..."
          />
        </div>

        {/* Trạng thái */}
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={category.isActive}
            onChange={(e) =>
              setCategory((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            className="size-4"
          />
          <label htmlFor="isActive">Hoạt động</label>
        </div>

        {/* Nút */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
          >
            {id ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditCategoryTab;
