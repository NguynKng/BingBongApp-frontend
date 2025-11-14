import { Link } from "react-router-dom";
import { Table } from "antd";
import { useState } from "react";
import { ChevronDown, PlusCircle, Search } from "lucide-react";

function CategoryList({ shop }) {
  const [categories, setCategories] = useState(shop.categories || []);
  const [sortOption, setSortOption] = useState("default");
  const [query, setQuery] = useState("");

  // 🧾 Category table configuration
  const CategoryTable = () => {
    const sortedCategories = [...categories];

    // Basic sorting
    switch (sortOption) {
      case "name-asc":
        sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedCategories.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    const config = {
      dataSource: sortedCategories.map((cat, index) => ({
        _id: cat._id,
        no: index + 1,
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
      })),
      columns: [
        {
          title: "No",
          dataIndex: "no",
          key: "no",
          align: "center",
          width: "5rem",
        },
        {
          title: "Category Name",
          dataIndex: "name",
          key: "name",
          align: "center",
        },
        {
          title: "Slug",
          dataIndex: "slug",
          key: "slug",
          align: "center",
        },
        {
          title: "Status",
          dataIndex: "isActive",
          key: "isActive",
          align: "center",
          render: (isActive) =>
            isActive ? (
              <span className="text-green-600 font-medium">Active</span>
            ) : (
              <span className="text-red-500 font-medium">Inactive</span>
            ),
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          render: (_, cat) => (
            <div className="flex justify-center gap-2">
              <Link to={`/shop/${shop.slug}/manage/categories/edit/${cat._id}`}>
                <div className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition">
                  Edit
                </div>
              </Link>
            </div>
          ),
        },
      ],
    };

    return (
      <Table
        {...config}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: "max-content" }}
        className="mt-6 w-full"
        size="middle"
      />
    );
  };

  return (
    <div className="p-4">
      {/* Header and Add button */}
      <div className="flex sm:flex-row flex-col items-center justify-between gap-4">
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="query"
            className="rounded-md border-[1px] border-black px-4 py-2 w-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="size-5 cursor-pointer" />
        </div>
      </div>

      <h1 className="text-4xl font-medium text-center mt-4">
        Shop Categories
      </h1>

      {/* Sort */}
      <div className="flex justify-end mt-4">
        <div className="relative w-52 border-2 border-gray-200 rounded-md">
          <select
            className="w-full px-4 py-2 appearance-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort by...</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Category table */}
      <div className="flex justify-center w-full">
        <CategoryTable />
      </div>
    </div>
  );
}

export default CategoryList;
