import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import config from "~/Config";

import style from "./Downloads.module.scss";
import Seo from "~/Components/Seo";
import Product from "~/Components/Product";
import { useNavigate, useParams } from "react-router";
import OrderService from "~/Services/OrderService";
import DownloadService from "~/Services/DownloadService";
import { addToast } from "~/Features/Toast/toastSlice";

const cx = classNames.bind(style);

function Downloads() {
    const [resultOrder, setResultOrder] = useState([1, 1, 1]);
    const [statusOrder, setStatusOrder] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order_ID } = useParams();
    // handle call apo
    const handleFetchApiOrder = async (order_ID) => {
        const result = await OrderService.getOrderById(order_ID);
        if (!result.error) {
            setResultOrder(result.projectsWithStatus);
            setStatusOrder(result.status === "paid");
        } else {
            navigate(config.routers.notFound);
        }
    };
    useEffect(() => {
        handleFetchApiOrder(order_ID);
    }, []);
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
            setResultOrder((prev) =>
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
                title="Tải Xuống | SrcPlace - Thư Viện Đồ Án"
                description="Đây là trang tải xuống các đồ án đã mua của SrcPlace"
                noIndex={false}
            />
            {/* html */}
            <div className={cx("wrapper")}>
                <div className={cx("header")}>
                    <h3>Tải xuống đồ án</h3>
                    <p>
                        Cảm ơn bạn đã mua đồ án. Hãy để lại đánh giá 5 sao và
                        bình luận để chúng tôi có thêm động lực tạo ra nhiều sản
                        phẩm chất lượng hơn.
                    </p>
                </div>
                <div className={cx("content")}>
                    {resultOrder.map((item, index) => (
                        <Product
                            key={index}
                            is_Download
                            item={item}
                            isDisable={isLoading || !statusOrder}
                            handleOnClickDownload={handleOnClickDownloadItem}
                        />
                    ))}
                </div>
            </div>
            ;
        </>
    );
}

export default Downloads;
