import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { rehydrateVerify } from "~/Features/Verify/VerifySlice";
import MeService from "~/Services/MeService";
import { adDataAuth, updateAuthStatus } from "~/Features/Auth/AuthSlice";

function useInitUserAuth() {
    const dispatch = useDispatch();
    const fetchApiGetProfile = async () => {
        const resultAuth = await MeService.getProfile();
        if (!resultAuth.error) {
            dispatch(
                adDataAuth({
                    user: resultAuth,
                })
            );
        }
    };
    useEffect(() => {
        try {
            const savedAuthVerify = sessionStorage.getItem("authVerify");
            const savedAuthStatus = sessionStorage.getItem("authStatus");
            if (savedAuthVerify) {
                const parsedAuthVerify = JSON.parse(savedAuthVerify);
                dispatch(rehydrateVerify(parsedAuthVerify)); // khôi phục lại redux và "kích hoạt render"
            }
            if (savedAuthStatus) {
                const parsedAuthStatus = JSON.parse(savedAuthStatus);
                dispatch(updateAuthStatus(parsedAuthStatus));
            }
            // call api lấy thông người dùng
            setTimeout(() => {
                const token = localStorage.getItem("AccessToken");
                if (token) {
                    fetchApiGetProfile();
                }
            }, 300);
        } catch {}
    }, []);
}

export default useInitUserAuth;
