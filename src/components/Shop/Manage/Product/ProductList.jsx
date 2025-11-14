import { ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import Config from "../../../../envVars";
import toast from "react-hot-toast";
import { productAPI } from "../../../../services/api";
import SpinnerLoading from "../../../SpinnerLoading";

function ProductList({ shop }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shop || !shop._id) return;
      setLoading(true);
      try {
        const response = await productAPI.getProductsByShop(shop._id);
        setProducts(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load product list");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [shop]);

  // Status counts
  const statusCounts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        acc.active += product.status === "active" ? 1 : 0;
        acc.inactive += product.status === "inactive" ? 1 : 0;
        acc.deleted += product.status === "deleted" ? 1 : 0;
        return acc;
      },
      { active: 0, inactive: 0, deleted: 0 }
    );
  }, [products]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesQuery = query
        ? product.name.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesCategory =
        !selectedCategory || selectedCategory === "default"
          ? true
          : product.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "discounted":
        filtered = filtered.filter((p) => p.discount > 0);
        break;
      case "inactive":
        filtered = filtered.filter((p) => p.status === "inactive");
        break;
      case "deleted":
        filtered = filtered.filter((p) => p.status === "deleted");
        break;
      default:
        break;
    }

    return filtered;
  }, [products, query, selectedCategory, sortOption]);

  // 🧾 Product table
  const ProductTable = () => {
    const config = {
      dataSource: filteredProducts.map((product, index) => ({
        key: product._id,
        no: index + 1,
        name: product.name,
        id: product._id,
        images: product.images,
        price: product.basePrice,
        status: product.status,
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
          title: "Image",
          dataIndex: "images",
          key: "images",
          render: (images) => {
            const thumbnail = images?.[0];
            return (
              <div className="flex justify-center">
                <img
                  src={`${Config.BACKEND_URL}${thumbnail}`}
                  alt="Product"
                  className="size-12 object-cover rounded-md"
                />
              </div>
            );
          },
          align: "center",
          width: "6rem",
        },
        {
          title: "Product Name",
          dataIndex: "name",
          key: "name",
          align: "center",
          width: "14rem",
        },
        {
          title: "Price ($)",
          dataIndex: "price",
          key: "price",
          align: "center",
          width: "8rem",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          align: "center",
          render: (status) => {
            switch (status) {
              case "active":
                return <span className="text-green-500 font-medium">Available</span>;
              case "inactive":
                return <span className="text-yellow-500 font-medium">Inactive</span>;
              case "deleted":
                return <span className="text-red-500 font-medium">Deleted</span>;
              default:
                return <span className="text-gray-500 font-medium">Unknown</span>;
            }
          },
        },
        {
          title: "Action",
          dataIndex: "id",
          key: "action",
          render: (id) => (
            <div className="flex justify-center gap-2">
              <Link to={`/shop/${shop.slug}/manage/products/edit/${id}`}>
                <div className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 transition">
                  Edit
                </div>
              </Link>
            </div>
          ),
          align: "center",
          width: "10rem",
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
        loading={loading}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total products */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100">
          <span className="text-2xl font-bold">{products.length}</span>
          <span className="text-sm text-gray-700">Total</span>
        </div>

        {[
          {
            label: "Active",
            value: statusCounts.active,
            bg: "bg-yellow-100",
            text: "text-yellow-800",
          },
          {
            label: "Inactive",
            value: statusCounts.inactive,
            bg: "bg-blue-100",
            text: "text-blue-800",
          },
          {
            label: "Deleted",
            value: statusCounts.deleted,
            bg: "bg-purple-100",
            text: "text-purple-800",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${item.bg}`}
          >
            <span className={`text-2xl font-bold ${item.text}`}>
              {item.value}
            </span>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex sm:flex-row flex-col items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/shop/${shop.slug}/manage/products/add`}
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center hover:bg-blue-800 transition"
          >
            Add
          </Link>
          <Link
            to={`/shop/${shop.slug}/manage/products`}
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
        Product List
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category filter */}
          <div className="relative w-40 border-2 border-gray-200 rounded-md">
            <select
              className="size-full px-4 py-2 appearance-none"
              name="productCategory"
              id="productCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="default">All</option>
              {shop.categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          {/* Sort filter */}
          <div className="relative w-52 border-2 border-gray-200 rounded-md">
            <select
              className="size-full px-4 py-2 appearance-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort by...</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="discounted">Discounted</option>
              <option value="inactive">Inactive</option>
              <option value="deleted">Deleted</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-medium">{`Total (${filteredProducts.length})`}</h2>
      </div>

      {/* Product table */}
      <div className="flex justify-center w-full">
        <ProductTable />
      </div>
    </div>
  );
}

export default ProductList;
