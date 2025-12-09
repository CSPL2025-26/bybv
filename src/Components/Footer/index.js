import React, { useEffect, useRef, useState, useContext } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../services/apiServices";
import { showToast } from "../Elements/utils/toastUtils";
import HomeShipping from "../Elements/sections/home_shipping";
import DataContext from "../Elements/context";
function Footer() {
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const [footerData, setFooterData] = useState({});
  const [footer1, setFooter1] = useState("");
  const [footer2, setFooter2] = useState("");
  const [footer3, setFooter3] = useState("");
  const [footer4, setFooter4] = useState(""); 
  const [newsletterDetails, setNewsletterDetails] = useState({
    newsletter_email: "",
  });

  useEffect(() => {
    if (didMountRef.current) {
      getFooterData();
    }
    didMountRef.current = false;
  }, []);
  const getFooterData = () => {
    ApiService.fetchData("footer").then((res) => {
      if (res.status === "success") {
        setFooterData(res?.footerIdData);
        setFooter1(res?.footerIdData.footer_desc1);
        setFooter2(res?.footerIdData.footer_desc2);
        setFooter3(res?.footerIdData.footer_desc3);
        setFooter4(res?.footerIdData.footer_desc4);
      }
    }); 
  };
  function isValidEmail(newsletter_email) {
    return /\S+@\S+\.\S+/.test(newsletter_email);
  }
  const newsPost = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setNewsletterDetails({ ...newsletterDetails, [name]: value });
  };

  
  const newsletterProcess = (e) => {
    e.preventDefault();

    // if (usersession !== null) {
    //   showToast("error", "Email Id already Subscribed");
    //   return false;
    // }
    if (newsletterDetails.newsletter_email === "") {
      showToast("error", "Please Enter Email address");
      return false;
    }
    if (!isValidEmail(newsletterDetails.newsletter_email)) {
      showToast("error", "Please Enter Valid Email address");
      return false;
    }
    const dataString = {
      newsletter_email: newsletterDetails.newsletter_email,
    };

    ApiService.postData("newsletter-process", dataString).then((res) => {
      console.log(res);
      if (res.status === "success") {
        showToast("success", res.message);
        setTimeout(() => {
         window.location.reload()
        }, 2000);
      } else {
        showToast("error", res.message);
      }
    });
  };

  return (
    <>
      {/* <HomeShipping/> */}
      <BrowserView>
        <footer className="footer color-background-1">
          <div className="footer__content-top  section_border_top section_border_bottom">
            <div className="footer__blocks-container container">
              <div className="footer__blocks-wrapper">
                <div className="footer-block footer-block--logo  section_border_right">
                  <a href="/" className="footer-logo">
                    <img
                      src={contextValues.settingData.footer_logo ? contextValues.settingImageBaseUrl + contextValues.settingData.footer_logo : "/img/logo.png"}
                      width={100}
                      alt={contextValues.settingData.footer_logo}
                    ></img>
                  </a>
                  <div
                    className="footer-block-menu__item__text richtext__content"
                    dangerouslySetInnerHTML={{ __html: footer1 }}
                  ></div>
                </div>
                <div className="footer-block footer-block--menu">
                  <h6 className="footer-block__heading">Quick Links</h6>
                  <div dangerouslySetInnerHTML={{ __html: footer2 }}></div>
                </div>
                <div className="footer-block footer-block--menu">
                  <h6 className="footer-block__heading">Useful Links</h6>
                  <div dangerouslySetInnerHTML={{ __html: footer3 }}></div>
                </div>

                <div className="footer__column footer-block footer__column--social">
                  <h6 className="footer-block__heading">Follow Us On</h6>
                  <ul className="footer__list-social list-unstyled list-social">
                    <li className="list-social__item">
                      {contextValues.settingData.instagram_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.instagram_url}
                            className="link footer--button link--text list-social__link"
                            target="_blank"
                          >
                            <svg
                              viewBox="0 0 18 18"
                              className="icon icon-instagram"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0013 0.736328C11.2655 0.736328 11.548 0.744661 12.4363 0.786328C13.3238 0.827995 13.928 0.967162 14.4596 1.17383C15.0096 1.38549 15.473 1.67216 15.9363 2.13466C16.36 2.55124 16.6879 3.05515 16.8971 3.61133C17.103 4.14216 17.243 4.74716 17.2846 5.63466C17.3238 6.52299 17.3346 6.80549 17.3346 9.06966C17.3346 11.3338 17.3263 11.6163 17.2846 12.5047C17.243 13.3922 17.103 13.9963 16.8971 14.528C16.6885 15.0845 16.3606 15.5885 15.9363 16.0047C15.5196 16.4283 15.0157 16.7561 14.4596 16.9655C13.9288 17.1713 13.3238 17.3113 12.4363 17.353C11.548 17.3922 11.2655 17.403 9.0013 17.403C6.73714 17.403 6.45464 17.3947 5.5663 17.353C4.6788 17.3113 4.07464 17.1713 3.54297 16.9655C2.98657 16.7567 2.48257 16.4288 2.0663 16.0047C1.64247 15.5881 1.31458 15.0842 1.10547 14.528C0.898802 13.9972 0.759635 13.3922 0.717969 12.5047C0.678802 11.6163 0.667969 11.3338 0.667969 9.06966C0.667969 6.80549 0.676302 6.52299 0.717969 5.63466C0.759635 4.74633 0.898802 4.14299 1.10547 3.61133C1.314 3.05481 1.64197 2.55076 2.0663 2.13466C2.48269 1.71069 2.98666 1.38277 3.54297 1.17383C4.07464 0.967162 4.67797 0.827995 5.5663 0.786328C6.45464 0.747161 6.73714 0.736328 9.0013 0.736328ZM9.0013 4.90299C7.89623 4.90299 6.83643 5.34198 6.05502 6.12338C5.27362 6.90478 4.83464 7.96459 4.83464 9.06966C4.83464 10.1747 5.27362 11.2345 6.05502 12.0159C6.83643 12.7973 7.89623 13.2363 9.0013 13.2363C10.1064 13.2363 11.1662 12.7973 11.9476 12.0159C12.729 11.2345 13.168 10.1747 13.168 9.06966C13.168 7.96459 12.729 6.90478 11.9476 6.12338C11.1662 5.34198 10.1064 4.90299 9.0013 4.90299V4.90299ZM14.418 4.69466C14.418 4.41839 14.3082 4.15344 14.1129 3.95809C13.9175 3.76274 13.6526 3.65299 13.3763 3.65299C13.1 3.65299 12.8351 3.76274 12.6397 3.95809C12.4444 4.15344 12.3346 4.41839 12.3346 4.69466C12.3346 4.97093 12.4444 5.23588 12.6397 5.43123C12.8351 5.62658 13.1 5.73633 13.3763 5.73633C13.6526 5.73633 13.9175 5.62658 14.1129 5.43123C14.3082 5.23588 14.418 4.97093 14.418 4.69466ZM9.0013 6.56966C9.66434 6.56966 10.3002 6.83305 10.7691 7.30189C11.2379 7.77073 11.5013 8.40662 11.5013 9.06966C11.5013 9.7327 11.2379 10.3686 10.7691 10.8374C10.3002 11.3063 9.66434 11.5697 9.0013 11.5697C8.33826 11.5697 7.70238 11.3063 7.23353 10.8374C6.76469 10.3686 6.5013 9.7327 6.5013 9.06966C6.5013 8.40662 6.76469 7.77073 7.23353 7.30189C7.70238 6.83305 8.33826 6.56966 9.0013 6.56966V6.56966Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="footer-links_mobile-hidden">
                              Instagram
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                    <li className="list-social__item">
                      {contextValues.settingData.facebook_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.facebook_url}
                            className="link footer--button link--text list-social__link"
                            target="_blank"
                          >
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                role="presentation"
                                className="icon icon-facebook"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 0C5.373 0 0 5.373 0 12c0 5.998 4.37 10.98 10.062 11.89v-8.346H7.094V12h2.968V9.579c0-2.935 1.75-4.565 4.423-4.565 1.28 0 2.648.228 2.648.228v2.92h-1.492c-1.47 0-1.932.912-1.932 1.85V12h3.298l-.528 3.545h-2.77V24c5.765-.91 10.062-6.188 10.062-12.89C24 5.373 18.627 0 12 0"
                                ></path>
                              </svg>
                            <span className="footer-links_mobile-hidden">
                              Facebook
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                    {/* <li className="list-social__item">
                      {contextValues.settingData.vimeo_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.vimeo_url}
                            className="link footer--button link--text list-social__link"
                            target="_blank"
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              role="presentation"
                              className="icon icon-vimeo"
                              viewBox="0 0 100 87"
                            >
                              <path
                                fillRule="evenodd"
                                d="M100 20.4c-.5 9.7-7.3 23-20.4 40C66 78.1 54.5 87 45 87c-5.8 0-10.7-5.4-14.7-16.2l-8.1-29.6C19.2 30.4 16 25 12.6 25c-.8 0-3.4 1.6-7.9 4.7l-4.7-6 14.6-13c6.6-5.8 11.5-8.8 14.8-9C37.2.8 42 6.1 43.8 17.5c2 12.3 3.3 20 4 23 2.3 10.2 4.7 15.3 7.4 15.3 2.1 0 5.3-3.3 9.5-10a39.2 39.2 0 006.7-15c.6-5.8-1.7-8.7-6.7-8.7-2.4 0-4.9.6-7.4 1.7C62.2 7.7 71.6-.1 85.4.4c10.3.3 15.1 7 14.6 20"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="footer-links_mobile-hidden">
                              Vimeo
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li> */}
                  </ul>
                </div>
                <div className="footer-block footer-block--newsletter newsletter__form section_border_left ">
                  <h4 className="newsletter__title title--section title--section-m-none">
                    <p>Join our newsletter</p>
                  </h4>
                  <form className="newsletter-form">
                    <div className="newsletter-form__inner">
                      <div className="newsletter-form__field-wrapper">
                        <div className="field">
                          <input
                            type="email"
                            className="field__input field"
                            placeholder=""
                            name="newsletter_email"
                            onChange={(e) => {
                              newsPost(e);
                            }}
                          ></input>
                          <label className="field__label" type="hidden">
                            E-mail
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="footer-newsletter__button button button--primary"
                        name="commit"
                        onClick={(e) => {
                          newsletterProcess(e);
                        }}
                      >
                        Subscribe
                        <span>
                          <svg
                            className="icon icon-button-arrow"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_2071_16434)">
                              <path
                                d="M2.24268 12.2427L12.1422 2.34326"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="square"
                              ></path>
                              <path
                                d="M4.36377 1.63617H12.8491V10.1215"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="square"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_2071_16434">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="currentColor"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__content-middle">
            <div className="container">
              <div className="footer__content-middle-container">
                <div className="footer__content-middle-main">
                  <div className="footer__column footer__column--payment">
                    <div className="footer__payment">
                      <ul className="list list-payment">
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-visa"
                          >
                            <title id="pi-visa">Visa</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                              fill="#142688"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-master"
                          >
                            <title id="pi-master">Mastercard</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <circle
                              fill="#EB001B"
                              cx="15"
                              cy="12"
                              r="7"
                            ></circle>
                            <circle
                              fill="#F79E1B"
                              cx="23"
                              cy="12"
                              r="7"
                            ></circle>
                            <path
                              fill="#FF5F00"
                              d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            viewBox="0 0 38 24"
                            width="38"
                            height="24"
                            aria-labelledby="pi-american_express"
                          >
                            <title id="pi-american_express">
                              American Express
                            </title>
                            <g fill="none">
                              <path
                                fill="#000"
                                d="M35,0 L3,0 C1.3,0 0,1.3 0,3 L0,21 C0,22.7 1.4,24 3,24 L35,24 C36.7,24 38,22.7 38,21 L38,3 C38,1.3 36.6,0 35,0 Z"
                                opacity=".07"
                              ></path>
                              <path
                                fill="#006FCF"
                                d="M35,1 C36.1,1 37,1.9 37,3 L37,21 C37,22.1 36.1,23 35,23 L3,23 C1.9,23 1,22.1 1,21 L1,3 C1,1.9 1.9,1 3,1 L35,1"
                              ></path>
                              <path
                                fill="#FFF"
                                d="M8.971,10.268 L9.745,12.144 L8.203,12.144 L8.971,10.268 Z M25.046,10.346 L22.069,10.346 L22.069,11.173 L24.998,11.173 L24.998,12.412 L22.075,12.412 L22.075,13.334 L25.052,13.334 L25.052,14.073 L27.129,11.828 L25.052,9.488 L25.046,10.346 L25.046,10.346 Z M10.983,8.006 L14.978,8.006 L15.865,9.941 L16.687,8 L27.057,8 L28.135,9.19 L29.25,8 L34.013,8 L30.494,11.852 L33.977,15.68 L29.143,15.68 L28.065,14.49 L26.94,15.68 L10.03,15.68 L9.536,14.49 L8.406,14.49 L7.911,15.68 L4,15.68 L7.286,8 L10.716,8 L10.983,8.006 Z M19.646,9.084 L17.407,9.084 L15.907,12.62 L14.282,9.084 L12.06,9.084 L12.06,13.894 L10,9.084 L8.007,9.084 L5.625,14.596 L7.18,14.596 L7.674,13.406 L10.27,13.406 L10.764,14.596 L13.484,14.596 L13.484,10.661 L15.235,14.602 L16.425,14.602 L18.165,10.673 L18.165,14.603 L19.623,14.603 L19.647,9.083 L19.646,9.084 Z M28.986,11.852 L31.517,9.084 L29.695,9.084 L28.094,10.81 L26.546,9.084 L20.652,9.084 L20.652,14.602 L26.462,14.602 L28.076,12.864 L29.624,14.602 L31.499,14.602 L28.987,11.852 L28.986,11.852 Z"
                              ></path>
                            </g>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            width="38"
                            height="24"
                            role="img"
                            aria-labelledby="pi-paypal"
                          >
                            <title id="pi-paypal">PayPal</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              fill="#003087"
                              d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                            ></path>
                            <path
                              fill="#3086C8"
                              d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                            ></path>
                            <path
                              fill="#012169"
                              d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-diners_club"
                          >
                            <title id="pi-diners_club">Diners Club</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z"
                              fill="#3086C8"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            width="38"
                            height="24"
                            role="img"
                            aria-labelledby="pi-discover"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title id="pi-discover">Discover</title>
                            <path
                              fill="#000"
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z"
                              fill="#fff"
                            ></path>
                            <path
                              d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                              fill="url(#pi-paint0_linear)"
                            ></path>
                            <path
                              opacity=".65"
                              d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                              fill="url(#pi-paint1_linear)"
                            ></path>
                            <path
                              d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z"
                              fill="#F48120"
                            ></path>
                            <defs>
                              <linearGradient
                                id="pi-paint0_linear"
                                x1="21.657"
                                y1="12.275"
                                x2="19.632"
                                y2="9.104"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#F89F20"></stop>
                                <stop offset=".25" stopColor="#F79A20"></stop>
                                <stop offset=".533" stopColor="#F68D20"></stop>
                                <stop offset=".62" stopColor="#F58720"></stop>
                                <stop offset=".723" stopColor="#F48120"></stop>
                                <stop offset="1" stopColor="#F37521"></stop>
                              </linearGradient>
                              <linearGradient
                                id="pi-paint1_linear"
                                x1="21.338"
                                y1="12.232"
                                x2="18.378"
                                y2="6.446"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#F58720"></stop>
                                <stop offset=".359" stopColor="#E16F27"></stop>
                                <stop offset=".703" stopColor="#D4602C"></stop>
                                <stop offset=".982" stopColor="#D05B2E"></stop>
                              </linearGradient>
                            </defs>
                          </svg>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="footer__copyright">
                    <small className="footer__copyright__content footer__copyright__content-text">
                      © Copyright 2023
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </BrowserView>
      <MobileView>
        <footer className="footer color-background-1">
          <div className="footer__content-top  section_border_top section_border_bottom">
            <div className="footer__blocks-container container">
              <div className="footer__blocks-wrapper">
                <div className="footer-block footer-block--logo  section_border_right">
                  <a href="#" className="footer-logo">
                    <img
                      src={contextValues.settingImageBaseUrl + contextValues.settingData.footer_logo}
                      width={100}
                      alt={contextValues.settingData.footer_logo}
                    ></img>
                  </a>
                  <div
                    className="footer-block-menu__item__text richtext__content"
                    dangerouslySetInnerHTML={{ __html: footer1 }}
                  ></div>
                </div>
                <div className="accordion">
                  <details>
                    <summary>
                      <h6 className="footer-block__heading">Quick Links</h6>
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
                    </summary>
                    <div dangerouslySetInnerHTML={{ __html: footer2 }}></div>
                  </details>
                </div>
                <div className="accordion">
                  <details>
                    <summary>
                      <h6 className="footer-block__heading">Useful Links</h6>
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
                    </summary>
                    <div dangerouslySetInnerHTML={{ __html: footer3 }}></div>
                  </details>
                </div>
                <div className="footer__column footer-block footer__column--social">
                  <h6 className="footer-block__heading">Follow us on</h6>
                  <ul
                    className="footer__list-social list-unstyled list-social"
                    role="list"
                  >
                    <li className="list-social__item">
                      {contextValues.settingData.instagram_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.instagram_url}
                            className="link footer--button link--text list-social__link"
                          >
                            <svg
                              viewBox="0 0 18 18"
                              className="icon icon-instagram"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0013 0.736328C11.2655 0.736328 11.548 0.744661 12.4363 0.786328C13.3238 0.827995 13.928 0.967162 14.4596 1.17383C15.0096 1.38549 15.473 1.67216 15.9363 2.13466C16.36 2.55124 16.6879 3.05515 16.8971 3.61133C17.103 4.14216 17.243 4.74716 17.2846 5.63466C17.3238 6.52299 17.3346 6.80549 17.3346 9.06966C17.3346 11.3338 17.3263 11.6163 17.2846 12.5047C17.243 13.3922 17.103 13.9963 16.8971 14.528C16.6885 15.0845 16.3606 15.5885 15.9363 16.0047C15.5196 16.4283 15.0157 16.7561 14.4596 16.9655C13.9288 17.1713 13.3238 17.3113 12.4363 17.353C11.548 17.3922 11.2655 17.403 9.0013 17.403C6.73714 17.403 6.45464 17.3947 5.5663 17.353C4.6788 17.3113 4.07464 17.1713 3.54297 16.9655C2.98657 16.7567 2.48257 16.4288 2.0663 16.0047C1.64247 15.5881 1.31458 15.0842 1.10547 14.528C0.898802 13.9972 0.759635 13.3922 0.717969 12.5047C0.678802 11.6163 0.667969 11.3338 0.667969 9.06966C0.667969 6.80549 0.676302 6.52299 0.717969 5.63466C0.759635 4.74633 0.898802 4.14299 1.10547 3.61133C1.314 3.05481 1.64197 2.55076 2.0663 2.13466C2.48269 1.71069 2.98666 1.38277 3.54297 1.17383C4.07464 0.967162 4.67797 0.827995 5.5663 0.786328C6.45464 0.747161 6.73714 0.736328 9.0013 0.736328ZM9.0013 4.90299C7.89623 4.90299 6.83643 5.34198 6.05502 6.12338C5.27362 6.90478 4.83464 7.96459 4.83464 9.06966C4.83464 10.1747 5.27362 11.2345 6.05502 12.0159C6.83643 12.7973 7.89623 13.2363 9.0013 13.2363C10.1064 13.2363 11.1662 12.7973 11.9476 12.0159C12.729 11.2345 13.168 10.1747 13.168 9.06966C13.168 7.96459 12.729 6.90478 11.9476 6.12338C11.1662 5.34198 10.1064 4.90299 9.0013 4.90299V4.90299ZM14.418 4.69466C14.418 4.41839 14.3082 4.15344 14.1129 3.95809C13.9175 3.76274 13.6526 3.65299 13.3763 3.65299C13.1 3.65299 12.8351 3.76274 12.6397 3.95809C12.4444 4.15344 12.3346 4.41839 12.3346 4.69466C12.3346 4.97093 12.4444 5.23588 12.6397 5.43123C12.8351 5.62658 13.1 5.73633 13.3763 5.73633C13.6526 5.73633 13.9175 5.62658 14.1129 5.43123C14.3082 5.23588 14.418 4.97093 14.418 4.69466ZM9.0013 6.56966C9.66434 6.56966 10.3002 6.83305 10.7691 7.30189C11.2379 7.77073 11.5013 8.40662 11.5013 9.06966C11.5013 9.7327 11.2379 10.3686 10.7691 10.8374C10.3002 11.3063 9.66434 11.5697 9.0013 11.5697C8.33826 11.5697 7.70238 11.3063 7.23353 10.8374C6.76469 10.3686 6.5013 9.7327 6.5013 9.06966C6.5013 8.40662 6.76469 7.77073 7.23353 7.30189C7.70238 6.83305 8.33826 6.56966 9.0013 6.56966V6.56966Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="footer-links_mobile-hidden">
                              Instagram
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li>

                    <li className="list-social__item">
                      {contextValues.settingData.youtube_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.youtube_url}
                            className="link footer--button link--text list-social__link"
                            aria-describedby="a11y-external-message"
                            aria-label="youtube"
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              role="presentation"
                              className="icon icon-youtube"
                              viewBox="0 0 100 70"
                            >
                              <path
                                d="M98 11c2 7.7 2 24 2 24s0 16.3-2 24a12.5 12.5 0 01-9 9c-7.7 2-39 2-39 2s-31.3 0-39-2a12.5 12.5 0 01-9-9c-2-7.7-2-24-2-24s0-16.3 2-24c1.2-4.4 4.6-7.8 9-9 7.7-2 39-2 39-2s31.3 0 39 2c4.4 1.2 7.8 4.6 9 9zM40 50l26-15-26-15v30z"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="footer-links_mobile-hidden">
                              YouTube
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                    <li className="list-social__item">
                      {contextValues.settingData.instagram_url != null ? (
                        <>
                          <a
                            href={contextValues.settingData.vimeo_url}
                            className="link footer--button link--text list-social__link"
                            aria-describedby="a11y-external-message"
                            aria-label="vimeo"
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              role="presentation"
                              className="icon icon-vimeo"
                              viewBox="0 0 100 87"
                            >
                              <path
                                fillRule="evenodd"
                                d="M100 20.4c-.5 9.7-7.3 23-20.4 40C66 78.1 54.5 87 45 87c-5.8 0-10.7-5.4-14.7-16.2l-8.1-29.6C19.2 30.4 16 25 12.6 25c-.8 0-3.4 1.6-7.9 4.7l-4.7-6 14.6-13c6.6-5.8 11.5-8.8 14.8-9C37.2.8 42 6.1 43.8 17.5c2 12.3 3.3 20 4 23 2.3 10.2 4.7 15.3 7.4 15.3 2.1 0 5.3-3.3 9.5-10a39.2 39.2 0 006.7-15c.6-5.8-1.7-8.7-6.7-8.7-2.4 0-4.9.6-7.4 1.7C62.2 7.7 71.6-.1 85.4.4c10.3.3 15.1 7 14.6 20"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="footer-links_mobile-hidden">
                              Vimeo
                            </span>
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>
                </div>
                <div className="footer-block footer-block--newsletter newsletter__form section_border_left">
                  <h4 className="newsletter__title title--section title--section-m-none">
                    <p>Join our newsletter</p>
                  </h4>
                  <form className="newsletter-form">
                    <div className="newsletter-form__inner">
                      <div className="newsletter-form__field-wrapper">
                        <div className="field">
                          <input
                            type="email"
                            className="field__input field"
                            placeholder=""
                            name="newsletter_email"
                            onChange={(e) => {
                              newsPost(e);
                            }}
                          ></input>
                          <label className="field__label" type="hidden">
                            E-mail
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="footer-newsletter__button button button--primary"
                        name="commit"
                        onClick={(e) => {
                          newsletterProcess(e);
                        }}
                      >
                        Subscribe
                        <span>
                          <svg
                            className="icon icon-button-arrow"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_2071_16434)">
                              <path
                                d="M2.24268 12.2427L12.1422 2.34326"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="square"
                              ></path>
                              <path
                                d="M4.36377 1.63617H12.8491V10.1215"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="square"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_2071_16434">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="currentColor"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__content-middle">
            <div className="container">
              <div className="footer__content-middle-container">
                <div className="footer__content-middle-main">
                  <div className="footer__column footer__column--payment">
                    <div className="footer__payment">
                      <ul className="list list-payment">
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-visa"
                          >
                            <title id="pi-visa">Visa</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                              fill="#142688"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-master"
                          >
                            <title id="pi-master">Mastercard</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <circle
                              fill="#EB001B"
                              cx="15"
                              cy="12"
                              r="7"
                            ></circle>
                            <circle
                              fill="#F79E1B"
                              cx="23"
                              cy="12"
                              r="7"
                            ></circle>
                            <path
                              fill="#FF5F00"
                              d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            viewBox="0 0 38 24"
                            width="38"
                            height="24"
                            aria-labelledby="pi-american_express"
                          >
                            <title id="pi-american_express">
                              American Express
                            </title>
                            <g fill="none">
                              <path
                                fill="#000"
                                d="M35,0 L3,0 C1.3,0 0,1.3 0,3 L0,21 C0,22.7 1.4,24 3,24 L35,24 C36.7,24 38,22.7 38,21 L38,3 C38,1.3 36.6,0 35,0 Z"
                                opacity=".07"
                              ></path>
                              <path
                                fill="#006FCF"
                                d="M35,1 C36.1,1 37,1.9 37,3 L37,21 C37,22.1 36.1,23 35,23 L3,23 C1.9,23 1,22.1 1,21 L1,3 C1,1.9 1.9,1 3,1 L35,1"
                              ></path>
                              <path
                                fill="#FFF"
                                d="M8.971,10.268 L9.745,12.144 L8.203,12.144 L8.971,10.268 Z M25.046,10.346 L22.069,10.346 L22.069,11.173 L24.998,11.173 L24.998,12.412 L22.075,12.412 L22.075,13.334 L25.052,13.334 L25.052,14.073 L27.129,11.828 L25.052,9.488 L25.046,10.346 L25.046,10.346 Z M10.983,8.006 L14.978,8.006 L15.865,9.941 L16.687,8 L27.057,8 L28.135,9.19 L29.25,8 L34.013,8 L30.494,11.852 L33.977,15.68 L29.143,15.68 L28.065,14.49 L26.94,15.68 L10.03,15.68 L9.536,14.49 L8.406,14.49 L7.911,15.68 L4,15.68 L7.286,8 L10.716,8 L10.983,8.006 Z M19.646,9.084 L17.407,9.084 L15.907,12.62 L14.282,9.084 L12.06,9.084 L12.06,13.894 L10,9.084 L8.007,9.084 L5.625,14.596 L7.18,14.596 L7.674,13.406 L10.27,13.406 L10.764,14.596 L13.484,14.596 L13.484,10.661 L15.235,14.602 L16.425,14.602 L18.165,10.673 L18.165,14.603 L19.623,14.603 L19.647,9.083 L19.646,9.084 Z M28.986,11.852 L31.517,9.084 L29.695,9.084 L28.094,10.81 L26.546,9.084 L20.652,9.084 L20.652,14.602 L26.462,14.602 L28.076,12.864 L29.624,14.602 L31.499,14.602 L28.987,11.852 L28.986,11.852 Z"
                              ></path>
                            </g>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            width="38"
                            height="24"
                            role="img"
                            aria-labelledby="pi-paypal"
                          >
                            <title id="pi-paypal">PayPal</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              fill="#003087"
                              d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                            ></path>
                            <path
                              fill="#3086C8"
                              d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                            ></path>
                            <path
                              fill="#012169"
                              d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            width="38"
                            height="24"
                            aria-labelledby="pi-diners_club"
                          >
                            <title id="pi-diners_club">Diners Club</title>
                            <path
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                            ></path>
                            <path
                              d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z"
                              fill="#3086C8"
                            ></path>
                          </svg>
                        </li>
                        <li className="list-payment__item">
                          <svg
                            className="icon icon--full-color"
                            viewBox="0 0 38 24"
                            width="38"
                            height="24"
                            role="img"
                            aria-labelledby="pi-discover"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title id="pi-discover">Discover</title>
                            <path
                              fill="#000"
                              opacity=".07"
                              d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                            ></path>
                            <path
                              d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z"
                              fill="#fff"
                            ></path>
                            <path
                              d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                              fill="url(#pi-paint0_linear)"
                            ></path>
                            <path
                              opacity=".65"
                              d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                              fill="url(#pi-paint1_linear)"
                            ></path>
                            <path
                              d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z"
                              fill="#231F20"
                            ></path>
                            <path
                              d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z"
                              fill="#F48120"
                            ></path>
                            <defs>
                              <linearGradient
                                id="pi-paint0_linear"
                                x1="21.657"
                                y1="12.275"
                                x2="19.632"
                                y2="9.104"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#F89F20"></stop>
                                <stop offset=".25" stopColor="#F79A20"></stop>
                                <stop offset=".533" stopColor="#F68D20"></stop>
                                <stop offset=".62" stopColor="#F58720"></stop>
                                <stop offset=".723" stopColor="#F48120"></stop>
                                <stop offset="1" stopColor="#F37521"></stop>
                              </linearGradient>
                              <linearGradient
                                id="pi-paint1_linear"
                                x1="21.338"
                                y1="12.232"
                                x2="18.378"
                                y2="6.446"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#F58720"></stop>
                                <stop offset=".359" stopColor="#E16F27"></stop>
                                <stop offset=".703" stopColor="#D4602C"></stop>
                                <stop offset=".982" stopColor="#D05B2E"></stop>
                              </linearGradient>
                            </defs>
                          </svg>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="footer__copyright">
                    <small className="footer__copyright__content footer__copyright__content-text">
                      © Copyright 2023
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </MobileView>
    </>
  );
}

export default Footer;
