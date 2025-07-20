import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { PublicRouters, UserRouters, AdminRouters } from "~/Routers";
import renderRoute from "~/Routers/renderRoute";
import { selectToasts } from "~/Features/Toast/toastSelect";
import { removeToast } from "~/Features/Toast/toastSlice";
import Auth from "~/Components/Auth";
import { selectIsShowAuthModal } from "./Features/AuthModal/authModalSelect";

function App() {
    const dispatch = useDispatch();
    const toasts = useSelector(selectToasts);
    const isShowAuthModal = useSelector(selectIsShowAuthModal);
    useEffect(() => {
        const timers = [];

        toasts.forEach((item) => {
            if (!item.title) return;

            toast[item.type](item.title, { autoClose: item.duration || 3000 });

            const timer = setTimeout(() => {
                dispatch(removeToast({ id: item.id }));
            }, item.duration || 3000);

            timers.push(timer);
        });

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [dispatch, toasts]);
    return (
        <Router>
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
            {/* add model toast message */}
            {/* toast */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                // draggable = {}
            />
            {isShowAuthModal && <Auth />}
        </Router>
    );
}

export default App;
