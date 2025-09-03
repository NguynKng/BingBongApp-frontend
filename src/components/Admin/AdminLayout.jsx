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
        className={`absolute w-full top-12 right-0 ${
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
