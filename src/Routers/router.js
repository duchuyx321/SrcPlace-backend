import config from "~/Config";
// Page
import Home from "~/Pages/Home";
import DetailProduct from "~/Pages/DetailProduct";
import NotFund from "~/Pages/NotFound.js";
import Products from "~/Pages/Products";
import Checkout from "~/Pages/Checkout";
import Payments from "~/Pages/Payments";
import Downloads from "~/Pages/Downloads";
import Setting from "~/Pages/Setting/Setting";
// Layout
import DetailLayout from "~/Layouts/DetailLayout";
import EmptyLayout from "~/Layouts/EmptyLayout";
// các router không cần đăng nhập
const PublicRouters = [
    {
        path: config.routers.home,
        component: Home,
        props: {
            is_searchHeader: false,
        },
    },
    {
        path: config.routers.detailProduct,
        component: DetailProduct,
        layout: DetailLayout,
    },
    { path: config.routers.products, component: Products },
    { path: config.routers.notFound, component: NotFund, layout: null },
    // useRoute
    {
        path: config.routers.payments,
        component: Payments,
        layout: DetailLayout,
        props: {
            isNoSidebarMobile: true,
        },
    },
    {
        path: config.routers.setting,
        component: Setting,
        layout: EmptyLayout,
        props: {
            isNoSidebarMobile: true,
            isNoSidebar: true,
        },
    },
];
// các router cần cần đăng nhập
const UserRouters = [
    {
        path: config.routers.checkout,
        component: Checkout,
        layout: DetailLayout,
        props: {
            isNoSidebarMobile: true,
        },
    },

    {
        path: config.routers.downloads,
        component: Downloads,
        layout: DetailLayout,
        props: {
            isNoSidebarMobile: true,
            isNoSidebar: true,
        },
    },
];
// Các router cần đăng nhập và có role Admin
const AdminRouters = [];

export { PublicRouters, UserRouters, AdminRouters };
