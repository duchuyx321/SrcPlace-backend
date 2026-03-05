import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";
import PropTypes from "prop-types";

function ProtectedRoute({ role, children }) {
    if (role) {
        const AccessToken = localStorage.getItem("AccessToken");
        if (!AccessToken) {
            return <Navigate to="/" replace />;
        }

        const decoded = jwtDecode(AccessToken.split(" ")[1]);
        if (decoded.role !== role) {
            return <Navigate to="/" replace />;
        }
    }
    return children;
}
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
};
export default ProtectedRoute;
