import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import style from "./Products.module.scss";
import ProductSessions from "~/Components/ProductSessions";
import Pagination from "~/Components/Pagination";
import PublicService from "~/Services/PublicService";

const cx = classNames.bind(style);
function Products() {
    const [resultProducts, setResultProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentPage = searchParams.get("page");

    useEffect(() => {
        const pageNumber = parseInt(currentPage);

        if (!pageNumber || pageNumber < 1 || pageNumber > maxPage) {
            navigate("/product?page=1", { replace: true });
            return;
        }

        setPage(pageNumber);
        // call api
        const fetchApi = async () => {
            const result = await PublicService.getProject({
                page: pageNumber,
                limit: 8,
            });
            if (!result?.error) {
                setResultProducts(result.paidProjects);
                setMaxPage(result.maxPage);
            }
        };
        fetchApi();
    }, [currentPage]);
    const handleOnNextPage = async (page) => {
        setPage((prev) => page);
        navigate(`/product?page=${page}`, { replace: true });
    };
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <ProductSessions
                    className={cx("products")}
                    title="Danh Sách Đồ Án SrcPlace"
                    products={resultProducts}
                    is_more={false}
                />
            </div>
            <div className={cx("pagination")}>
                <Pagination page={page} handleOnNextPage={handleOnNextPage} />
            </div>
        </div>
    );
}

export default Products;
