import Header from "../../Components/Header/index";
import Footer from "../../Components/Footer/index";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../Components/services/apiServices";
import Accountsidebar from "./accountsidebar";


const Helpsupport = () => {
  const navigate = useNavigate();
  const [settingsData, setSettingsData] = useState("");
  const didMountRef = useRef(true);

  useEffect(() => {
    if (didMountRef.current) {
      HelpSupportData();
    }
    didMountRef.current = false;
  });

  const HelpSupportData = () => {
    ApiService.fetchData("settingsdata").then((res) => {
      if (res.status == "success") {
        setSettingsData(res.sitesettings);
      }
    });
  };

  const redirectToEmail = (e) => {
    e.preventDefault();
    let email = settingsData?.admin_support_email;
    if (email !== "") {
      window.location.href = `mailto:${email}`;
    }
  };
  const phoneNumber = settingsData?.admin_support_mobile
    ? settingsData?.admin_support_mobile
    : "";

  const redirectToPhoneCall = (e) => {
    e.preventDefault();
    if (phoneNumber !== "") {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <>
      <BrowserView>
        <Header></Header>
        <section className="spaced-section">
        <div className="container">
          <nav
            className="breadcrumb"
            role="navigation"
            aria-label="breadcrumbs"
            style={{ justifyContent: "flex-start" }}
          >
            <a href="/" title="Home" className="link-hover-line">
              Home
            </a>
            <div className="breadcrumb__delimiter">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-breadcrumbs"
              >
                <path
                  d="M1.25 1.5L4.75 5L1.25 8.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="square"
                ></path>
              </svg>
            </div>
            <a href="/account" title="Account" className="link-hover-line">
              Account
            </a>
            <div className="breadcrumb__delimiter">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-breadcrumbs"
              >
                <path
                  d="M1.25 1.5L4.75 5L1.25 8.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="square"
                ></path>
              </svg>
            </div>
            <span>Help & Support </span>
          </nav>
        </div>
    </section>
        <section className="spaced-section customer-section">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                {/* <Accountsidebar></Accountsidebar> */}
                <div className="account-block">
                  <div className="account-block__header">
                    <h2>Help & Support</h2>
                  </div>

                  <div className="account-item account-item-orders">
                    <img
                      className="img-fluid mb-2"
                      src="/img/support-img.png"
                      style={{ width: "200px" }}
                    ></img>
                    <h6 className="customer--small-heading account-item__title small-text customer--small-text">
                      How can we help you today?
                    </h6>
                    <div className="account-none account-none-order">
                      <p className="account-none-text">
                        Our customer service team will be able to assist you
                        with any order or query
                      </p>
                    </div>
                    <div className="macc-list">
                      <ul>
                        <li>
                          <a
                            onClick={(e) => {
                              redirectToEmail(e);
                            }}
                          >
                            <div className="macc-list-icon">
                              <img src="/img/mail.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Email Us</p>
                              <span className="tx-color-02 tx-11">
                                Write to BYBV directly for any query
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={(e) => {
                              redirectToPhoneCall(e);
                            }}
                          >
                            <div className="macc-list-icon">
                              <img src="/img/contact.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Call Us</p>
                              <span className="tx-color-02 tx-11">
                                Get in touch and we will be happy to help you
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            href={
                              "https://wa.me/" + settingsData?.admin_support_mobile
                            }
                            target="new"
                          >
                            <div className="macc-list-icon">
                              <img src="/img/whatsapp.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Whatsapp</p>
                              <span className="tx-color-02 tx-11">
                                Get in touch and we will be happy to help you
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </BrowserView>

      <MobileView>
        <Header></Header>
        <section className="spaced-section customer-section">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                <Accountsidebar></Accountsidebar>
                <div className="account-block">
                  <div className="account-block__header">
                    <h2>Help & Support</h2>
                  </div>

                  <div className="account-item account-item-orders">
                    <img
                      className="img-fluid mb-2"
                      src="/img/support-img.png"
                      style={{ width: "200px" }}
                    ></img>
                    <h6 className="customer--small-heading account-item__title small-text customer--small-text">
                      How can we help you today?
                    </h6>
                    <div className="account-none account-none-order">
                      <p className="account-none-text">
                        Our customer service team will be able to assist you
                        with any order or query
                      </p>
                    </div>
                    <div className="macc-list">
                      <ul>
                        <li>
                          <a
                            onClick={(e) => {
                              redirectToEmail(e);
                            }}
                          >
                            <div className="macc-list-icon">
                              <img src="/img/mail.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Email Us</p>
                              <span className="tx-color-02 tx-11">
                                Write to BYBV directly for any query
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={(e) => {
                              redirectToPhoneCall(e);
                            }}
                          >
                            <div className="macc-list-icon">
                              <img src="/img/contact.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Call Us</p>
                              <span className="tx-color-02 tx-11">
                                Get in touch and we will be happy to help you
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            href={
                              "https://wa.me/" + settingsData?.admin_support_mobile
                            }
                            target="new"
                          >
                            <div className="macc-list-icon">
                              <img src="/img/whatsapp.png"></img>
                            </div>
                            <div>
                              <p className="mb-0">Whatsapp</p>
                              <span className="tx-color-02 tx-11">
                                Get in touch and we will be happy to help you
                              </span>
                            </div>
                            <i className="d-icon-angle-right"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer></Footer>
      </MobileView>
     
    </>
  );
};
export default Helpsupport;
