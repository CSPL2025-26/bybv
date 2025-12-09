import React, { useState, useEffect, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../services/apiServices";
import localStorageData from "../Elements/utils/localStorageData";
import "react-loading-skeleton/dist/skeleton.css";
import { useLocation } from "react-router-dom";
function Mobilemenu({ mobileSidebarActive }) {
    const didMountRef = useRef(true);
    const dataArray = localStorageData();
    const navigate = useNavigate();
    const [menutxt, setmenutxt] = useState("main");
    const [menudata, setmenudata] = useState([]);
    const [imgurl, setImgurl] = useState("");


    useEffect(() => {
        if (didMountRef.current) {
            getMenuData();

        }
        didMountRef.current = false;
    }, []);

    const getMenuData = () => {
        ApiService.fetchData("menu-list").then((res) => {
            if (res?.status == "success") {
                setmenudata(res?.data);
                setImgurl(res?.menuUrl);
            }
        });
    };
    const location = useLocation();
    return (
        <>
            <div
                className={`header-mobile__menu color-background-4${mobileSidebarActive ? " active" : ""
                    }`}
            >
                <ul className="header-mobile__menu-header list-unstyled">
                    <li
                        className={menutxt == "main" ? "active" : ""}
                        onClick={() => {
                            setmenutxt("main");
                        }}
                    >
                        <a href="#menu-main" className="full-unstyled-link h6">
                            Main
                        </a>
                    </li>

                </ul>


                {menudata?.length > 0 ? (
                    <>
                        <ul className="header-mobile__menus list-unstyled">
                            <li className={menutxt == "main" ? "d-block" : "d-none"} >
                                <ul className="header-mobile__menu-main list-unstyled">
                                    {menudata?.map((childitem, childindex) => {
                                        return (
                                            <React.Fragment key={childindex}>
                                                <li
                                                    // className="have-submenu"
                                                    className={location.pathname === childitem?.url ? "have-submenu active" : "have-submenu"}
                                                    onClick={() => {
                                                        navigate(childitem?.url);
                                                    }}
                                                >
                                                    <details>
                                                        <summary className="h6">
                                                            <span>
                                                                {childitem?.menu_name}
                                                                {childitem?.mega_menu == 1 ? (
                                                                    <>
                                                                        <svg
                                                                            aria-hidden="true"
                                                                            focusable="false"
                                                                            role="presentation"
                                                                            className="icon icon-caret"
                                                                            viewBox="0 0 12 13"
                                                                        >
                                                                            <path
                                                                                d="M6.00012 7.08584L8.47512 4.61084L9.18212 5.31784L6.00012 8.49984L2.81812 5.31784L3.52512 4.61084L6.00012 7.08584Z"
                                                                                fill="currentColor"
                                                                            ></path>
                                                                        </svg>
                                                                    </>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </span>
                                                        </summary>
                                                        {childitem?.children?.length > 0 ? (
                                                            <>
                                                                <ul className="header-mobile__submenu list-unstyled">
                                                                    {childitem?.children?.map(
                                                                        (child_items, child_index) => {
                                                                            return (
                                                                                <>
                                                                                    {!child_items?.children
                                                                                        ?.length > 0 ? (
                                                                                        <React.Fragment key={child_index}>
                                                                                            <li
                                                                                                className=" "

                                                                                            >
                                                                                                <a
                                                                                                    href={
                                                                                                        child_items?.url
                                                                                                    }
                                                                                                    className="unstyled-link"
                                                                                                >
                                                                                                    {
                                                                                                        child_items?.menu_name
                                                                                                    }
                                                                                                </a>
                                                                                            </li>
                                                                                        </React.Fragment>
                                                                                    ) : (
                                                                                        <>
                                                                                            <li className=" have-submenu">
                                                                                                <details>
                                                                                                    <summary>
                                                                                                        <span>
                                                                                                            {
                                                                                                                child_items?.menu_name
                                                                                                            }
                                                                                                            <svg
                                                                                                                aria-hidden="true"
                                                                                                                focusable="false"
                                                                                                                role="presentation"
                                                                                                                className="icon icon-caret"
                                                                                                                viewBox="0 0 12 13"
                                                                                                            >
                                                                                                                <path
                                                                                                                    d="M6.00012 7.08584L8.47512 4.61084L9.18212 5.31784L6.00012 8.49984L2.81812 5.31784L3.52512 4.61084L6.00012 7.08584Z"
                                                                                                                    fill="currentColor"
                                                                                                                ></path>
                                                                                                            </svg>
                                                                                                        </span>
                                                                                                    </summary>
                                                                                                    {child_items
                                                                                                        ?.children
                                                                                                        ?.length > 0 ? (
                                                                                                        <>
                                                                                                            <ul className="header-mobile__submenu header-mobile__submenu-child list-unstyled">
                                                                                                                {child_items?.children
                                                                                                                    ?.slice(
                                                                                                                        0,
                                                                                                                        3
                                                                                                                    )
                                                                                                                    ?.map(
                                                                                                                        (
                                                                                                                            child3_item,
                                                                                                                            child3_index
                                                                                                                        ) => {
                                                                                                                            return (
                                                                                                                                <React.Fragment key={child3_index}>
                                                                                                                                    <li
                                                                                                                                        className=""

                                                                                                                                    >
                                                                                                                                        <a
                                                                                                                                            href={
                                                                                                                                                child3_item?.url
                                                                                                                                            }
                                                                                                                                            className="unstyled-link"
                                                                                                                                        >
                                                                                                                                            {
                                                                                                                                                child3_item?.menu_name
                                                                                                                                            }
                                                                                                                                        </a>
                                                                                                                                    </li>
                                                                                                                                </React.Fragment>
                                                                                                                            );
                                                                                                                        }
                                                                                                                    )}
                                                                                                                {child_items
                                                                                                                    ?.children
                                                                                                                    ?.length >
                                                                                                                    3 ? (
                                                                                                                    <>
                                                                                                                        <li>
                                                                                                                            <a
                                                                                                                                href={
                                                                                                                                    child_items?.url
                                                                                                                                }
                                                                                                                                className="unstyled-link view-all-link"
                                                                                                                            >
                                                                                                                                View
                                                                                                                                All
                                                                                                                            </a>
                                                                                                                            {/* <a href={childitem?.url} className="view-all-link unstyled-link hover-opacity">View All</a> */}
                                                                                                                        </li>
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    ""
                                                                                                                )}
                                                                                                            </ul>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        ""
                                                                                                    )}
                                                                                                </details>
                                                                                            </li>
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        }
                                                                    )}


                                                                </ul>
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </details>
                                                </li>
                                            </React.Fragment>
                                        );
                                    })}
                                </ul>
                            </li>
                            <li className={menutxt == "collections" ? "d-block" : "d-none"}>
                                <ul className="header-mobile__menu-item header-mobile__menu-collection list-unstyled">
                                    {menudata?.map((items, index) => {
                                        return items?.mega_menu === 1 &&
                                            items?.show_image === 1 ? (
                                            <>
                                                {items?.children?.map((childitem, childindex) => {
                                                    return (<>

                                                        <li className="color-background-4" style={{ height: "330px" }}>
                                                            <a className="card-wrapper__link--overlay collection-grid__link" href={childitem?.url}></a>
                                                            <div className="collection-grid__item">
                                                                <div className="collection-grid__image-wrapper">
                                                                    <div className="collection-grid__image-block">
                                                                        <h3 className="collection-grid__title">
                                                                            <a className="full-unstyled-link" href={childitem?.url}>
                                                                                {childitem?.menu_name}
                                                                            </a>
                                                                        </h3>
                                                                        <div className="collection-grid__image-item">
                                                                            <img src={
                                                                                childitem?.menu_image
                                                                                    ? imgurl + "/" + childitem?.menu_image
                                                                                    : "/img/defaultimage.jpg"
                                                                            }
                                                                                alt={childitem?.menu_name} sizes="100vw" style={{ objectFit: 'cover' }}></img>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </>);
                                                })}
                                            </>
                                        ) : null;
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </>
                ) : (
                    ""
                )}
                <ul className="list-unstyled" style={{marginLeft:'23px'}}>
                    <li
                    >
                        <a href="/contact" className="full-unstyled-link h6">
                            Contact
                        </a>
                    </li>

                </ul>


            </div>


        </>
    );
}

export default Mobilemenu;
