import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Upload,
  X,
} from "lucide-react";
import Config from "../../../../envVars";
import { productAPI } from "../../../../services/api";

function AddEditProductTab({ shop }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([
    { name: "", price: 0, stock: 0, image: null },
  ]);
  const [openTab, setOpenTab] = useState({ General: true });
  const imageSliderRef = useRef(null);
  const [mainProductImages, setMainProductImages] = useState([]);
  const [deletedImagePaths, setDeletedImagePaths] = useState([]);
  const [generalForm, setGeneralForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: 0,
    discount: 0,
    description: "",
    status: "active",
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Tạo danh sách ảnh mới có preview
    const newImages = selectedFiles.map((file) => ({
      file, // ảnh thực tế
      path: URL.createObjectURL(file), // đường dẫn preview
      fromFile: true, // ảnh từ local, chưa upload
    }));

    // Cập nhật state
    setMainProductImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = async (index) => {
    // Get the image being removed
    setMainProductImages((prevImages) => {
      const removed = prevImages[index];

      // ✅ Nếu ảnh là từ DB thì thêm vào deleted list (chỉ làm 1 lần)
      if (removed && !removed.fromFile && removed.path) {
        setDeletedImagePaths((prev) => {
          if (!prev.includes(removed.path)) {
            return [...prev, removed.path];
          }
          return prev; // tránh thêm trùng
        });
      }

      // ✅ Xóa khỏi danh sách hiển thị
      return prevImages.filter((_, i) => i !== index);
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", price: 0, stock: 0, image: null },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Xóa ảnh biến thể
  const handleRemoveVariantImage = (index) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      const variant = updatedVariants[index];

      if (!variant) return prevVariants;

      const removedImage = variant.image;

      // ✅ Nếu ảnh từ DB (có path và không phải từ file upload)
      if (removedImage && removedImage.path && !removedImage.fromFile) {
        setDeletedImagePaths((prev) => {
          if (!prev.includes(removedImage.path)) {
            return [...prev, removedImage.path];
          }
          return prev; // tránh thêm trùng
        });
      }

      // ✅ Xoá ảnh khỏi variant
      updatedVariants[index] = { ...variant, image: null };

      return updatedVariants;
    });
  };

  // 🧩 VARIANT IMAGE
  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newPreview = URL.createObjectURL(file);

    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              image: { file, path: newPreview, fromFile: true },
            }
          : variant
      )
    );
  };

  const scrollLeft = () => {
    if (imageSliderRef.current) {
      // Get the width of the first image container
      const childWidth =
        imageSliderRef.current.firstElementChild?.offsetWidth || 0;
      imageSliderRef.current.scrollBy({
        left: -childWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (imageSliderRef.current) {
      // Get the width of the first image container
      const childWidth =
        imageSliderRef.current.firstElementChild?.offsetWidth || 0;
      imageSliderRef.current.scrollBy({
        left: childWidth,
        behavior: "smooth",
      });
    }
  };

  const handleChangeGeneralForm = (e) => {
    if (e.target.name === "description" && e.target.value.length > 500) {
      return;
    }
    setGeneralForm({ ...generalForm, [e.target.name]: e.target.value });
  };

  const toggleTab = (tabName) => {
    setOpenTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName], // Toggle only the clicked dropdown
    }));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        const response = await productAPI.getProductById(id);
        const productData = response.data;
        if (productData) {
          setGeneralForm({
            name: productData.name,
            description: productData.description,
            price: productData.basePrice,
            discount: productData.discount,
            category: productData.category,
            brand: productData.brand,
            status: productData.status,
          });
          const loadedImages = productData.images.map((img) => ({
            path: img,
            fromFile: false,
          }));
          setMainProductImages(loadedImages);

          const loadedVariants = productData.variants.map((variant) => ({
            ...variant,
            image: variant.image
              ? { path: variant.image, fromFile: false }
              : null,
          }));
          setVariants(loadedVariants);
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };
    fetchProductData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", generalForm.name);
    formData.append("description", generalForm.description);
    formData.append("basePrice", generalForm.price);
    formData.append("discount", generalForm.discount);
    formData.append("category", generalForm.category);
    formData.append("brand", generalForm.brand);
    formData.append("shop", shop._id);
    formData.append("status", generalForm.status);

    if (
      !generalForm.name ||
      !generalForm.category ||
      !generalForm.price ||
      !generalForm.description ||
      variants.length === 0
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    if (mainProductImages.length === 0) {
      toast.error("Hãy thêm ít nhất 1 ảnh cho sản phẩm");
      return;
    }

    // Ảnh chính
    mainProductImages.forEach((img) => {
      if (img.fromFile && img.file) {
        formData.append("mainImages", img.file);
      }
    });

    // Ảnh variant
    let imageIndex = 0;

    variants.forEach((variant) => {
      if (variant.image && variant.image.fromFile && variant.image.file) {
        formData.append("variantImages", variant.image.file);
        variant.imageIndex = imageIndex; // chỉ số ảnh mới upload
        imageIndex++;
      } else {
        variant.imageIndex = null; // không có ảnh mới
      }
    });

    formData.append("variants", JSON.stringify(variants));

    if (id) {
      formData.append("deletedImagePath", JSON.stringify(deletedImagePaths));
    }
    setLoading(true);
    try {
      let response;
      if (!id) {
        response = await productAPI.addProduct(formData);
      } else {
        response = await productAPI.updateProductById(id, formData);
      }

      if (response.success == true) {
        toast.success(response.message);
        navigate(`/shop/${shop.slug}/manage/products`);
      }
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center sm:flex-row flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/shop/${shop.slug}/manage/products/add`}
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center"
          >
            Add Product
          </Link>
          <Link
            to={`/shop/${shop.slug}/manage/products`}
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center"
          >
            Manage Product
          </Link>
        </div>
      </div>
      <form encType="multipart/form-data" id={id} onSubmit={handleSubmit}>
        <h1 className="text-4xl font-medium text-center mt-2">
          {id ? "Edit Product" : "Add Product"}
        </h1>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="mr-2 my-2 p-4 px-4 py-2 text-white cursor-pointer bg-blue-950 rounded-md w-36"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
        <div className="flex flex-col gap-6 p-2">
          <div className="rounded-md border-2 border-gray-200 w-full h-fit">
            <h1 className="p-4 font-medium text-lg text-green-800">
              Product Image
            </h1>
            <div className="p-4 border-t-2 border-gray-200">
              <div className="flex flex-col gap-2">
                <h1>Tag</h1>
                <div className="flex flex-wrap items-center gap-2 p-1 border-2 border-gray-200 rounded-md">
                  <div className="rounded-md flex items-center gap-2 p-2 border-2 border-gray-200 bg-gray-200">
                    <span>Mobile</span>
                    <X className="text-gray-400 size-4" />
                  </div>
                  <div className="rounded-md flex items-center gap-2 p-2 border-2 border-gray-200  bg-gray-200">
                    <span>Xiaomi</span>
                    <X className="text-gray-400 size-4" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2 w-full">
                {/* Preview Image */}
                <div className="flex justify-between">
                  <h1>Product Image ({mainProductImages.length})</h1>
                  {mainProductImages.length > 0 && (
                    <div className="flex">
                      <ChevronLeft
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => scrollLeft(imageSliderRef)}
                      />
                      <ChevronRight
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => scrollRight(imageSliderRef)}
                      />
                    </div>
                  )}
                </div>
                {mainProductImages.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No images selected yet.
                  </p>
                ) : (
                  <div
                    className="flex overflow-x-scroll custom-scroll items-center rounded-md gap-2"
                    ref={imageSliderRef}
                  >
                    {mainProductImages.length == 0 ? (
                      <p className="text-center text-gray-500">
                        No images selected yet.
                      </p>
                    ) : (
                      mainProductImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative max-w-72 flex-none rounded-md border-2 border-gray-200 group cursor-pointer"
                        >
                          <img
                            src={
                              src.fromFile
                                ? src.path
                                : `${Config.BACKEND_URL}${src.path}`
                            }
                            alt={`Preview ${index}`}
                            className="size-full object-cover rounded-md"
                          />
                          {index == 0 && (
                            <Star className="fill-red-400 text-red-400 absolute top-2 left-2 size-4" />
                          )}
                          {/* Overlay with buttons (visible only on hover) */}
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                            <div
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                              onClick={() => handleRemoveImage(index)}
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* File Upload Button */}
                <div className="relative cursor-pointer w-52 p-4 border-2 border-gray-300 rounded-md bg-white hover:bg-gray-200 text-md text-green-800 mt-2">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    className="flex items-center justify-center gap-2"
                    htmlFor="images"
                  >
                    <Upload className="size-5" />
                    <span>Add Another Image</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="rounded-md border-2 border-gray-200 w-full">
              <div className="p-4 flex items-center justify-between">
                <h1 className="font-medium text-lg text-green-800">
                  General Information
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className="border-2 border-gray-200 rounded-md cursor-pointer"
                    onClick={() => toggleTab("General")}
                  >
                    <ChevronDown
                      className={`${
                        openTab["General"] && "rotate-180"
                      } transition-transform duration-300 ease-in-out text-gray-500 size-5 mx-auto`}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`border-t-2 border-gray-200 flex flex-col gap-4 transition-all duration-300 ease-in-out origin-top overflow-hidden ${
                  openTab["General"]
                    ? "max-h-fit px-4 py-6 opacity-100 scale-y-100"
                    : "max-h-0 opacity-0 scale-y-0"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name">Product Name</label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Product Name"
                      value={generalForm.name}
                      onChange={handleChangeGeneralForm}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                      <label htmlFor="category">Category</label>
                      <div className="relative">
                        <select
                          className="block w-full px-4 py-2 border-2 border-gray-200 rounded-md appearance-none"
                          name="category"
                          id="category"
                          value={generalForm.category}
                          onChange={handleChangeGeneralForm}
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {shop.categories.map((category) => (
                            <option key={category._id} value={category.name} disabled={!category.isActive}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3">
                      <label htmlFor="brand">Brand</label>
                      <input
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                        type="text"
                        name="brand"
                        id="brand"
                        placeholder="Brand"
                        value={generalForm.brand}
                        onChange={handleChangeGeneralForm}
                      />
                    </div>
                    <div className="w-1/3">
                      <label htmlFor="status">Status</label>
                      <div className="relative">
                        <select
                          className="block w-full px-4 py-2 border-2 border-gray-200 rounded-md appearance-none"
                          name="status"
                          id="status"
                          value={generalForm.status}
                          onChange={handleChangeGeneralForm}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="deleted">Deleted</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:flex-row flex-col gap-4">
                    {/* Price Input */}
                    <div className="lg:w-1/3 w-full">
                      <label htmlFor="price">Price</label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-md pl-8" // Extra left padding for icon
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          step={"any"}
                          value={generalForm.price}
                          onChange={handleChangeGeneralForm}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                      </div>
                    </div>

                    {/* Discount Input */}
                    <div className="lg:w-1/3 w-full">
                      <label htmlFor="discount">
                        Discount&nbsp;
                        <span className="text-gray-400">Optional</span>
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-md pl-8"
                          type="number"
                          name="discount"
                          id="discount"
                          min="0"
                          max="100"
                          value={generalForm.discount}
                          onChange={handleChangeGeneralForm}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Discount Price Input */}
                    <div className="lg:w-1/3 w-full">
                      <label htmlFor="discountPrice">Discount Price</label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-2 border-2 border-gray-200 bg-gray-200 rounded-md pl-8"
                          type="number"
                          name="discountPrice"
                          id="discountPrice"
                          disabled
                          value={
                            generalForm.price > 0
                              ? generalForm.discount > 0
                                ? generalForm.price -
                                  (generalForm.price * generalForm.discount) /
                                    100
                                : generalForm.price
                              : 0
                          }
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="description">Description</label>
                      <div>
                        <span
                          className={`${
                            String(generalForm.description).length == 0 ||
                            String(generalForm.description).length == 500
                              ? "text-gray-500"
                              : "text-black"
                          }`}
                        >
                          {String(generalForm.description).length}
                        </span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-500">500</span>
                      </div>
                    </div>
                    <textarea
                      className="w-full h-32 px-4 py-2 border-2 border-gray-200 rounded-md"
                      name="description"
                      id="description"
                      placeholder="Write Description..."
                      value={generalForm.description}
                      onChange={handleChangeGeneralForm}
                    />
                  </div>
                  <div className="rounded-md border-2 border-gray-200">
                    <div className="p-4 flex items-center justify-between">
                      <h1 className="font-medium text-lg text-green-800">
                        Variants
                      </h1>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="px-3 py-2 bg-blue-900 cursor-pointer text-white rounded-md"
                      >
                        + Add Variant
                      </button>
                    </div>
                    <div className="border-t-2 border-gray-200 p-4 flex flex-col gap-4">
                      {variants.length === 0 ? (
                        <p className="text-gray-500 text-center">
                          No variants yet.
                        </p>
                      ) : (
                        variants.map((variant, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 p-4 rounded-md flex flex-col gap-3"
                          >
                            <div className="flex justify-between items-center">
                              <h2 className="font-medium text-green-700">
                                Variant {index + 1}
                              </h2>
                              <button
                                type="button"
                                className="text-red-600"
                                onClick={() => handleRemoveVariant(index)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="flex sm:flex-row flex-col gap-4">
                              <div className="flex flex-col gap-2 sm:w-[70%] w-full">
                                <div>
                                  <label>Variant Name</label>
                                  <input
                                    type="text"
                                    className="w-full border-2 border-gray-200 px-3 py-2 rounded-md"
                                    value={variant.name}
                                    onChange={(e) =>
                                      setVariants((prev) =>
                                        prev.map((v, i) =>
                                          i === index
                                            ? { ...v, name: e.target.value }
                                            : v
                                        )
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>Price</label>
                                  <input
                                    type="number"
                                    className="w-full border-2 border-gray-200 px-3 py-2 rounded-md"
                                    value={variant.price}
                                    onChange={(e) =>
                                      setVariants((prev) =>
                                        prev.map((v, i) =>
                                          i === index
                                            ? { ...v, price: e.target.value }
                                            : v
                                        )
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label>Stock</label>
                                  <input
                                    type="number"
                                    className="w-full border-2 border-gray-200 px-3 py-2 rounded-md"
                                    value={variant.stock}
                                    onChange={(e) =>
                                      setVariants((prev) =>
                                        prev.map((v, i) =>
                                          i === index
                                            ? { ...v, stock: e.target.value }
                                            : v
                                        )
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="sm:w-[30%] w-full flex flex-col items-center gap-2">
                                {/* Nút upload */}
                                <div className="relative w-full h-52 border-2 border-gray-200 rounded-md overflow-hidden group">
                                  {variant.image ? (
                                    <>
                                      <img
                                        src={
                                          variant.image.fromFile
                                            ? variant.image.path
                                            : `${Config.BACKEND_URL}${variant.image.path}`
                                        }
                                        alt={`Variant ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveVariantImage(index)
                                        }
                                        className="absolute top-1/2 left-1/2 transform cursor-pointer -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition"
                                      >
                                        Remove
                                      </button>
                                    </>
                                  ) : (
                                    <p className="text-center text-gray-500 mt-16">
                                      No image selected yet.
                                    </p>
                                  )}
                                </div>
                                <div className="relative cursor-pointer w-full p-2 border-2 border-gray-300 rounded-md bg-white hover:bg-gray-200 text-md text-green-800">
                                  <input
                                    type="file"
                                    id={`image-${index}`}
                                    name="images"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleVariantImageChange(index, e)
                                    }
                                  />
                                  <label
                                    className="flex items-center justify-center gap-2"
                                    htmlFor={`image-${index}`}
                                  >
                                    <Upload className="size-5" />
                                    <span>Add Image</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddEditProductTab;
