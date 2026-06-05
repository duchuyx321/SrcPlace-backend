import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";

import style from "./Payments.module.scss";
import Seo from "~/Components/Seo";
import { formatDay } from "~/Util/lib/formatDate";
import Button from "~/Components/Button";
import DownloadService from "~/Services/DownloadService";
import { addToast } from "~/Features/Toast/toastSlice";
import Image from "~/Components/Image";
import Pagination from "~/Components/Pagination";
import OrderService from "~/Services/OrderService";

const cx = classNames.bind(style);

const statusVi = {
    pending : "Đang xử lý",
    paid: "Thành công",
    cancelled: "Thất bại"
}

function Payments() {
    const [resultPayment, setResultPayment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentPage = searchParams.get("page");

    useEffect(() => {
        const pageNumber = parseInt(currentPage);

        if (!pageNumber || pageNumber < 1 || pageNumber > maxPage) {
            navigate("/payments?page=1", { replace: true });
            return;
        }

        setPage(pageNumber);
        // call api
        const fetchApi = async () => {
            const result = await OrderService.getOrders({ page: pageNumber });
            if (!result?.error) {
                setResultPayment(result.projects);
                setMaxPage(result.maxPage);
            }
        };
        fetchApi();
    }, [currentPage]);
    // handle button
    const handleOnClickDownloadItem = async (item) => {
        setIsLoading(true);
        if (item?.isDownloaded) return;
        const toastId = toast.loading("Đang tải xuống...");
        const resultDownload = await DownloadService.downloadProductById(
            item._id
        );
        toast.dismiss(toastId);
        setIsLoading(false);
        // Hiện toast loading
        if (resultDownload && resultDownload.status === "successful") {
            setResultPayment((prev) =>
                prev.map((product) => {
                    if (product._id === item._id) {
                        return { ...product, isDownloaded: true };
                    }
                    return product;
                })
            );
            dispatch(
                addToast({
                    type: "success",
                    title: "Tải đồ án thành công!",
                    duration: 3000,
                })
            );
        } else {
            dispatch(
                addToast({
                    type: "error",
                    title: "Tải đồ án thất bại!",
                    duration: 3000,
                })
            );
        }
    };
    const handleOnNextPage = async (page) => {
        setPage((prev) => page);
        navigate(`/payments?page=${page}`, { replace: true });
    };
    return (
        <>
            <Seo
                title="Lịch sử mua hàng | SrcPlace - Thư Viện Đồ Án"
                description="Đây là trang lịch sử mua hàng đồ án đã mua của SrcPlace"
                noIndex={false}
            />
            <div className={cx("wrapper")}>
                <div className={cx("title")}>
                    <h3>Lịch sửa mua hàng</h3>
                    <p>
                        Danh sách các sản phẩm bạn đã mua và có thể tải xuống.
                    </p>
                </div>

                <div className={cx("table_wrapper")}>
                    <table className={cx("table")}>
                        <thead className={cx("table_header")}>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Ngày mua</th>
                                <th>thanh toán</th>
                                <th>Trạng thái tải</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultPayment.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td
                                        data-label="Sản phẩm"
                                        className={cx("product_item")}
                                    >
                                        <Link
                                            to={
                                                item.slug
                                                    ? `/product/${item.slug}`
                                                    : null
                                            }
                                        >
                                            <Image
                                                src={
                                                    item?.thumbnail
                                                        ?.image_url || ""
                                                }
                                                alt={item?.slug || ""}
                                            />
                                            <span
                                                className={cx("product_name")}
                                            >
                                                {item.name || "Đồ án SrcPlace "}
                                            </span>
                                        </Link>
                                    </td>
                                    <td data-label="Ngày mua">
                                        {formatDay(item.date)}
                                    </td>
                                    <td
                                        data-label="Thanh toán"
                                        className={cx({
                                            [item.status]:
                                                item.status,
                                        })}
                                    >
                                        {statusVi[item.status] || "Thất bại"}
                                    </td>
                                    <td
                                        data-label="Trạng thái tải"
                                        className={cx({
                                            "not-downloaded": !item.downloaded,
                                            downloaded: item.downloaded,
                                        })}
                                    >
                                        {item.isDownloaded
                                            ? "Đã tải"
                                            : "Chưa tải"}
                                    </td>
                                    <td data-label="Hành động">
                                        <Button
                                            primary
                                            disable={
                                                isLoading ||
                                                !item.status ||
                                                item.isDownloaded
                                            }
                                            className={cx("btn_download")}
                                            onClick={() =>
                                                handleOnClickDownloadItem(item)
                                            }
                                        >
                                            Tải xuống
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={cx("pages")}>
                    <Pagination
                        page={page}
                        maxPage={maxPage}
                        isDark
                        handleOnNextPage={handleOnNextPage}
                    />
                </div>
            </div>
        </>
    );
}

export default Payments;
