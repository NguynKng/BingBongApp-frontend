import { Cloudinary } from "@cloudinary/url-gen";
import Config from "../envVars";

export const cld = new Cloudinary({
  cloud: {
    cloudName: Config.CLOUDINARY_CLOUD_NAME,
  },
});