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
            
            {/* Navbar component is now fixed positioned */}
            <Navbar />
            <div className="pt-[10vh] min-h-screen bg-gray-100 lg:ml-[25%]">
                <div className="lg:w-[70%] w-full px-4 md:px-8 min-h-[90vh]">
                    <Element />
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