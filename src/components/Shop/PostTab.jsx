import {
  MessageCircle,
  UserPlus,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  CircleAlert,
  MapPinHouse,
  Link,
} from "lucide-react";

export default function PostTab({ shop, user }) {
  return (
    <div className="flex lg:flex-row flex-col gap-4">
      <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
        <div className="rounded-lg bg-white dark:bg-[#1e1e2f] border-2 border-gray-200 dark:border-[#2b2b3d] p-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold">Giới thiệu</h1>
            <p className="text-center mt-2">{shop.description.about}</p>
          </div>
          <hr className="border-gray-300 dark:border-[#2b2b3d]" />
          <div className="flex flex-col gap-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <CircleAlert />
              <span>
                {`Trang`}
                {shop.productTypes.length > 0 && (
                  <> bán {shop.productTypes.join(", ")}</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinHouse />
              <span>{shop.description.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone />
              <span>{shop.description.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail />
              <span>{shop.description.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link />
              <span>{shop.description.website}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[60%] w-full space-y-4">
        <div className="py-2 px-4 bg-white dark:bg-[#1e1e2f] rounded-lg">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Bài viết
          </h1>
        </div>
      </div>
    </div>
  );
}
