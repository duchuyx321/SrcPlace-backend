import { useState } from "react";

const useRegisterVariables = () => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
    });

    // handle add variables
    const handleOnAddVariables = ({ key = "", value = "" } = {}) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    //  check variables
    const isValid = Object.values(form).every((item) => item.trim() !== "");
    return { form, handleOnAddVariables, isValid };
};

export default useRegisterVariables;
