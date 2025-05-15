import { Search } from "lucide-react";
import {
  socialNavbar,
  entertainmentNavbar,
  shoppingNavbar,
  personalNavbar,
  professionalNavbar,
  communityNavbar,
} from "../data/navbar";
import { Link } from "react-router-dom";

function DropdownMenu() {
  const list_1 = [
    {
      id: 1,
      src: "/edit.png",
      text: "Post",
      link: "#",
    },
    {
      id: 2,
      src: "/book.png",
      text: "Story",
      link: "#",
    },
    {
      id: 3,
      src: "/reel.png",
      text: "Reel",
      link: "#",
    },
    {
      id: 4,
      src: "/favorite.png",
      text: "Life Event",
      link: "#",
    },
  ];

  const list_2 = [
    {
      id: 1,
      src: "/facebook-page-1.png",
      text: "Page",
      link: "#",
    },
    {
      id: 2,
      src: "/megaphone.png",
      text: "Ad",
      link: "#",
    },
    {
      id: 3,
      src: "/groups.png",
      text: "Group",
      link: "#",
    },
    {
      id: 4,
      src: "/event.png",
      text: "Event",
      link: "#",
    },
    {
      id: 5,
      src: "/cart.png",
      text: "Marketplace Listing",
      link: "#",
    },
  ];
  return (
    <div className="absolute top-[110%] right-0 md:w-[42rem] w-[24rem] rounded-lg shadow-lg border-[1px] border-transparent bg-gray-50 pt-3 pl-3 space-y-2">
      <h1 className="text-[24px] font-semibold">Menu</h1>
      <div className="flex flex-col md:flex-row gap-4 custom-scroll overflow-y-auto h-[38rem] min-h-0">
        <div className="rounded-lg border-[1px] border-transparent p-4 shadow-md md:w-[60%] w-full space-y-4 h-fit bg-white">
          <div className="relative w-full">
            <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search menu"
              className="text-gray-900 text-[15px] w-full py-2 pl-10 bg-gray-200 rounded-full focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">Social</h1>
            <div className="space-y-2">
              {socialNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full border border-gray-200"></div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">
              Entertainment
            </h1>
            <div className="space-y-2">
              {entertainmentNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full border border-gray-200"></div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">Personal</h1>
            <div className="space-y-2">
              {personalNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full border border-gray-200"></div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">Shopping</h1>
            <div className="space-y-2">
              {shoppingNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full border border-gray-200"></div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">
              Professional
            </h1>
            <div className="space-y-2">
              {professionalNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full border border-gray-200"></div>
          <div className="space-y-1">
            <h1 className="text-[17px] font-bold">Community</h1>
            <div className="space-y-2">
              {communityNavbar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                  <img src={item.src} className={`size-8 object-cover`} />
                  <div className="text-gray-600">
                    <h4 className="font-medium text-[14px]">{item.text}</h4>
                    <p className="text-[13px]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border-[1px] border-transparent p-4 shadow-md w-full md:w-[40%] h-fit bg-white">
          <h1 className="text-xl font-semibold">Create</h1>
          <div className="mt-2">
            {list_1.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                <div className="size-9 p-[6px] rounded-full bg-gray-200">
                  <img
                    src={item.src}
                    alt={item.text}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-medium">{item.text}</span>
              </Link>
            ))}
          </div>
          <div className="w-full border border-gray-200 my-2"></div>
          <div>
            {list_2.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              >
                <div className="size-9 p-[6px] rounded-full bg-gray-200">
                  <img
                    src={item.src}
                    alt={item.text}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-medium">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
