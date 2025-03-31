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
            <div className={`relative z-10`}>
                <Navbar />
                <div className={`absolute w-full top-[10vh] right-0 lg:w-[75%]`}>
                    <div className="bg-gray-100 w-[60%]">
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