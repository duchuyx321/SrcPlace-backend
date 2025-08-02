import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-toastify";

import style from "./Payments.module.scss";
import Seo from "~/Components/Seo";
import { formatDay } from "~/Util/lib/formatDate";
import Button from "~/Components/Button";
import DownloadService from "~/Services/DownloadService";
import { addToast } from "~/Features/Toast/toastSlice";

const cx = classNames.bind(style);

function Payments() {
    const [resultPayment, setResultPayment] = useState([1, 1, 1, 1]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
                                <th>Tên sản phẩm</th>
                                <th>Ngày mua</th>
                                <th>Trạng thái thanh toán</th>
                                <th>Trạng thái tải</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultPayment.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td data-label="Tên sản phẩm">
                                        {item.name || "Đồ án SrcPlace"}
                                    </td>
                                    <td data-label="Ngày mua">
                                        {formatDay(item.date)}
                                    </td>
                                    <td
                                        data-label="Thanh toán"
                                        className={cx({
                                            [item.paymentStatus]:
                                                item.paymentStatus,
                                        })}
                                    >
                                        {item.paymentStatus || "Chờ thanh toán"}
                                    </td>
                                    <td
                                        data-label="Trạng thái tải"
                                        className={cx({
                                            "not-downloaded": !item.downloaded,
                                            downloaded: item.downloaded,
                                        })}
                                    >
                                        {item.downloaded
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
            </div>
        </>
    );
}

export default Payments;
