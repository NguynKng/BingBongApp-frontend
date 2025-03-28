import { Helmet, HelmetProvider } from "react-helmet-async";
import PropTypes from 'prop-types';

function Meta(props) {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{props.title}</title>
            </Helmet>
        </HelmetProvider>
    )
}

Meta.propTypes = {
    title: PropTypes.string.isRequired, // Ensure `title` is a string and is required
};

export default Meta;