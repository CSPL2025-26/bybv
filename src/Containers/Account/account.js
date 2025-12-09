import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiService } from "../../Components/services/apiServices";
import { useEffect, useState, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { BrowserView, MobileView } from "react-device-detect";
import Accountsidebar from "../../Containers/Account/accountsidebar";
import Skeleton from "react-loading-skeleton";
function Account() {
  const navigate = useNavigate();
  const pathname = window.location.pathname
  const [uerdata, setUserdata] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const didMountRef = useRef(true);
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (didMountRef.current) {
      setLoading(true)
      ApiService.fetchData("get-user-details").then((res) => {
        if (res?.status == "success") {
          setUserdata(res);
          setLoading(false)
        }
        else if (res?.status == "error" && res?.message == "Session expired"){
            localStorage.removeItem("USER_SESSION")
            navigate("/")
            setLoading(false)
        }
      });
    }
    didMountRef.current = false;
  }, []);

  const logout = () => {
    setShow(true);
  };

  const Confirm = () => {
    localStorage.removeItem("USER_SESSION");
    //window.location.reload();
    navigate("/");
  };

  const Cancelalert = () => {
    setShow(false);
  };

  return (
    <>
      {/* <BrowserView> */}
      <Header></Header>
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
          <span>Account</span>
        </nav>
      </div>
      <section className="spaced-section customer-section">
        <div className="customer account">
          <div className="container">
            <div className="account__wrapper">

              <Accountsidebar></Accountsidebar>
              {
                loading == false ? <>
                  <div className="account-block">
                    <div className="account-block__header">
                      <h2>Hello, {uerdata?.userData?.user_fname}</h2>
                    </div>
                    <div className="account-item account-item-info">
                      <div className="account-item__title">
                        <h6 className="customer--small-heading customer--margin-unset small-text customer--small-text">
                          Your Information
                        </h6>
                      </div>
                      <div className="account-item-info__box">
                        <div className="account-item-info__item">
                          <div role="table" className="info-table order-table">
                            <div className="row thead" style={{ marginLeft: '0px' }}>
                              <div className="small-text">Name</div>
                              <div className="small-text">E-mail</div>
                            </div>
                            <div className="row tbody tbody__none-border" style={{ marginLeft: '0px' }}>
                              <span data-label="Name">
                                {uerdata?.userData?.user_fname}
                              </span>
                              <span data-label="E-mail">
                                {uerdata?.userData?.user_email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {uerdata?.userAddress ? (
                      <>
                        <div className="account-item account-item-address">
                          <div className="account-item__title-box account-item__title">
                            <h6 className="customer--small-heading customer--margin-unset small-text customer--small-text">
                              Default Address
                            </h6>
                            <a
                              className="button button--simple customer-address__link"
                              href="/address"
                            >
                              <span className="button-simpl__label">
                                View address
                              </span>
                            </a>
                          </div>
                          <div className="customer-address__list-wrapper">
                            <ul className="customer-address__list customer-address__default">
                              <li className="customer-address__item customer-address__item-name">
                                {uerdata?.userAddress?.ua_fname}{" "}
                                {uerdata?.userAddress?.ua_lname}
                              </li>
                              <li className="customer-address__item">
                                {uerdata?.userAddress?.ua_address_1
                                  ? uerdata?.userAddress?.ua_address_1 + ","
                                  : ""}

                                {uerdata?.userAddress?.ua_area
                                  ? uerdata?.userAddress?.ua_area + ","
                                  : ""}
                                <br />
                                {uerdata?.userAddress?.ua_city_name
                                  ? uerdata?.userAddress?.ua_city_name + ","
                                  : ""}

                                {uerdata?.userAddress?.ua_state_name
                                  ? uerdata?.userAddress?.ua_state_name + ","
                                  : ""}
                                {uerdata?.userAddress?.ua_country_name
                                  ? uerdata?.userAddress?.ua_country_name + ""
                                  : ""}
                                <br />
                                {uerdata?.userAddress?.ua_pincode
                                  ? uerdata?.userAddress?.ua_pincode + ""
                                  : ""}
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </> : <>
                  <div className="account-block">
                    <div className="account-block__header">
                      <Skeleton width={350} height={70}/>
                    </div>
                    <div className="account-item account-item-info">
                      <div className="account-item__title">
                        <h6 className="customer--small-heading customer--margin-unset small-text customer--small-text">
                        <Skeleton width={300}/>
                        </h6>
                      </div>
                      <div className="account-item-info__box">
                        <div className="account-item-info__item">
                          <div role="table" className="info-table order-table">
                            <div className="row thead" style={{ marginLeft: '0px' }}>
                              <div className="small-text"><Skeleton width={200}/></div>
                              <div className="small-text"><Skeleton width={200}/></div>
                            </div>
                            <div className="row tbody tbody__none-border" style={{ marginLeft: '0px' }}>
                              <span data-label="Name">
                                <Skeleton width={200}/>
                              </span>
                              <span data-label="E-mail">
                                <Skeleton width={200}/>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {uerdata?.userAddress ? (
                      <>
                        <div className="account-item account-item-address">
                          <div className="account-item__title-box account-item__title">
                            <h6 className="customer--small-heading customer--margin-unset small-text customer--small-text">
                              Default Address
                            </h6>
                            <a
                              className="button button--simple customer-address__link"
                              href="/address"
                            >
                              <span className="button-simpl__label">
                                View address
                              </span>
                            </a>
                          </div>
                          <div className="customer-address__list-wrapper">
                            <ul className="customer-address__list customer-address__default">
                              <li className="customer-address__item customer-address__item-name">
                                {uerdata?.userAddress?.ua_fname}{" "}
                                {uerdata?.userAddress?.ua_lname}
                              </li>
                              <li className="customer-address__item">
                                {uerdata?.userAddress?.ua_address_1
                                  ? uerdata?.userAddress?.ua_address_1 + ","
                                  : ""}

                                {uerdata?.userAddress?.ua_area
                                  ? uerdata?.userAddress?.ua_area + ","
                                  : ""}
                                <br />
                                {uerdata?.userAddress?.ua_city_name
                                  ? uerdata?.userAddress?.ua_city_name + ","
                                  : ""}

                                {uerdata?.userAddress?.ua_state_name
                                  ? uerdata?.userAddress?.ua_state_name + ","
                                  : ""}
                                {uerdata?.userAddress?.ua_country_name
                                  ? uerdata?.userAddress?.ua_country_name + ""
                                  : ""}
                                <br />
                                {uerdata?.userAddress?.ua_pincode
                                  ? uerdata?.userAddress?.ua_pincode + ""
                                  : ""}
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              }

            </div>
          </div>
        </div>
      </section>

      {/* </BrowserView> */}



      <Footer></Footer>
    </>
  );
}

export default Account;
