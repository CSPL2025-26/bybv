import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackModal from "../../Components/Elements/Modals/feedback_modal";
import { ApiService } from "../../Components/services/apiServices";
import Skeleton from "react-loading-skeleton";
import localStorageData from '../../Components/Elements/utils/localStorageData'
import { trackPurchase } from '../../Components/services/facebookTracking';

function Thankyou() {
  const didMountRef = useRef(true);
  const [orderData, setOrderData] = useState({});
  const dataArray = localStorageData();
  const CartSession = dataArray['CartSession'];

  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [settingData, setSettingData] = useState([]);
  let formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  useEffect(() => {
    if (didMountRef.current) {
      trackPurchase(CartSession);
      localStorage.removeItem("CART_SESSION");
      localStorage.removeItem("CART_ITEM_BOX_SESSION");
      localStorage.removeItem("ADDRESS_SESSION");
      localStorage.removeItem("COUPON_SESSION");
      getOrderData();
      getSettingsData();
    }
    didMountRef.current = false;
  }, []);
  const getSettingsData = () => {
    ApiService.fetchData("settingsdata").then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings);
      }
    });
  };
  const getOrderData = () => {
    if (id) {
      const getOrderDetail = {
        trans_id: id,
      };
      setLoading(true);
      ApiService.postData("get-order-detail", getOrderDetail).then((res) => {
        if (res.status === "success") {
          setOrderData(res.row_orders_data);
          setLoading(false);
          setSpinnerLoading(false);
        } else {
        }
      });
    } else {
    }
  };
  const [showFeedback, setShowFeedback] = useState(false);
  const handleShowFeedbackModal = () => {
    setShowFeedback(true);
  };

  const handleChildData = () => {
    setShowFeedback(false);
  };
  return (
    <>
      <BrowserView>
        <section className="sectionmedium">
          <div className="container">
            {loading == false ? (
              <>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="mb-5">
                          <a href="/" className="logo">
                            <img
                              src="/img/logo.png"
                              alt="logo"
                              width="70"
                              height="47"
                            />
                          </a>
                        </div>
                        <h6>YOUR ORDER ID: #{orderData.trans_order_number}</h6>
                        <h5>Thank You {orderData.trans_user_name}! </h5>
                      </div>
                      <div className="d-flex justify-content-end">
                        {" "}
                        <img
                          src="/img/check-circle.gif"
                          style={{ width: "100px" }}
                        />
                      </div>
                    </div>

                    <hr></hr>
                    <h6 className="tx-14">Your order is confirmed</h6>
                    <p className="mb-0">{orderData.trans_method}</p>
                    <hr></hr>
                    <h3 className="mb-5">Order Details</h3>
                    <div className="row">
                      <div className="col-lg-6">
                        <h6 className="tx-14">Contact Information</h6>
                        <p>{orderData.trans_user_email}</p>
                        <h6 className="tx-14">Shipping Address</h6>
                        <p>{orderData.trans_delivery_address}</p>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="tx-14">Payment Method</h6>
                        <p>
                          {orderData.trans_method}: {orderData.trans_currency}
                          {orderData.trans_amt}
                        </p>
                        <h6 className="tx-14">Billing Address</h6>
                        <p>{orderData.trans_delivery_address}</p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row align-items-center justify-content-between">
                      <div className="col-lg-6">
                        <a href="/contact">Need Help? Contact Us</a>
                      </div>
                      <div className="col-lg-6 d-flex justify-content-end">
                        <a
                          href="javascript:void(0)"
                          className="button button--primary me-3"
                          onClick={handleShowFeedbackModal}
                        >
                          Feedback
                        </a>
                        <a
                          href="/collections/all"
                          className="button button--primary"
                        >
                          Continue Shopping
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    {orderData.items
                      ? orderData.items.map((value, index) => {
                        return (
                          <div className="cartsec mt-0" key={index}>
                            <div className="row g-3">
                              <div className="col-lg-2 col-3">
                                <div className="cartsec-media">
                                  <img src={value.td_item_image} />
                                </div>
                              </div>
                              <div className="col-lg-9 col-9">
                                <h6 className="cartsec-name">
                                  <a
                                    href="javascript:void(0)"
                                    className="mycartbox-title"
                                  >
                                    {value.td_item_title}
                                  </a>
                                </h6>
                                <div className="cartsec-price">
                                  <div className="price-new me-2">
                                    {orderData.trans_currency}
                                    {formatter.format(
                                      value.td_item_sellling_price
                                    )}
                                  </div>
                                </div>
                                {(() => { 
                                  const selectedProducts = value.td_item_selected_products
                                    ? value.td_item_selected_products
                                    : []; 

                                  if (value.td_item_crazy_deal === 1 && selectedProducts.length > 0) {
                                    return (
                                      <dl>
                                        {selectedProducts.map((product, index) => (
                                          <div className="product-option" key={`product-${index}`}>
                                            <dd>Item {index + 1}: {product.product_name}</dd>
                                          </div>
                                        ))}
                                      </dl>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : null}
                    <div className="panel p-4 mb-3">
                      <div className="panel-header">Order Summary</div>
                      <div className="panel-body">
                        <div className="pcb-list mt-3">
                          <ul>
                            <li>
                              Item Total
                              <span className="ml-auto">
                                {orderData.trans_currency}
                                {formatter.format(orderData.item_sub_total)}
                              </span>
                            </li>
                            <li>
                              Discount
                              <span className="ml-auto tx-green">
                                -{orderData.trans_currency}
                                {formatter.format(
                                  orderData.trans_discount_amount
                                )}
                              </span>
                            </li>
                            <li>
                              Coupon Discount
                              <span className="ml-auto tx-green">
                                -{orderData.trans_currency}
                                {formatter.format(
                                  orderData.trans_coupon_dis_amt
                                )}
                              </span>
                            </li>
                            <li>
                              Shipping
                              <span className="ml-auto">
                                {orderData.trans_currency}
                                {formatter.format(
                                  orderData.trans_delivery_amount
                                )}
                              </span>
                            </li>
                            {settingData.estimated_delivery !== null && (
                              <li>
                                Estimated Delivery Time:
                                <span style={{ marginLeft: "10px" }}>
                                  {settingData.estimated_delivery}{" "}
                                  {settingData.estimated_delivery === 1
                                    ? "day"
                                    : "days"}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                        <hr />
                        <div className="pcb-list-second">
                          <ul>
                            <li>
                              Total Amount
                              <span className="ml-auto">
                                {orderData.trans_currency}
                                {formatter.format(orderData.trans_amt)}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Skeleton start
              <>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="mb-5">
                          <a href="/" className="logo">
                            <img
                              src="/img/logo.png"
                              alt="logo"
                              width="70"
                              height="47"
                            />
                          </a>
                        </div>
                        <h6>
                          <Skeleton width={150} height={15} />
                        </h6>
                        <h5>
                          <Skeleton width={150} height={15} />{" "}
                        </h5>
                      </div>
                      <div className="d-flex justify-content-end">
                        {" "}
                        <Skeleton width={90} height={90} borderRadius={50} />
                      </div>
                    </div>

                    <hr></hr>
                    <h6 className="tx-14">
                      <Skeleton width={150} height={15} />
                    </h6>
                    <p className="mb-0">
                      <Skeleton width={130} height={15} />
                    </p>
                    <hr></hr>
                    <h3 className="mb-5">
                      <Skeleton width={130} height={25} />
                    </h3>
                    <div className="row">
                      <div className="col-lg-6">
                        <h6 className="tx-14">
                          <Skeleton width={130} height={15} />
                        </h6>
                        <p>
                          <Skeleton width={130} height={15} />
                        </p>
                        <h6 className="tx-14">
                          <Skeleton width={130} height={15} />
                        </h6>
                        <p>
                          <Skeleton width={150} height={15} />
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="tx-14">
                          <Skeleton width={130} height={15} />
                        </h6>
                        <p>
                          <Skeleton width={130} height={15} />
                        </p>
                        <h6 className="tx-14">
                          <Skeleton width={130} height={15} />
                        </h6>
                        <p>
                          <Skeleton width={150} height={15} />
                        </p>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row align-items-center justify-content-between">
                      <div className="col-lg-6">
                        <a href="/help-support">
                          <Skeleton width={150} height={15} />
                        </a>
                      </div>
                      <div className="col-lg-6 d-flex justify-content-end">
                        <Skeleton width={150} height={50} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    {orderData.items ? (
                      orderData.items.map((value, index) => {
                        return (
                          <div className="cartsec mt-0" key={index}>
                            <div className="row g-3">
                              <div className="col-lg-2 col-3">
                                <div className="cartsec-media">
                                  <img src={value.td_item_image} />
                                </div>
                              </div>
                              <div className="col-lg-9 col-9">
                                <h6 className="cartsec-name">
                                  <a
                                    href="javascript:void(0)"
                                    className="mycartbox-title"
                                  >
                                    {value.td_item_title}
                                  </a>
                                </h6>
                                <div className="cartsec-price">
                                  <div className="price-new me-2">
                                    {orderData.trans_currency}
                                    {formatter.format(
                                      value.td_item_sellling_price
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="cartsec mt-0">
                          <div className="row g-3">
                            <div className="col-lg-2 col-3">
                              <div className="cartsec-media">
                                <Skeleton width={70} height={70} />
                              </div>
                            </div>
                            <div className="col-lg-9 col-9">
                              <h6 className="cartsec-name">
                                <a
                                  href="javascript:void(0)"
                                  className="mycartbox-title"
                                >
                                  <Skeleton width={200} height={15} />
                                </a>
                              </h6>
                              <div className="cartsec-price">
                                <div className="price-new me-2">
                                  <Skeleton width={100} height={15} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="panel p-4 mb-3">
                      <div className="panel-header">
                        <Skeleton width={100} height={20} />
                      </div>
                      <div className="panel-body">
                        <div className="pcb-list mt-3">
                          <ul>
                            <li>
                              <Skeleton width={90} height={15} />
                              <span className="ml-auto">
                                <Skeleton width={70} height={15} />
                              </span>
                            </li>
                            <li>
                              <Skeleton width={90} height={15} />
                              <span className="ml-auto tx-green">
                                <Skeleton width={70} height={15} />
                              </span>
                            </li>
                            <li>
                              <Skeleton width={90} height={15} />
                              <span className="ml-auto tx-green">
                                <Skeleton width={70} height={15} />
                              </span>
                            </li>
                            <li>
                              <Skeleton width={90} height={15} />
                              <span className="ml-auto">
                                <Skeleton width={70} height={15} />
                              </span>
                            </li>
                          </ul>
                        </div>
                        <hr />
                        <div className="pcb-list-second">
                          <ul>
                            <li>
                              <Skeleton width={90} height={20} />
                              <span className="ml-auto">
                                <Skeleton width={70} height={20} />
                              </span>
                            </li>
                          </ul>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </>
              // Skeleton End
            )}
          </div>
        </section>
      </BrowserView>

      <MobileView>
        {loading == false ? (
          <>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ padding: "15px" }}
            >
              <div>
                <div className="mb-4">
                  <a href="/" className="logo">
                    <img
                      src="/img/logo.png"
                      alt="logo"
                      width="70"
                      height="47"
                    />
                  </a>
                </div>
                <h6>YOUR ORDER ID: #{orderData.trans_order_number}</h6>
                <h5>Thank You {orderData.trans_user_name}! </h5>
              </div>
              <div className="d-flex justify-content-end">
                <img src="/img/check-circle.gif" style={{ width: "50px" }} />
              </div>
            </div>

            <hr></hr>
            <div style={{ padding: "15px" }}>
              <h6 className="tx-14">Your order is confirmed</h6>
              <p className="mb-0">{orderData.trans_method}</p>
            </div>
            <hr></hr>
            <div style={{ padding: "15px" }}>
              <h3 className="mb-4">Order Details</h3>
              <div className="row">
                <div className="col-lg-6">
                  <h6 className="tx-14">Contact Information</h6>
                  <p>{orderData.trans_user_email}</p>
                  <h6 className="tx-14">Shipping Address</h6>
                  <p>{orderData.trans_delivery_address}</p>
                </div>
                <div className="col-lg-6">
                  <h6 className="tx-14">Payment Method</h6>
                  <p>
                    {orderData.trans_method}: {orderData.trans_currency}
                    {orderData.trans_amt}
                  </p>
                  <h6 className="tx-14">Billing Address</h6>
                  <p>{orderData.trans_delivery_address}</p>
                </div>
              </div>
            </div>
            <hr></hr>
            <div style={{ padding: "15px" }}>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <a href="/help-support" className="">
                    Need Help? Contact Us
                  </a>
                </div>
                <div className="col-lg-6 mt-5">
                  <a
                    href="javascript:void(0)"
                    className="button button--primary me-3"
                    onClick={handleShowFeedbackModal}
                  >
                    Feedback
                  </a>
                  <a href="/collections/all" className="button button--primary">
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
            {orderData.items
              ? orderData.items.map((value, index) => {
                return (
                  <div className="cartsec mt-0" key={index}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media">
                          <img src={value.td_item_image} />
                        </div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name">
                          <a
                            href="javascript:void(0)"
                            className="mycartbox-title"
                          >
                            {value.td_item_title}
                          </a>
                        </h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">
                            {orderData.trans_currency}
                            {formatter.format(value.td_item_sellling_price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : null}
            <div className="panel p-4 mb-3">
              <div className="panel-header">Order Summary</div>
              <div className="panel-body">
                <div className="pcb-list mt-3">
                  <ul>
                    <li>
                      Item Total
                      <span className="ml-auto">
                        {orderData.trans_currency}
                        {formatter.format(orderData.item_sub_total)}
                      </span>
                    </li>
                    <li>
                      Discount
                      <span className="ml-auto tx-green">
                        -{orderData.trans_currency}
                        {formatter.format(orderData.trans_discount_amount)}
                      </span>
                    </li>
                    <li>
                      Coupon Discount
                      <span className="ml-auto tx-green">
                        -{orderData.trans_currency}
                        {formatter.format(orderData.trans_coupon_dis_amt)}
                      </span>
                    </li>
                    <li>
                      Shipping
                      <span className="ml-auto">
                        {orderData.trans_currency}
                        {formatter.format(orderData.trans_delivery_amount)}
                      </span>
                    </li>
                    {settingData.estimated_delivery !== null && (
                      <li>
                        Estimated Delivery Time:
                        <span style={{ marginLeft: "10px" }}>
                          {settingData.estimated_delivery}{" "}
                          {settingData.estimated_delivery === 1
                            ? "day"
                            : "days"}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <hr />
                <div className="pcb-list-second">
                  <ul>
                    <li>
                      Total Amount
                      <span className="ml-auto">
                        {orderData.trans_currency}
                        {formatter.format(orderData.trans_amt)}
                      </span>
                    </li>
                  </ul>
                </div>
                <hr />
              </div>
            </div>
          </>
        ) : (
          //Skeleton Start
          <>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ padding: "15px" }}
            >
              <div>
                <div className="mb-4">
                  <a href="/" className="logo">
                    <img
                      src="/img/logo.png"
                      alt="logo"
                      width="70"
                      height="47"
                    />
                  </a>
                </div>
                <h6><Skeleton width={"100%"} height={15} /></h6>
                <h5><Skeleton width={"100%"} height={15} /></h5>
              </div>
              <div className="d-flex justify-content-end">
                {" "}
                <Skeleton width={50} height={50} borderRadius={50} />
              </div>
            </div>

            <hr></hr>
            <div style={{ padding: "15px" }}>
              <h6 className="tx-14"><Skeleton width={90} height={15} /></h6>
              <p className="mb-0"><Skeleton width={80} height={15} /></p>
            </div>
            <hr></hr>
            <div style={{ padding: "15px" }}>
              <h3 className="mb-4"><Skeleton width={80} height={22} /></h3>
              <div className="row">
                <div className="col-lg-6">
                  <h6 className="tx-14"><Skeleton width={80} height={18} /></h6>
                  <p><Skeleton width={80} height={15} /></p>
                  <h6 className="tx-14"><Skeleton width={80} height={18} /></h6>
                  <p><Skeleton width={100} height={15} /></p>
                </div>
                <div className="col-lg-6">
                  <h6 className="tx-14"><Skeleton width={80} height={18} /></h6>
                  <p>
                    <Skeleton width={80} height={15} />
                  </p>
                  <h6 className="tx-14"><Skeleton width={80} height={18} /></h6>
                  <p><Skeleton width={100} height={15} /></p>
                </div>
              </div>
            </div>
            <hr></hr>
            <div style={{ padding: "15px" }}>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <a href="/help-support" className="">
                    <Skeleton width={110} height={15} />
                  </a>
                </div>
                <div className="col-lg-6 mt-5">
                  <Skeleton width={120} height={50} />
                </div>
              </div>
            </div>
            {orderData.items
              ? orderData.items.map((value, index) => {
                return (
                  <div className="cartsec mt-0" key={index}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media">
                          <img src={value.td_item_image} />
                        </div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name">
                          <a
                            href="javascript:void(0)"
                            className="mycartbox-title"
                          >
                            {value.td_item_title}
                          </a>
                        </h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">
                            {orderData.trans_currency}
                            {formatter.format(value.td_item_sellling_price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : <>
                <div className="cartsec mt-0">
                  <div className="row g-3">
                    <div className="col-lg-2 col-3">
                      <div className="cartsec-media">
                        <Skeleton width={80} height={80} />
                      </div>
                    </div>
                    <div className="col-lg-9 col-9">
                      <h6 className="cartsec-name">
                        <a
                          href="javascript:void(0)"
                          className="mycartbox-title"
                        >
                          <Skeleton width={110} height={18} />
                        </a>
                      </h6>
                      <div className="cartsec-price">
                        <div className="price-new me-2">
                          <Skeleton width={60} height={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>}
            <div className="panel p-4 mb-3">
              <div className="panel-header"> <Skeleton width={100} height={20} /></div>
              <div className="panel-body">
                <div className="pcb-list mt-3">
                  <ul>
                    <li>
                      <Skeleton width={90} height={18} />
                      <span className="ml-auto">
                        <Skeleton width={80} height={18} />
                      </span>
                    </li>
                    <li>
                      <Skeleton width={90} height={18} />
                      <span className="ml-auto tx-green">
                        <Skeleton width={80} height={18} />
                      </span>
                    </li>
                    <li>
                      <Skeleton width={90} height={18} />
                      <span className="ml-auto tx-green">
                        <Skeleton width={80} height={18} />
                      </span>
                    </li>
                    <li>
                      <Skeleton width={90} height={18} />
                      <span className="ml-auto">
                        <Skeleton width={80} height={18} />
                      </span>
                    </li>

                  </ul>
                </div>
                <hr />
                <div className="pcb-list-second">
                  <ul>
                    <li>
                      <Skeleton width={100} height={20} />
                      <span className="ml-auto">
                        <Skeleton width={100} height={20} />
                      </span>
                    </li>
                  </ul>
                </div>
                <hr />
              </div>
            </div>
          </>
        )}
      </MobileView>
      {showFeedback && (
        <FeedbackModal
          show={showFeedback}
          onChildData={handleChildData}
          className="feedbackModal bottom"
        />
      )}
    </>
  );
}
export default Thankyou;
