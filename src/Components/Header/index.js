import React, { useState, useEffect, useRef, useContext } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import SearchModal from "../Elements/Modals/search_modal";
import CartModal from "../Elements/Modals/cart_modal";
import HeaderMenu from "./header_menu";
import SweetAlert from "react-bootstrap-sweetalert";
import { ApiService } from "../services/apiServices";
import localStorageData from "../Elements/utils/localStorageData";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Mobilemenu from "./mobile_header_menu";
import DataContext from "../Elements/context";
import LoginModal from "../Elements/Modals/login_modal";
import PopUPModal from "../Elements/Modals/pop_up_modal";
import { useCallback } from "react";

function Header() {
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const dataArray = localStorageData();
  const navigate = useNavigate();
  const [usersession, setusersession] = useState(
    localStorage.getItem("USER_SESSION")
  );
  const [selectedtheme, setselectedtheme] = useState("light");
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [popupbannerdata, setpopupbannerdata] = useState({})
  const [searchModalActive, setsearchModalActive] = useState(false);
  const [cartModalActive, setcartModalActive] = useState(false);
  const [mobileSidebarActive, setmobileSidebarActive] = useState(false);
  const [headerData, setHeaderData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const UserTheme = localStorage.getItem("selectedTheme");
    if (UserTheme !== "" && UserTheme !== null) {
      setselectedtheme(UserTheme);
    }
    document.documentElement.setAttribute("data-scheme", selectedtheme);
  }, [selectedtheme]);


  const darkMode = () => {
    localStorage.setItem("selectedTheme", "dark");
    setselectedtheme("dark");
  };
  const lightMode = () => {
    localStorage.setItem("selectedTheme", "light");
    setselectedtheme("light");
  };

  const getuserdata = JSON.parse(localStorage.getItem("USER_SESSION"));
  const cartModalToggle = () => {
    setcartModalActive(!cartModalActive);
  };

  const searchModalToggle = () => {
    setsearchModalActive(!searchModalActive);
  };

  const mobileSidebarToggle = () => {
    setmobileSidebarActive(!mobileSidebarActive);
  };

  const logout = () => {
    setShow(true);
  };

  const Confirm = () => {
    localStorage.removeItem("USER_SESSION");
    localStorage.removeItem("COUPON_SESSION")

    navigate("/");
    window.location.reload();
  };

  const Cancelalert = () => {
    setShow(false);
    window.location.reload();
  };

  const getHeaderData = useCallback(() => {
    ApiService.fetchData("header-data").then((res) => {
      if (res.status == "success") {
        setHeaderData(res.headerMarquee);
      }
    });
    setLoading(true);
    ApiService.fetchData("settingsdata").then((res) => {
      if (res?.status === "success") {
        contextValues.setSettingData(res?.sitesettings);
        contextValues.setSettingImageBaseUrl(res?.setting_image_path);
        setLoading(false);
      }
    });
  });

  const getbannerData = useCallback(() => {
    ApiService.fetchData("popup-banner").then((res) => {
      if (res.status === "success") {
        setpopupbannerdata(res.popupSliderData);
        setImageUrl(res.slider_img_path);
        // setMobilePopup(res.resPopupBannerMobileData);

        if (res.popupSliderData && localStorage.getItem("MODALOPEN") !== "FALSE") {
          contextValues.settogglePopupModal(true)
        } else {
          contextValues.settogglePopupModal(false)
        }

        localStorage.setItem("MODALOPEN", "FALSE");
      } else {
        contextValues.settogglePopupModal(false)
      }
    });
  });

  const cartSessionData = useCallback(() => {
    const dataString = {
      product_id: '',
    };
    ApiService.postData("cartSessionData", dataString).then((res) => {
      if (res.data.status === "success") {
        contextValues.setCartSessionData(res.data.resCartData)
        contextValues.setcartCount(res.data.resCartData.length)
        contextValues.setCartSummary(res.data.cartSummary)
      }
    });
  })

  useEffect(() => {
    if (didMountRef.current) {
      getLocation()
      contextValues.setCartSummary(dataArray['CartSummary'])
      if (localStorage.getItem("USER_SESSION")) {
        cartSessionData();
      } else {
        contextValues.setcartCount(dataArray['CartSession']?.length || 0)
        contextValues.setCartSessionData(dataArray['CartSession']);
        contextValues.setCartSummary(dataArray['CartSummary']);
      }
      getHeaderData();
    }
    didMountRef.current = false;
  }, [getHeaderData, cartSessionData, getbannerData]);

  const loginModal = () => {
    contextValues.setToggleLoginModal(!contextValues.toggleLoginModal)
  }
 
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        // Reverse Geocode API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );

        const data = await response.json(); 
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress("Unable to fetch address");
        }
      },
      (err) => setError(err.message)
    );
  };

  return (
    <>
      <BrowserView>
        {headerData.header_top ? (
          <div className="topheader color-background-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="announcement">{headerData.header_top}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="header-main-section">
          <div className="header-wrapper">
            <header className="header color-background-1">
              <div className="container">
                <div className="header__wrapper header-position-center">
                  <HeaderMenu />
                  {loading ? <> <div className="header__logo__wrapper">
                    <a href="/" className="logo">
                      <Skeleton width={'70'} height={'47'} />
                    </a>
                  </div></> : <> <div className="header__logo__wrapper">
                    <a href="/" className="logo">
                      {contextValues.settingData.logo != "" && contextValues.settingData.logo != undefined ? (
                        <>
                          <img
                            src={contextValues.settingImageBaseUrl + contextValues.settingData.logo}
                            width={70}
                            height={47}
                            alt={contextValues.settingData.logo}
                          ></img>
                        </>
                      ) : (
                        <>
                          <Skeleton width={70} height={47} />
                        </>
                      )}
                    </a>
                  </div></>}

                  <ul className="header__buttons list-unstyled">
                    <li className="header__toggle-scheme hover-opacity">
                      <button
                        onClick={() => {
                          lightMode();
                        }}
                        className="header__toggle-scheme-item header__toggle-scheme-item--light"
                      >
                        <svg
                          className="icon icon-light-mode"
                          width="20"
                          height="20"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 13C7.30653 13 6.16193 12.5259 5.31802 11.682C4.47411 10.8381 4 9.69347 4 8.5C4 7.30653 4.47411 6.16193 5.31802 5.31802C6.16193 4.47411 7.30653 4 8.5 4C9.69347 4 10.8381 4.47411 11.682 5.31802C12.5259 6.16193 13 7.30653 13 8.5C13 9.69347 12.5259 10.8381 11.682 11.682C10.8381 12.5259 9.69347 13 8.5 13ZM8.5 11.5C9.29565 11.5 10.0587 11.1839 10.6213 10.6213C11.1839 10.0587 11.5 9.29565 11.5 8.5C11.5 7.70435 11.1839 6.94129 10.6213 6.37868C10.0587 5.81607 9.29565 5.5 8.5 5.5C7.70435 5.5 6.94129 5.81607 6.37868 6.37868C5.81607 6.94129 5.5 7.70435 5.5 8.5C5.5 9.29565 5.81607 10.0587 6.37868 10.6213C6.94129 11.1839 7.70435 11.5 8.5 11.5ZM7.75 0.25H9.25V2.5H7.75V0.25ZM7.75 14.5H9.25V16.75H7.75V14.5ZM2.13625 3.19675L3.19675 2.13625L4.7875 3.727L3.727 4.7875L2.13625 3.1975V3.19675ZM12.2125 13.273L13.273 12.2125L14.8638 13.8032L13.8032 14.8638L12.2125 13.273ZM13.8032 2.1355L14.8638 3.19675L13.273 4.7875L12.2125 3.727L13.8032 2.13625V2.1355ZM3.727 12.2125L4.7875 13.273L3.19675 14.8638L2.13625 13.8032L3.727 12.2125ZM16.75 7.75V9.25H14.5V7.75H16.75ZM2.5 7.75V9.25H0.25V7.75H2.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          darkMode();
                        }}
                        className="header__toggle-scheme-item header__toggle-scheme-item--dark"
                      >
                        <svg
                          className="icon icon-dark-mode"
                          width="20"
                          height="20"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 3.75C5.99985 4.79298 6.31035 5.81237 6.89192 6.67816C7.47348 7.54395 8.29975 8.2169 9.26533 8.61118C10.2309 9.00546 11.2921 9.1032 12.3134 8.89194C13.3348 8.68068 14.2701 8.16999 15 7.425V7.5C15 11.6423 11.6423 15 7.5 15C3.35775 15 0 11.6423 0 7.5C0 3.35775 3.35775 0 7.5 0H7.575C7.07553 0.488344 6.67886 1.07172 6.40836 1.71576C6.13786 2.3598 5.99902 3.05146 6 3.75ZM1.5 7.5C1.49945 8.83873 1.94665 10.1392 2.77042 11.1945C3.59419 12.2497 4.74723 12.9992 6.04606 13.3236C7.34489 13.648 8.71491 13.5287 9.93813 12.9847C11.1614 12.4407 12.1675 11.5033 12.7965 10.3215C11.6771 10.5852 10.5088 10.5586 9.40262 10.244C8.29639 9.92951 7.28888 9.33756 6.47566 8.52434C5.66244 7.71112 5.07048 6.70361 4.75596 5.59738C4.44144 4.49116 4.41477 3.32292 4.6785 2.2035C3.71818 2.7151 2.91509 3.47825 2.35519 4.41123C1.7953 5.34422 1.49968 6.41191 1.5 7.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
                    </li>
                    <li className="header__search">
                      <a
                        href="#"
                        onClick={searchModalToggle}
                        className="unstyled-link hover-opacity search-modal-trigger"
                        data-drawer-trigger="#search-draver"
                        aria-label="search"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-search"
                        >
                          <path
                            d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M16.4434 16.4438L20.9996 21.0001"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        Search
                      </a>
                    </li>
                    <li className="header__search">
                      <a
                        href="/contact"
                        className="unstyled-link hover-opacity search-modal-trigger"
                        data-drawer-trigger="#search-draver"
                        aria-label="search"
                      >
                        Contact
                      </a>
                    </li>
                    <li className="header__account">
                      <details-disclosure className="header__account">
                        <details open="">
                          <summary
                            className="header__icon header__icon--account header__icon--summary focus-inset modal__toggle hover-opacity"
                            aria-haspopup="dialog"
                            role="button"
                          >
                            Account
                          </summary>
                          {getuserdata ? (
                            <>
                              <div
                                className="header__account-modal modal__toggle"
                                role="dialog"
                                aria-modal="true"
                              >
                                {usersession ? (
                                  <>
                                    <div className="header__account__account">
                                      <div className="header__account__name">
                                        {getuserdata?.user_fname}
                                      </div>
                                      <ul className="header__account__body">
                                        <li className="header__account__link">
                                          <a href="/account">Account</a>
                                        </li>
                                        <li className="header__account__link">
                                          <a href="/address">Address Book</a>
                                        </li>
                                      </ul>
                                      <a
                                        className="header__account__logout button button--primary"
                                        onClick={() => {
                                          logout();
                                        }}
                                      >
                                        Log Out
                                      </a>
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="header__account-modal modal__toggle"
                                role="dialog"
                                aria-modal="true"
                              >
                                <a
                                  onClick={(e) => loginModal()}
                                  className="button button--primary header__account__login link  focus-inset"
                                  aria-label="customer login"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-account"
                                    role="presentation"
                                    aria-hidden="true"
                                    focusable="false"
                                  >
                                    <path
                                      d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeMiterlimit="10"
                                    ></path>
                                    <path
                                      d="M2.90625 20.2501C3.82775 18.6537 5.15328 17.328 6.74958 16.4062C8.34588 15.4845 10.1567 14.9993 12 14.9993C13.8433 14.9993 15.6541 15.4845 17.2504 16.4062C18.8467 17.328 20.1722 18.6537 21.0938 20.2501"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                  Log in
                                </a>
                                {/* <a
                                  className="header__account__register link "
                                  href="/register"
                                  aria-label="account register"
                                >
                                  <span>Create Account</span>
                                </a> */}
                              </div>
                            </>
                          )}
                        </details>
                      </details-disclosure>
                    </li>
                    <li className="header__cart-wrapper">
                      <a
                        href="javascript:void(0)"
                        className="header__cart unstyled-link hover-opacity"
                        onClick={cartModalToggle}
                      >
                        Cart (
                        {contextValues.cartCount !== "" && contextValues.cartCount !== null
                          ? contextValues.cartCount
                          : 0}
                        )
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </header>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        {headerData.header_top ? (
          <div className="topheader color-background-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <marquee>
                    <div className="announcement-bar__text announcement__title">
                      <div className="announcement__item">
                        <h6>{headerData.header_top}</h6>
                      </div>
                      <div className="announcement__item">
                        <h6>{headerData.header_top}</h6>
                      </div>
                    </div>
                  </marquee>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="header-mobile-section">
          <header className="header-mobile sticky-header color-background-1">
            <div className="header-mobile__header header-mobile-position-center">
              <div className="header-mobile__left">
                <div className="header-mobile__burger-wrraper">
                  <a
                    href="#"
                    className={`header-mobile__burger header-mobile__btn full-unstyled-link${mobileSidebarActive ? " active" : ""
                      }`}
                    onClick={() => {
                      mobileSidebarToggle();
                    }}
                  >
                    <svg
                      className="icon icon-hamburger"
                      focusable="false"
                      width="28"
                      height="22"
                      viewBox="0 0 28 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11H26"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M2 2H26"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M2 20H26"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="icon icon-close"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2L26 26"
                        stroke="currentColor"
                        strokeWidth="3.3"
                      ></path>
                      <path
                        d="M26 2L2 26"
                        stroke="currentColor"
                        strokeWidth="3.3"
                      ></path>
                    </svg>
                  </a>
                </div>

                <a
                  href="#"
                  className="header-mobile__search header-mobile__btn full-unstyled-link  search-modal-trigger "
                  onClick={searchModalToggle}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-search"
                  >
                    <path
                      d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M16.4434 16.4438L20.9996 21.0001"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>

              </div>
              {loading ? <> <div className="header-mobile__logo__wrapper">
                <a href="/" className="logo">
                  <Skeleton width={'50'} height={'37'} />
                </a>
              </div></> : <>
                <div className="header-mobile__logo__wrapper">
                  <a href="/" className="logo">
                    {contextValues.settingData.logo !== "" && contextValues.settingData.logo !== undefined ? (
                      <>
                        <img
                          src={contextValues.settingImageBaseUrl + contextValues.settingData.logo}
                          alt={contextValues.settingData.logo}
                          width={50}
                          height={37}
                        ></img>
                      </>
                    ) : (
                      <>
                        <Skeleton width={'50'} height={'37'} />
                      </>
                    )}
                  </a>
                </div>


              </>}

              <div className="header-mobile__right">
                {usersession ? (
                  <>
                    <a
                      href="/account"
                      className="header-mobile__account header-mobile__btn full-unstyled-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-account"
                        role="presentation"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                        ></path>
                        <path
                          d="M2.90625 20.2501C3.82775 18.6537 5.15328 17.328 6.74958 16.4062C8.34588 15.4845 10.1567 14.9993 12 14.9993C13.8433 14.9993 15.6541 15.4845 17.2504 16.4062C18.8467 17.328 20.1722 18.6537 21.0938 20.2501"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      onClick={(e) => loginModal()}
                      className="header-mobile__account header-mobile__btn full-unstyled-link"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-account"
                        role="presentation"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                        ></path>
                        <path
                          d="M2.90625 20.2501C3.82775 18.6537 5.15328 17.328 6.74958 16.4062C8.34588 15.4845 10.1567 14.9993 12 14.9993C13.8433 14.9993 15.6541 15.4845 17.2504 16.4062C18.8467 17.328 20.1722 18.6537 21.0938 20.2501"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </a>
                  </>
                )}

                <a
                  onClick={(e) => {
                    e.preventDefault();
                    cartModalToggle();
                  }}
                  id="cart-icon-bubble-mobile"
                  className="header-mobile__cart header-mobile__btn full-unstyled-link header__cart cart-open-trigger"
                  aria-label="Open cart"
                  role="button"
                  aria-haspopup="dialog"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-cart"
                  >
                    <path
                      d="M19.0567 8H4.94329C4.77137 8.00077 4.60562 8.06125 4.47704 8.17014C4.34845 8.27903 4.26583 8.42888 4.2446 8.59167L3.00444 19.2583C2.99341 19.3513 3.003 19.4454 3.03258 19.5346C3.06217 19.6237 3.11108 19.706 3.17616 19.7759C3.24123 19.8459 3.321 19.902 3.41028 19.9406C3.49957 19.9792 3.59637 19.9994 3.69439 20H20.3056C20.4036 19.9994 20.5004 19.9792 20.5897 19.9406C20.679 19.902 20.7588 19.8459 20.8238 19.7759C20.8889 19.706 20.9378 19.6237 20.9674 19.5346C20.997 19.4454 21.0066 19.3513 20.9956 19.2583L19.7554 8.59167C19.7342 8.42888 19.6515 8.27903 19.523 8.17014C19.3944 8.06125 19.2286 8.00077 19.0567 8V8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M8.5 7C8.5 6.20435 8.86875 5.44129 9.52513 4.87868C10.1815 4.31607 11.0717 4 12 4C12.9283 4 13.8185 4.31607 14.4749 4.87868C15.1313 5.44129 15.5 6.20435 15.5 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <div className="header-mobile__cart-count-bubble">
                    <span aria-hidden="true">
                      {contextValues.cartCount !== "" && contextValues.cartCount !== null
                        ? contextValues.cartCount
                        : 0}
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <div
              className={`animate-bg color-background-4${mobileSidebarActive ? " active" : ""
                }`}
            >
              <img
                className="header-mobile__logo-img header__heading-logo header__heading-logo--overlay show-animate header-mobile__logo"
                src="/img/logo.png"
                width={70}
                height={47}
              />
            </div>
            <Mobilemenu mobileSidebarActive={mobileSidebarActive}></Mobilemenu>
          </header>
        </div>
      </MobileView>
      {cartModalActive == true ? (
        <>
          <CartModal
            cartModalActive={cartModalActive}
            cartModalToggle={cartModalToggle}
          />
        </>
      ) : (
        ""
      )}
      {searchModalActive == true ? (
        <>
          <SearchModal
            searchModalActive={searchModalActive}
            searchModalToggle={searchModalToggle}
          />
        </>
      ) : (
        ""
      )}
      <SweetAlert
        warning
        confirmBtnCssClass="alertpop"
        title={` Are you sure ? You want to Logout From ByBv `}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        show={show}
        onConfirm={Confirm}
        onCancel={Cancelalert}
        btnSize="md"
        showCancel
        cancelBtnBsStyle="danger"
      ></SweetAlert>
      <LoginModal />
      {contextValues.togglePopupModal && <PopUPModal popupbannerdata={popupbannerdata} imageUrl={imageUrl}></PopUPModal>}

    </>
  );
}

export default Header;
