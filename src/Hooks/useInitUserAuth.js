import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { rehydrateVerify } from "~/Features/Verify/VerifySlice";
import MeService from "~/Services/MeService";
import { adDataAuth } from "~/Features/Auth/AuthSlice";

function useInitUserAuth() {
    const dispatch = useDispatch();
    const fetchApiGetProfile = async () => {
        const resultAuth = await MeService.getProfile();
        if (!resultAuth.error) {
            dispatch(
                adDataAuth({
                    user: resultAuth.data,
                })
            );
        }
    };
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem("authVerify");
            if (saved) {
                const parsed = JSON.parse(saved);
                dispatch(rehydrateVerify(parsed)); // khôi phục lại redux và "kích hoạt render"
            }
            // call api lấy thông người dùng
            if (localStorage.getItem("AccessToken")) {
                fetchApiGetProfile();
            }
        } catch {}
    }, []);
}

export default useInitUserAuth;
