import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Truck,
  Anvil,
  Ruler,
} from "lucide-react";
import { formatPriceWithDollar } from "../utils/formattedFunction";
import SpinnerLoading from "./SpinnerLoading";
import { productAPI } from "../services/api";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import useCartStore from "../store/cartStore";
import { getBackendImgURL } from "../utils/helper";
import RatingProduct from "./RatingProduct";

function DetailProductTab({ shop }) {
  const { slug } = useParams();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const isUnavailable = ["deleted", "inactive"].includes(product?.status);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const thumbnailSliderRef = useRef();
  const productSliderRef = useRef(null);
  const thumbnailIndex =
    product?.images.findIndex((img) => img.type === "thumbnail") || 0;
  const [currentIndex, setCurrentIndex] = useState(thumbnailIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const relatedCategory = shop?.categories.find(
    (cat) => cat.name === product?.category
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const query = {
          category: relatedCategory?.slug,
        };
        const [response, responseRelated] = await Promise.all([
          productAPI.getProductBySlug(slug, shop._id),
          productAPI.getProductsByShop(shop._id, query),
        ]);
        if (response.success) {
          setProduct(response.data);
        }

        if (responseRelated.success) {
          setRelatedProducts(responseRelated.data);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug, shop._id, relatedCategory?.slug]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const updateImage = (index) => {
    if (index >= 0 && index < product?.images.length) {
      setCurrentIndex(index);
    }
  };

  const scrollLeft = (sliderRef) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (sliderRef) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  const onRatingChange = (newRating) => {
    const updatedRatings = [...(product.ratings || []), newRating];
    setProduct({
      ...product,
      ratings: updatedRatings,
    });
  };

  return (
    <>
      <div className="w-full bg-white flex lg:flex-row flex-col gap-4 p-4 rounded-lg">
        {/* --- Product Images --- */}
        <div className="flex flex-col lg:w-[55%] w-full gap-2">
          <div className="relative w-full lg:h-[36rem] cursor-pointer">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <SpinnerLoading />
              </div>
            ) : (
              <img
                src={getBackendImgURL(product.images[currentIndex])}
                className="size-full object-contain border-2 border-gray-200"
                alt="Product image"
                onLoad={handleImageLoad}
              />
            )}

            {/* Left arrow */}
            <div
              className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => updateImage(currentIndex - 1)}
            >
              <ChevronLeft className="size-6" />
            </div>

            {/* Right arrow */}
            <div
              className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer ${
                currentIndex === product.images.length - 1 &&
                "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => updateImage(currentIndex + 1)}
            >
              <ChevronRight className="size-6" />
            </div>

            {/* Image counter */}
            <div className="absolute right-2 bottom-2 bg-gray-200 py-1 px-3 text-sm rounded-full">
              <span>
                {currentIndex + 1}/{product?.images.length}
              </span>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="relative w-full h-20 overflow-hidden">
            <div
              className="flex overflow-x-scroll gap-2 custom-scroll items-center size-full transition-transform duration-500 ease-in-out"
              ref={thumbnailSliderRef}
            >
              {product?.images.map((image, index) => (
                <img
                  className={`w-24 h-full cursor-pointer border-2 transition-all duration-200 object-contain ${
                    currentIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-black"
                  }`}
                  key={index}
                  src={getBackendImgURL(image)}
                  onClick={() => updateImage(index)}
                  alt={`Image ${index + 1}`}
                />
              ))}
            </div>

            <div
              onClick={() => scrollLeft(thumbnailSliderRef)}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </div>

            <div
              onClick={() => scrollRight(thumbnailSliderRef)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </div>
          </div>
        </div>

        {/* --- Product Details --- */}
        <div className="flex flex-col gap-6 lg:w-[45%] w-full pl-4">
          {/* Name & Price */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>

            {/* ⚡ Product status */}
            {isUnavailable ? (
              <span className="mb-2 text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                Unavailable
              </span>
            ) : (
              <span className="mb-2 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Available
              </span>
            )}

            {/* Price */}
            {product?.discount > 0 ? (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-2xl font-bold text-orange-500">
                  {formatPriceWithDollar(
                    product.basePrice -
                      (product.basePrice * product.discount) / 100
                  )}
                </span>
                <span className="text-gray-400 line-through text-lg">
                  {formatPriceWithDollar(product.basePrice)}
                </span>
                <span className="bg-orange-100 text-orange-600 font-medium text-sm px-2 py-1 rounded-md">
                  -{product.discount}%
                </span>
              </div>
            ) : (
              <span className="mt-2 block text-2xl font-bold text-orange-500">
                {formatPriceWithDollar(product.basePrice)}
              </span>
            )}
            {product.totalRating > 0 ? (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < Math.round(product.totalRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "stroke-yellow-500"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  ({product.ratings.length} reviews)
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-yellow-500 stroke-none"
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  (No reviews yet)
                </span>
              </div>
            )}
          </div>

          {/* General Info */}
          <div className="space-y-1 text-gray-600 text-sm">
            <p>
              <strong>Category:</strong> {product?.category}
            </p>
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            )}
            {product.description && (
              <p className="whitespace-pre-wrap">
                <strong>Description:</strong> {product.description}
              </p>
            )}
          </div>

          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Product Variants</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant, idx) => {
                  const isOutOfStock = variant.stock <= 0;
                  const isSelected = selectedVariantIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        !isOutOfStock && setSelectedVariantIndex(idx)
                      }
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-150 
                ${
                  isOutOfStock
                    ? "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
                    : isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-500 bg-white cursor-pointer"
                }`}
                    >
                      {variant.image && (
                        <img
                          src={getBackendImgURL(variant.image)}
                          alt={variant.name}
                          className="w-16 h-16 object-contain mb-2 rounded-md"
                        />
                      )}

                      <span className="text-sm font-medium text-gray-800 text-center line-clamp-1">
                        {variant.name}
                      </span>

                      <span className="text-orange-500 text-sm font-medium">
                        {formatPriceWithDollar(variant.price)}
                      </span>

                      <span
                        className={`mt-1 text-xs font-medium ${
                          isOutOfStock ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {isOutOfStock ? "Out of stock" : "In stock"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isUnavailable ? (
              <span className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded-md select-none">
                This product is no longer available
              </span>
            ) : (
              <>
                <button
                  className="text-white bg-blue-900 rounded-md py-2 px-4 hover:opacity-90 cursor-pointer"
                  onClick={() =>
                    addToCart(
                      product._id,
                      product.variants[selectedVariantIndex]._id
                    )
                  }
                >
                  Add to Cart
                </button>
                <button className="text-black bg-orange-400 rounded-md py-2 px-4 hover:opacity-90 cursor-pointer">
                  Buy Now
                </button>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-6 border-t pt-4 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck className="size-4" />
                <span>Shipping & Returns</span>
              </div>
              <ChevronDown className="size-4 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Anvil className="size-4" />
                <span>Material</span>
              </div>
              <ChevronDown className="size-4 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Ruler className="size-4" />
                <span>Size</span>
              </div>
              <ChevronDown className="size-4 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      <RatingProduct
        productId={product._id}
        totalRating={product.totalRating}
        ratingData={product.ratings}
        onRatingChange={onRatingChange}
      />

      <div className="w-full bg-white p-4 mt-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-medium lg:text-2xl text-lg">Related Products</h2>
          <div className="flex">
            <ChevronLeft
              className="hover:text-red-500 cursor-pointer"
              onClick={() => scrollLeft(productSliderRef)}
            />
            <ChevronRight
              className="hover:text-red-500 cursor-pointer"
              onClick={() => scrollRight(productSliderRef)}
            />
          </div>
        </div>
        <div
          className="flex overflow-x-scroll custom-scroll gap-4 items-center mt-6"
          ref={productSliderRef}
        >
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} shop={shop} />
          ))}
        </div>
      </div>
    </>
  );
}

export default DetailProductTab;
