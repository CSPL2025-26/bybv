import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import { useNavigate } from "react-router-dom";
import Accountsidebar from "./accountsidebar";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

function Orders() {
  const didMountRef = useRef(true);
  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const [Orderlist, setOrderlist] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (didMountRef.current) {
      fetchOrderdetail();
    }
    didMountRef.current = false;
  }, []);
  const fetchOrderdetail = () => {
    setLoading(true);
    ApiService.fetchData("get-order-data").then((res) => {
      if (res?.status == "success") {
        setOrderlist(res?.orderList);
        setLoading(false);
      }
     
      else if (res?.data?.status == "error" ){
      
        localStorage.removeItem("USER_SESSION")
        navigate("/")
        setLoading(false)
    }
    });
  };
  const logout = () => {
    localStorage.removeItem("USER_SESSION");
    localStorage.removeItem('MODALOPEN')
    navigate("/");
  };
  const Orderstataus = (status) => {
    switch (status) {
      case 1:
        return "Confirmed";
        break;
      case 2:
        return "Payment Pending";
        break;
      case 3:
        return "On Hold";
        break;
      case 4:
        return "Delivered";
        break;
      case 5:
        return "Cancelled";
        break;
      case 6:
        return "Shipped";
        break;
      case 7:
        return "Item Picked Up";
        break;

      default:
        return "Order status";
        break;
    }
  };

  return (
    <>
      <BrowserView>
        <Header />
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
            <span>My Orders</span>
          </nav>
        </div>
        <section className="spaced-section customer-section">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                <Accountsidebar></Accountsidebar>
                <div className="account-block">
                  <div className="account-block__header">
                    <h2>My Orders</h2>
                  </div>
                  {loading == false && Orderlist.length > 0 ? (
                    <>
                      <div className="account-item account-item-info ">
                        {Orderlist?.map((items, index) => {
                          return (
                            <React.Fragment key={index}>
                              <div className="order-box">
                                <div className="info">
                                  <div className="info-delivery">
                                    <h6 className="mb-1 tx-14">Delivery Address</h6>
                                    <p className="mb-0 tx-13">
                                      <strong>{items?.trans_user_name}</strong>
                                    </p>
                                    <p className="mb-0 tx-13">
                                      {items?.trans_delivery_address}
                                    </p>
                                    <p className="mb-0 tx-13">
                                      Email Id : {items?.trans_user_email}
                                    </p>
                                    <p className="mb-0 tx-13">
                                      Phone number : {items?.trans_user_mobile}
                                    </p>
                                    {items?.trans_status!==5?<>
                                      <div className="row bs-wizard mt-5">
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 1 ||
                                          items?.trans_status == 7 ||
                                          items?.trans_status == 6 ||
                                          items?.trans_status == 4
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div
                                          className={`bs-wizard-info text-center `}
                                        >
                                          <p className="mb-0">Order Placed</p>
                                          <p className="mb-0 tx-12">
                                            {moment(items?.created_at).format(
                                              "MMM D, YYYY , h:mm:ss a "
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 7 ||
                                          items?.trans_status == 6 ||
                                          items?.trans_status == 4
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div className="bs-wizard-info text-center">
                                          <p className="mb-0">Item Picked Up</p>
                                        </div>
                                      </div>
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 6 ||
                                          items?.trans_status == 4
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div className="bs-wizard-info text-center">
                                          <p className="mb-0">Shipped</p>
                                        </div>
                                      </div>
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 4
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div className="bs-wizard-info text-center">
                                          <p className="mb-0">Delivered</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    
                                    </>:<>
                                    
                                    <div className="row bs-wizard mt-5">
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 1 ||
                                          items?.trans_status == 5 
                                         
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div
                                          className={`bs-wizard-info text-center `}
                                        >
                                          <p className="mb-0">Order Placed</p>
                                          <p className="mb-0 tx-12">
                                            {moment(items?.created_at).format(
                                              "MMM D, YYYY , h:mm:ss a "
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className={`col-3 bs-wizard-step  ${
                                          items?.trans_status == 5 
                                        
                                            ? "complete"
                                            : "disabled"
                                        }`}
                                      >
                                        <div className="progress">
                                          <div className="progress-bar"></div>
                                        </div>
                                        <a href="#" className="bs-wizard-dot"></a>
                                        <div className="bs-wizard-info text-center">
                                          <p className="mb-0">Cancelled</p>
                                        </div>
                                      </div>
                                    
                                    </div>
                                    
                                    
                                    
                                    </>}
                                   
                                   
                                  </div>
                                </div>
                                <div className="bcode">
                                  <div className="orderid-box mb-5">
                                    <h6 className="mb-0">ORDER ID</h6>
                                    <p className="mb-0 tx-13">
                                      {items?.trans_order_number}
                                    </p>
                                  </div>
                                  <p className="tx-color-03 mb-0 tx-13">ORDER ON</p>
                                  <p className="tx-12">
                                    {moment(items?.created_at).format(
                                      "MMM D, YYYY "
                                    )}
                                    <br />
                                    {moment(items?.created_at).format(
                                      "h:mm:ss a"
                                    )}
                                  </p>
                                  <a
                                    href={`/order-detail/${items?.trans_order_number}`}
                                    className="button button--primary "
                                  >
                                    View Details
                                  </a>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {loading == false ? (
                        <>
                          <div className="noimg text-center">
                            <img
                              src="/img/no-orders.webp"
                              className="mb-5"
                              style={{ width: "250px" }}
                            ></img>
                            <h6 className="mb-0">No Order Found</h6>
                            <p>Look! Like you have not ordered yet</p>

                            <button
                              className="button button--primary "
                              type="button"
                              onClick={() => {
                                navigate("/");
                              }}
                            >
                              Order Now
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="order-box">
                          <div className="info">
                            <div className="info-delivery">
                              <Skeleton width={"100%"} height={130} count={3} />
                            </div>
                          </div>
                          <div className="bcode">
                            <Skeleton width={"100%"} height={130} count={3} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </BrowserView>

      <MobileView>
        <Header></Header>
        <div className="container">
          <nav
            className="breadcrumb"
            role="navigation"
            aria-label="breadcrumbs"
            style={{ justifyContent: "flex-start" }}
          >
            <a href="/" title="Home" className="link-hover-line">
              Homes
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
            <span>Orders</span>

          </nav>
        </div>
        <section className="spaced-section customer-section">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                <Accountsidebar></Accountsidebar>
                {loading == false && Orderlist.length > 0 ? (
                  <>
                    <div className="account-block">
                      {Orderlist?.map((items, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="morderbox mb-3">
                              <div className="morderbox-body">
                                <div className="row">
                                  <div className="col-7">
                                    <h6 className="tx-14">
                                      Order Id: {items?.trans_order_number}
                                    </h6>
                                    <p className="mb-0 tx-13">
                                      Total Amount: ₹{items?.trans_amt}
                                    </p>
                                    <p className="mb-0 tx-13 tx-color-03">
                                      Items: {items?.itemscount}
                                    </p>
                                  </div>
                                  <div className="col-5 tx-right">
                                    <p className="mb-0 tx-13 tx-color-03">
                                      Placed On
                                    </p>
                                    <p className="mb-0 tx-12 tx-color-03">
                                      {moment(items?.created_at).format(
                                        "MMM D, YYYY "
                                      )}
                                      <br />
                                      {moment(items?.created_at).format(
                                        "h:mm:ss a"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="morderbox-footer">
                                <div className="morderbox-status bg-light-yellow">
                                  {" "}
                                  {Orderstataus(items?.trans_status)}
                                </div>
                                <div className="morderbox-link">
                                  <a
                                    href={`/order-detail/${items?.trans_order_number}`}
                                  >
                                    View Details
                                    <i className="d-icon-arrow-right"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {loading == false ? (
                      <>
                        <div className="noimg text-center">
                          <img
                            src="/img/no-orders.webp"
                            className="mb-5"
                            style={{ width: "250px" }}
                          ></img>
                          <h6 className="mb-0">No Order Found</h6>
                          <p>Look! Like you have not ordered yet</p>

                          <button
                            className="btn btn-primary-outline btn-medium"
                            type="button"
                            onClick={() => {
                              navigate("/collections/all");
                            }}
                          >
                            Order Now
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="morderbox mb-3">
                        <div className="morderbox-body">
                          <div className="row">
                            <div className="col-7">
                              <Skeleton width={"100%"} height={100} count={3} />
                            </div>
                            <div className="col-5 tx-right">
                              <Skeleton width={"100%"} height={100} count={3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </MobileView>
    </>
  );
}

export default Orders;
