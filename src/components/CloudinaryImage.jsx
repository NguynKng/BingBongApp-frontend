import { AdvancedImage } from "@cloudinary/react";
import { useMemo } from "react";
import { cld } from "../utils/cloudinary";

export default function CloudinaryImage({ publicId, alt, className }) {
  const image = useMemo(() => cld.image(publicId), [publicId]);

  return <AdvancedImage cldImg={image} alt={alt} className={className} />;
}
