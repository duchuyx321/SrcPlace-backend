import classNames from "classnames/bind";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FiLoader } from "react-icons/fi";

import style from "./Search.module.scss";
import Menu from "~/Components/Wrapper/Menu";
import { useDebounce } from "~/Hooks";
import PublicService from "~/Services/PublicService";

const cx = classNames.bind(style);

function Search() {
    const [isHide, setIsHide] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [resultSearch, setResultSearch] = useState([]);
    const debounced = useDebounce(value, 700);

    const inputRef = useRef();
    useEffect(() => {
        if (!debounced.trim()) {
            setResultSearch([]);
            return;
        }
        // call api
        const fetchApi = async () => {
            setLoading(true);
            const result = await PublicService.search({ text: debounced });
            console.log(result);
            if (result.error) {
                setResultSearch([]);
            } else {
                setResultSearch(result);
            }
            setLoading(false);
        };
        fetchApi();
    }, [debounced]);
    const handleOnInput = (e) => {
        setValue(e.target.value);
    };
    const handleClear = () => {
        setValue("");
        inputRef.current?.focus();
    };
    return (
        <div className={cx("wrapper")}>
            <Menu
                hideOnClick={isHide && resultSearch.length > 0}
                onClickHide={setIsHide}
                title="Kết Quả Tìm Kiếm"
                items={resultSearch}
                isArrow={false}
                large
                isImage
                isPrice
            >
                <div className={cx("search")}>
                    <label htmlFor="search">
                        <input
                            ref={inputRef}
                            value={value}
                            id="search"
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm"
                            onInput={(e) => handleOnInput(e)}
                            onFocus={() => setIsHide(true)}
                            autoSave="off"
                            autoComplete="off"
                        />
                    </label>
                    {!!value && !loading && (
                        <button
                            className={cx("btn_clear", loading)}
                            onClick={() => handleClear()}
                        >
                            <TiDeleteOutline />
                        </button>
                    )}
                    {loading && (
                        <span className={cx("loading")}>
                            <FiLoader />
                        </span>
                    )}
                    <button className={cx("btn_search")}>
                        <IoIosSearch />
                    </button>
                </div>
            </Menu>
        </div>
    );
}

export default Search;
