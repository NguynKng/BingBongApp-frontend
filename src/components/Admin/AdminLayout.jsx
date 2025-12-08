import PropTypes from "prop-types";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";

export default function AdminLayout({ Element }) {
  const [isOpenNavbar, setIsOpenNavbar] = useState(true);
  return (
    <>
      <Navbar isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar} />
      <Header isOpenNavbar={isOpenNavbar} setIsOpenNavbar={setIsOpenNavbar} />
      <div
        className={`absolute w-full bg-gray-50 top-12 right-0 transition-all duration-300 ease-in-out ${
          isOpenNavbar ? "lg:w-[85%]" : "lg:w-[93%]"
        }`}
      >
        <Element />
      </div>
    </>
  );
}

AdminLayout.propTypes = {
  Element: PropTypes.elementType.isRequired,
};