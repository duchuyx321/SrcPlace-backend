import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import images from "~/Assets/images";

function Seo({
    title = "SrcPlace - Thư Viện Đồ Án",
    description = "Đây là trang chủ của SrcPlace",
    canonical = process.env.REACT_APP_URL_CLIENT,
    image = images.noImage,
    noIndex = true,
} = {}) {
    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {canonical && <link rel="canonical" href={canonical} />}
            <meta
                name="robots"
                content={noIndex ? "noindex, nofollow" : "index, follow"}
            />
            <meta property="og:title" content={title} />
            {canonical && <meta property="og:url" content={canonical} />}
            {image && <meta property="og:image" content={image} />}
            {description && (
                <meta property="og:description" content={description} />
            )}
            <meta name="twitter:card" content="summary_large_image" />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
Seo.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    noIndex: PropTypes.bool,
};
export default Seo;
