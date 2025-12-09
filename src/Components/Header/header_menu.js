import React, { useEffect, useState, useRef } from "react";
import { ApiService } from "../services/apiServices";
import Skeleton from "react-loading-skeleton";
import {useLocation } from "react-router-dom";
function HeaderMenu() {
  const [menudata, setmenudata] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imgurl, setImgurl] = useState("");
  const didMountRef = useRef(true);

  useEffect(() => {
    if (didMountRef.current) {
      setLoading(true);
      // ApiService.fetchData("menu-list").then((res) => {
      //   if (res?.status == "success") {
      //     setmenudata(res?.data);
      //     setImgurl(res?.menuUrl);
      //     setLoading(false);
      //   }
      // })
      ApiService.fetchData("menu-list")
  .then((res) => {
    if (res?.status == "success") {
      setmenudata(res?.data);
      setImgurl(res?.menuUrl);
      setLoading(false);
    } else {
      // Handle other statuses if needed
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
    }
    didMountRef.current = false;
  }, []);
  const location = useLocation();
  return (
    <>
      {loading == false && menudata?.length > 0 ? (
        <>
          <nav className="header__nav">
            <ul className="header__list list-unstyled">
              {menudata?.map((items, index) => {
                return (
                  <React.Fragment key={index}>
                    {/* <li className="have-submenu" data-hover-opacity="1"> */}
                    <li className="have-submenu" data-hover-opacity="1">
                      <a
                      className={location.pathname === items?.url ? "unstyled-link header-menu-trigger header-mega-menu-trigger active" : "unstyled-link header-menu-trigger header-mega-menu-trigger"}
                        href={items?.url}
                      >
                        {items?.menu_name}
                        {items?.children?.length > 0 ? (
                          <>
                            <svg
                              className="icon icon-filter-two"
                              width="12"
                              height="7"
                              viewBox="0 0 12 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              tabIndex="-1"
                            >
                              <path
                                d="M10 1.5L6 5.5L2 1.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="square"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          ""
                        )}
                      </a>
                      {items?.children?.length > 0 &&
                      items?.mega_menu == 1 &&
                      items?.show_image == 0 ? (
                        <>
                          <div className="header-mega-menu color-background-1">
                            <div className="container">
                              <div className="header-mega-menu__wrapper">
                                <ul className="header-mega-menu__no-submenu__list list-unstyled">
                                  <li>
                                    <a
                                      href="/collections/all"
                                      className="unstyled-link h4 hover-opacity"
                                    >
                                      SHOP ALL
                                    </a>
                                  </li>
                                </ul>

                                <ul className="header-mega-menu__have-submenu__list list-unstyled">
                                  {items?.children?.map(
                                    (childitem, childindex) => {
                                      return (
                                        <React.Fragment key={childindex}>
                                          <li>
                                            <a
                                              href={childitem?.url}
                                              className={location.pathname === childitem?.url ? "unstyled-link header-menu-trigger h4 active" : "unstyled-link header-menu-trigger h4"}
                                            >
                                              <p
                                                onMouseEnter={() =>
                                                  setActiveIndex(childindex)
                                                }
                                              >
                                                {childitem?.menu_name}
                                              </p>
                                            </a>
                                            {childitem?.children?.length > 0 ? (
                                              <>
                                                <ul className="header-mega-menu__have-submenu__list-submenu list-unstyled">
                                                  {childitem?.children
                                                    // ?.slice(0, 3)
                                                    ?.map(
                                                      (child_items, index) => {
                                                        return (
                                                          <React.Fragment
                                                            key={index}
                                                          >
                                                            <li className="">
                                                              <a
                                                                href={
                                                                  child_items?.url
                                                                }
                                                                className="unstyled-link hover-opacity"
                                                              >
                                                                {
                                                                  child_items?.menu_name
                                                                }
                                                              </a>
                                                            </li>

                                                            {child_items
                                                              ?.children
                                                              ?.length > 0 ? (
                                                              <>
                                                                <ul className="header-mega-menu__have-submenu__list-submenu list-unstyled">
                                                                  {child_items?.children?.map(
                                                                    (
                                                                      child3,
                                                                      child3index
                                                                    ) => {
                                                                      return (
                                                                        <React.Fragment
                                                                          key={
                                                                            child3index
                                                                          }
                                                                        >
                                                                          <li className="">
                                                                            <a
                                                                              href={
                                                                                child3?.url
                                                                              }
                                                                              className="unstyled-link hover-opacity"
                                                                            >
                                                                              {
                                                                                child3?.menu_name
                                                                              }
                                                                            </a>
                                                                          </li>
                                                                        </React.Fragment>
                                                                      );
                                                                    }
                                                                  )}
                                                                </ul>
                                                              </>
                                                            ) : (
                                                              ""
                                                            )}
                                                          </React.Fragment>
                                                        );
                                                      }
                                                    )}
                                                 
                                                </ul>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </li>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </ul>
                                {items?.children[0]?.show_image == 1 ? (
                                  <>
                                    <div
                                      className={` header-mega-menu__card color-background-4 quickview--hover  collection-product-card image-item `}
                                    >
                                      <div className="card-wrapper  js-color-swatches-wrapper">
                                        <span className="visually-hidden">
                                          BCAA+EAA - WATERMELON
                                        </span>
                                        <div
                                          className="card card--product"
                                          tabIndex={-1}
                                        >
                                          <div className="card__inner full-unstyled-link">
                                            <div
                                              className="media media--transparent media--portrait media--hover-effect"
                                              style={{ paddingBottom: "120%" }}
                                            >
                                              <img
                                                className="motion-reduce media--first"
                                                src={
                                                  items?.children[0]?.menu_image
                                                    ? imgurl +
                                                      "/" +
                                                      items?.children[0]
                                                        ?.menu_image
                                                    : "/img/deafualtimg.jpg"
                                                }
                                                style={{ objectFit: "cover" }}
                                              ></img>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="card-information">
                                          <div className="card-information__wrapper">
                                            <span className="visually-hidden">
                                              Vendor:
                                            </span>
                                            {/* <div className="caption-with-letter-spacing subtitle"></div> */}
                                            <h3 className="card__title h5">
                                              <a
                                                className="full-unstyled-link"
                                                href={items?.children[0]?.url}
                                                title="Avocado &amp; Shea No Foam Shaving Lotion"
                                              >
                                                {items?.children[0]?.menu_name}
                                              </a>
                                            </h3>
                                            {/* <div className="price ">
                                                                                    <dl><div className="price__regular">
                                                                                        <dt>
                                                                                            <span className="visually-hidden visually-hidden--inline">Regular price</span>
                                                                                        </dt>
                                                                                        <dd>
                                                                                            <span className="price-item price-item--regular">
                                                                                                ₹4500
                                                                                            </span>
                                                                                        </dd>
                                                                                    </div>
                                                                                        <div className="price__sale">
                                                                                            <dt>
                                                                                                <span className="visually-hidden visually-hidden--inline">Sale price</span>
                                                                                            </dt>
                                                                                            <dd>
                                                                                                <span className="price-item price-item--sale">
                                                                                                    ₹6000
                                                                                                </span>
                                                                                            </dd>
                                                                                            <dt className="price__compare">
                                                                                                <span className="visually-hidden visually-hidden--inline">Regular price</span>
                                                                                            </dt>
                                                                                            <dd className="price__compare">
                                                                                                <span className="price-item price-item--regular">
                                                                                                </span>
                                                                                            </dd>
                                                                                            <dd className="card__badge">
                                                                                            </dd>
                                                                                        </div>
                                                                                        <dl className="unit-price caption hidden">
                                                                                            <dt className="visually-hidden">
                                                                                                Unit price
                                                                                            </dt>
                                                                                            <dd>
                                                                                                <span></span>
                                                                                                <span aria-hidden="true">/</span>
                                                                                                <span className="visually-hidden">&nbsp;per&nbsp;</span>
                                                                                                <span>
                                                                                                </span>
                                                                                            </dd>
                                                                                        </dl>
                                                                                    </dl>
                                                                                </div> */}
                                          </div>
                                        </div>
                                        <a
                                          href={items?.children[0]?.url}
                                          className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                          aria-label="Product link"
                                        ></a>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {items?.children?.length > 0 &&
                      items?.mega_menu == 1 &&
                      items?.show_image == 1 ? (
                        <>
                          <div className="header-mega-menu color-background-1">
                            <div className="container">
                              {items?.children?.length > 0 ? (
                                <>
                                  <ul className="header-mega-menu__collection-list list-unstyled">
                                    {items?.children?.map(
                                      (childitem, childindex) => {
                                        return (
                                          <React.Fragment key={childindex}>
                                            <li className="color-background-4 color-border-1">
                                              <a
                                                href={childitem?.url}
                                                className="card-wrapper__link--overlay collection-grid__link"
                                              ></a>
                                              <div className="collection-grid__item">
                                                <div className="collection-grid__image-wrapper">
                                                  <div className="collection-grid__image-block">
                                                    <h3 className="collection-grid__title ">
                                                      <a
                                                        className="full-unstyled-link"
                                                        href={childitem?.url}
                                                      >
                                                        {childitem?.menu_name}
                                                      </a>
                                                    </h3>
                                                    <div className="collection-grid__image-item">
                                                      <img
                                                        src={
                                                          imgurl !== "" &&
                                                          childitem?.menu_image !==
                                                            ""
                                                            ? imgurl +
                                                              "/" +
                                                              childitem?.menu_image
                                                            : "/img/defaultimage.jpg"
                                                        }
                                                        style={{
                                                          objectFit: "cover",
                                                        }}
                                                      ></img>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </li>
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  </ul>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </nav>
        </>
      ) : (
        <>
          <nav className="header__nav">
            <ul className="header__list list-unstyled">
              <li className="have-submenu" data-hover-opacity="1">
                <a className="unstyled-link header-menu-trigger header-mega-menu-trigger">
                  <Skeleton width={55} height={25} count={6} />
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}

export default HeaderMenu;
