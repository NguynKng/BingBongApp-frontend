import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { shopAPI } from "../../../../services/api";

function AddEditCategoryTab({ shop }) {
  const { id } = useParams(); // category id (if editing)
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    _id: "",
    name: "",
    isActive: true,
  });

  // If there is an id → find category to edit
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

  // Handle name change
  const handleNameChange = (e) => {
    const name = e.target.value;
    setCategory((prev) => ({ ...prev, name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      toast.error("Please enter a category name");
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
          toast.success("Category updated successfully");
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
          toast.success("Category added successfully");
          navigate(`/shop/${shop.slug}/manage/categories`);
        }
      }
    } catch (error) {
      toast.error("Failed to update category");
      return;
    }
  };

  return (
    <div className="p-4">
      {/* Header with Add/Manage buttons */}
      <div className="flex items-center sm:flex-row flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/shop/${shop.slug}/manage/categories/add`}
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center hover:bg-blue-800 transition"
          >
            Add
          </Link>
          <Link
            to={`/shop/${shop.slug}/manage/categories`}
            className="px-4 py-2 rounded-md bg-gray-700 text-white text-center hover:bg-gray-600 transition"
          >
            Manage
          </Link>
        </div>
      </div>

      <h1 className="text-4xl font-medium text-center my-2">
        {id ? "Edit Category" : "Add Category"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Category Name */}
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            value={category.name}
            onChange={handleNameChange}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name..."
          />
        </div>

        {/* Status */}
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
          <label htmlFor="isActive">Active</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
          >
            {id ? "Update" : "Add New"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditCategoryTab;
