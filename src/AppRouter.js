import { Route, Routes } from "react-router-dom";

import { PublicRouters, UserRouters, AdminRouters } from "~/Routers";
import renderRoute from "~/Routers/renderRoute";

function AppRouter() {
    return (
        <Routes>
            {/* Router Admin */}
            {AdminRouters.map((routes, index) =>
                renderRoute({
                    Route: Route,
                    data: routes,
                    role: "Admin",
                    index: index,
                })
            )}
            {/* Router User */}
            {UserRouters.map((routes, index) =>
                renderRoute({
                    Route: Route,
                    data: routes,
                    role: "User",
                    index: index,
                })
            )}
            {/* Router Public */}
            {PublicRouters.map((routes, index) =>
                renderRoute({ Route: Route, data: routes, index: index })
            )}
        </Routes>
    );
}

export default AppRouter;
