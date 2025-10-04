import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Upload,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Config from "../../../../envVars";

function AddEditProductTab({ shop }) {
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const navigate = useNavigate(); // Hook điều hướng
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [openTab, setOpenTab] = useState({ General: true });
  const imageSliderRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [generalForm, setGeneralForm] = useState({
    productName: "",
    slug: "",
    productCategory: "",
    productBrand: "",
    price: 0,
    discount: 0,
    description: "",
  });

  const [stockForm, setStockForm] = useState({
    keepingUnit: "",
    stock: 0,
    minStock: 0,
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => ({
      // temporary unique id for the preview
      path: URL.createObjectURL(file),
      fromFile: true,
    }));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = async (index) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      // Get the image being removed
      setPreviewImages((prevPreviews) => {
        const removed = prevPreviews[index];
        // If the removed image has an _id and is not from a new file, store its ID
        if (removed && removed._id && !removed.fromFile) {
          setDeletedImageIds((prevIds) => [...prevIds, removed._id]);
        }
        return prevPreviews.filter((_, i) => i !== index);
      });
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
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

  //Check Progress Stock Form
  const totalStockFormFields = Object.keys(stockForm).length;
  const filledStockFormFields = Object.entries(stockForm).filter(([key, val]) =>
    typeof val === "number" ? val > 0 : val.toString().trim() !== ""
  ).length;
  const filledStockFormBars = Math.round(
    (filledStockFormFields / totalStockFormFields) * totalStockFormFields
  );

  // Exclude discount and discountPrice fields from the total count
  const totalGeneralFormFields = Object.keys(generalForm).filter(
    (key) => !["discount"].includes(key)
  ).length;

  // excluding discount and discountPrice
  const filledGeneralFormFields = Object.entries(generalForm).filter(
    ([key, val]) => {
      if (["discount"].includes(key)) return false;
      return typeof val === "number" ? val > 0 : val.toString().trim() !== "";
    }
  ).length;

  // Calculate filled bars (this will essentially equal filledGeneralFormFields)
  const filledGeneralFormBars = Math.round(
    (filledGeneralFormFields / totalGeneralFormFields) * totalGeneralFormFields
  );

  const handleChangeStockForm = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  const handleChangeGeneralForm = (e) => {
    if (e.target.name === "description" && e.target.value.length > 500) {
      return;
    }

    if (e.target.name === "productName") {
      const newProductName = e.target.value;
      // Generate slug: trim, lowercase, and replace any whitespace with a dash
      const newSlug = newProductName.trim().toLowerCase().replace(/\s+/g, "-");
      setGeneralForm({
        ...generalForm,
        productName: newProductName,
        slug: newSlug,
      });
    } else {
      setGeneralForm({ ...generalForm, [e.target.name]: e.target.value });
    }
  };

  const toggleTab = (tabName) => {
    setOpenTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName], // Toggle only the clicked dropdown
    }));
  };

  const handleSubmit = async (e) => {};

  return (
    <div className="p-4">
      <div className="flex items-center sm:flex-row flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/admin/product/add"
            className="px-4 py-2 rounded-md bg-blue-900 text-white text-center"
          >
            Add Product
          </Link>
          <Link
            to="/admin/product"
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
            className="mr-2 my-2 p-4 px-4 py-2 text-white bg-blue-950 rounded-md w-36bg-"
          >
            Save Product
          </button>
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-6 p-4">
          <div className="rounded-md border-2 border-gray-200 w-full lg:w-[30%] h-fit">
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
              <div className="flex flex-col gap-2 mt-2">
                {/* Preview Image */}
                <div className="flex justify-between">
                  <h1>Product Image ({previewImages.length})</h1>
                  {previewImages.length > 0 && (
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
                {previewImages.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No images selected yet.
                  </p>
                ) : (
                  <div
                    className="flex overflow-x-scroll scrollbar-hide items-center rounded-md"
                    ref={imageSliderRef}
                  >
                    {previewImages.length == 0 ? (
                      <p className="text-center text-gray-500">
                        No images selected yet.
                      </p>
                    ) : (
                      previewImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative w-full flex-none rounded-md border-2 border-gray-200 h-[16rem] group cursor-pointer"
                        >
                          <img
                            src={
                              src.fromFile
                                ? src.path
                                : `${Config.BACKEND_URL}/images/${src.path}`
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
          <div className="lg:w-[70%] w-full">
            <div className="rounded-md border-2 border-gray-200 w-full">
              <div className="p-4 flex items-center justify-between">
                <h1 className="font-medium text-lg text-green-800">
                  General Information
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      totalGeneralFormFields == filledGeneralFormFields &&
                      "bg-green-800"
                    } rounded-full border-2 border-gray-200 flex items-center justify-center gap-1 px-3 py-1 bg-gray-50`}
                  >
                    {filledGeneralFormFields < totalGeneralFormFields ? (
                      <>
                        <div className="sm:flex gap-[0.1rem] hidden">
                          {[...Array(totalGeneralFormFields)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-1 rounded-lg ${
                                i < filledGeneralFormBars
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="rotate-90 h-[0.1rem] w-3 bg-gray-400 sm:block hidden"></div>
                      </>
                    ) : (
                      <div className="bg-white rounded-full">
                        <Check className="size-4 p-1" />
                      </div>
                    )}
                    <div
                      className={`${
                        totalGeneralFormFields === filledGeneralFormFields &&
                        "text-white"
                      } flex`}
                    >
                      <span>{filledGeneralFormFields}</span>
                      <span>/</span>
                      <span>{totalGeneralFormFields}</span>
                    </div>
                  </div>
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
                    <label htmlFor="productName">Product Name</label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="text"
                      name="productName"
                      id="productName"
                      placeholder="Product Name"
                      value={generalForm.productName}
                      onChange={handleChangeGeneralForm}
                    />
                  </div>
                  <div>
                    <label htmlFor="slug">Slug</label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="text"
                      name="slug"
                      id="slug"
                      placeholder="Ex: iphone-16-promax"
                      value={generalForm.slug}
                      onChange={handleChangeGeneralForm}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label htmlFor="productCategory">Product Category</label>
                      <div className="relative">
                        <select
                          className="block w-full px-4 py-2 border-2 border-gray-200 rounded-md appearance-none"
                          name="productCategory"
                          id="productCategory"
                          value={generalForm.productCategory}
                          onChange={handleChangeGeneralForm}
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="productBrand">Product Brand</label>
                      <div className="relative">
                        <select
                          className="block w-full px-4 py-2 border-2 border-gray-200 rounded-md appearance-none"
                          name="productBrand"
                          id="productBrand"
                          value={generalForm.productBrand}
                          onChange={handleChangeGeneralForm}
                        >
                          <option value="" disabled>
                            Select Brand
                          </option>
                          {brands.map((brand) => (
                            <option key={brand._id} value={brand.name}>
                              {brand.name}
                            </option>
                          ))}
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
                </div>
              </div>
            </div>
            <div className={`rounded-md border-2 border-gray-200 w-full mt-4`}>
              <div className="p-4 flex items-center justify-between">
                <h1 className="font-medium text-lg text-green-800">
                  Manage Stock
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      totalStockFormFields === filledStockFormFields &&
                      "bg-green-800"
                    } rounded-full border-2 border-gray-200 flex items-center justify-center gap-1 px-3 py-1 bg-gray-50`}
                  >
                    {filledStockFormFields < totalStockFormFields ? (
                      <>
                        <div className="sm:flex gap-[0.1rem] hidden">
                          {[...Array(totalStockFormFields)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-1 rounded-lg ${
                                i < filledStockFormBars
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="rotate-90 h-[0.1rem] w-3 bg-gray-400 sm:block hidden"></div>
                      </>
                    ) : (
                      <div className="bg-white rounded-full">
                        <Check className="size-4 p-1" />
                      </div>
                    )}
                    <div
                      className={`${
                        totalStockFormFields === filledStockFormFields &&
                        "text-white"
                      } flex`}
                    >
                      <span>{filledStockFormFields}</span>
                      <span>/</span>
                      <span>{totalStockFormFields}</span>
                    </div>
                  </div>
                  <div
                    className="border-2 border-gray-200 rounded-md cursor-pointer"
                    onClick={() => toggleTab("Stock")}
                  >
                    <ChevronDown
                      className={`${
                        openTab["Stock"] && "rotate-180"
                      } transition-transform duration-300 ease-in-out text-gray-500 size-5 mx-auto`}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`border-t-2 border-gray-200 flex lg:flex-row flex-col gap-4 transition-all duration-300 ease-in-out overflow-hidden origin-top ${
                  openTab["Stock"]
                    ? "max-h-fit px-4 py-6 opacity-100 scale-y-100"
                    : "max-h-0 opacity-0 scale-y-0"
                }`}
              >
                <div className="lg:w-1/2 w-full flex flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="keepingUnit" className="block">
                      Stock Keeping Unit
                    </label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="text"
                      id="keepingUnit"
                      name="keepingUnit"
                      value={stockForm.keepingUnit}
                      onChange={handleChangeStockForm}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="stock" className="block">
                      Stock
                    </label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="number"
                      id="stock"
                      name="stock"
                      value={stockForm.stock}
                      onChange={handleChangeStockForm}
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 w-full flex gap-4">
                  <div className="md:self-end w-full">
                    <label htmlFor="minStock" className="block">
                      Minimum Stock
                    </label>
                    <input
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                      type="number"
                      id="minStock"
                      name="minStock"
                      value={stockForm.minStock}
                      onChange={handleChangeStockForm}
                    />
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
