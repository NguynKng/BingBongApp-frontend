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
import { useMemo, useState } from "react";

function DropdownMenu() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterItems = (items, term) => {
    return items.filter(
      (item) =>
        item.text.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredSocial = useMemo(
    () => filterItems(socialNavbar, searchTerm),
    [searchTerm]
  );
  const filteredEntertainment = useMemo(
    () => filterItems(entertainmentNavbar, searchTerm),
    [searchTerm]
  );
  const filteredShopping = useMemo(
    () => filterItems(shoppingNavbar, searchTerm),
    [searchTerm]
  );
  const filteredPersonal = useMemo(
    () => filterItems(personalNavbar, searchTerm),
    [searchTerm]
  );
  const filteredProfessional = useMemo(
    () => filterItems(professionalNavbar, searchTerm),
    [searchTerm]
  );
  const filteredCommunity = useMemo(
    () => filterItems(communityNavbar, searchTerm),
    [searchTerm]
  );

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
    <div className="absolute top-[110%] right-0 md:w-[42rem] w-[24rem] rounded-lg shadow-lg border-[1px] border-transparent bg-gray-50 pt-3 px-3 space-y-2 dark:bg-[rgb(35,35,35)]">
      <h1 className="text-[24px] font-semibold dark:text-white">Menu</h1>
      <div className="flex flex-col md:flex-row gap-4 custom-scroll overflow-y-auto h-[38rem] min-h-0">
        <div className="rounded-lg border-[1px] border-transparent p-4 shadow-md md:w-[60%] w-full space-y-4 h-fit bg-white dark:bg-[rgb(16,16,16)]">
          <div className="relative w-full">
            <Search className="absolute size-5 top-2.5 left-3 text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Tìm kiếm menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-900 text-[15px] w-full py-2 pl-10 bg-gray-200 rounded-full focus:outline-none dark:placeholder:text-gray-300 dark:bg-[rgb(52,52,53)] dark:text-gray-300"
            />
          </div>

          {/* SOCIAL */}
          {filteredSocial.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">
                Mạng xã hội
              </h1>
              <div className="space-y-2">
                {filteredSocial.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full border border-gray-200 dark:border-gray-500" />
            </>
          )}

          {/* ENTERTAINMENT */}
          {filteredEntertainment.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">
                Giải trí
              </h1>
              <div className="space-y-2">
                {filteredEntertainment.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full border border-gray-200 dark:border-gray-500" />
            </>
          )}

          {/* PERSONAL */}
          {filteredPersonal.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">Cá nhân</h1>
              <div className="space-y-2">
                {filteredPersonal.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full border border-gray-200 dark:border-gray-500" />
            </>
          )}

          {/* SHOPPING */}
          {filteredShopping.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">Mua sắm</h1>
              <div className="space-y-2">
                {filteredShopping.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full border border-gray-200 dark:border-gray-500" />
            </>
          )}

          {/* PROFESSIONAL */}
          {filteredProfessional.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">
                Công việc
              </h1>
              <div className="space-y-2">
                {filteredProfessional.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full border border-gray-200 dark:border-gray-500" />
            </>
          )}

          {/* COMMUNITY */}
          {filteredCommunity.length > 0 && (
            <>
              <h1 className="text-[17px] font-bold dark:text-white">
                Cộng đồng
              </h1>
              <div className="space-y-2">
                {filteredCommunity.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
                  >
                    <img src={item.src} className="size-8 object-cover" />
                    <div className="text-gray-600 dark:text-white">
                      <h4 className="font-medium text-[14px]">{item.text}</h4>
                      <p className="text-[13px]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Create section giữ nguyên */}
        <div className="rounded-lg border-[1px] border-transparent p-4 shadow-md w-full md:w-[40%] h-fit bg-white dark:bg-[rgb(16,16,16)]">
          <h1 className="text-xl font-semibold dark:text-white">Tạo</h1>
          <div className="mt-2">
            {list_1.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
              >
                <div className="size-9 p-[6px] rounded-full bg-gray-200 dark:bg-white">
                  <img
                    src={item.src}
                    alt={item.text}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-medium dark:text-white">{item.text}</span>
              </Link>
            ))}
          </div>
          <div className="w-full border border-gray-200 my-2 dark:border-gray-500"></div>
          <div>
            {list_2.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="flex gap-3 items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:hover:bg-[rgb(36,36,36)]"
              >
                <div className="size-9 p-[6px] rounded-full bg-gray-200 dark:bg-white">
                  <img
                    src={item.src}
                    alt={item.text}
                    className="size-full object-cover"
                  />
                </div>
                <span className="font-medium dark:text-white">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
