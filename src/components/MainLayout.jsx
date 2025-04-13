import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import Header from "./Header";
import Meta from "./Meta";
import Footer from "./Footer";

function MainLayout({ Element }) {
    return (
        <>
            <Meta title={`BingBong`} />
            <Header />
            <div className="flex min-h-screen pt-[10vh]">
                {/* Navbar component is now fixed positioned */}
                <Navbar />
                <div className="w-full lg:ml-[25%] px-10 bg-gray-100 min-h-[90vh]">
                    <div className="w-full lg:w-2/3">
                        <Element />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

MainLayout.propTypes = {
    Element: PropTypes.elementType.isRequired,
};

export default MainLayout