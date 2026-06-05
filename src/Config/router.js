const routers = {
    products: "/product",
    tutorial: "/tutorial",
    checkout: "/checkout", // thanh toán
    payments: "/payments",
    setting: "/setting",
    downloads: "/downloads/:order_ID",
    viewCart: "/view-cart",
    detailProduct: "/product/:slug",
    home: "/",
    notFound: "*", // page 404
};
export default routers;
