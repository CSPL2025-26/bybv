import Header from "../../Components/Header/index"
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from 'react-device-detect';
import { ApiService } from "../../Components/services/apiServices";
import OrderCancelModal from "../../Components/Elements/Modals/cancel-order-modal";
import Accountsidebar from "../Account/accountsidebar";
import moment from "moment";

const Orderdetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [OrderData, setOrderdata] = useState()
  const [multipleorderdetail, setmultipleorderdetail] = useState([])
  const [ordertransid, setordertransid] = useState("")
  const [showmodal, setshowmodal] = useState(false)
  const didMountRef = useRef(true)
  useEffect(() => {
    if (didMountRef.current) {
      const dataString = {
        trans_id: id
      }
      ApiService.postData("get-order-detail", dataString).then(res => {
        if (res.status == 'success') {
          setOrderdata(res?.row_orders_data)
          setmultipleorderdetail(res?.row_orders_data?.items)
        }
        else if (res?.data?.status == "session_expired") {
          localStorage.removeItem("USER_SESSION")
        }
      })
    }
    didMountRef.current = false;
  })

  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handleClose = () => {
    setshowmodal(false)
  }
  const Orderstataus = (status) => {
    switch (status) {
      case 1:
        return "Confirmed"
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
        return 'Shipped';
        break;
      case 7:
        return 'Item Picked Up';
        break;

      default:
        return 'Order status';
        break;
    }
  }

  const Step = ({ status, date, statustext }) => {
    const stepClasses = `col-4 bs-wizard-step ${status === 'is-done' ? 'is-done' : ''} ${status === 'current' ? 'current' : ''
      }`;
    return (
      <li className={'StepProgress-item ' + stepClasses}>
        <p className="mb-0 tx-14">{statustext}</p>
        {date ? <p className="tx-12 tx-color-03 mb-0">{moment(date).format("DD MMM YYYY")}</p> : ''}

      </li>
    );
  };

  return (<>
    <BrowserView>
      <Header />
      <div className="container">
        <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs" style={{ justifyContent: "flex-start" }}>
          <a href="/" title="Home" className="link-hover-line">Home</a>
          <div className="breadcrumb__delimiter">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg>
          </div>
          <a href="/account" title="Account" className="link-hover-line">Account</a>
          <div className="breadcrumb__delimiter">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg>
          </div>
          <span>My Orders</span>
        </nav>
      </div>

      <section className="customer-section">
        <div className="customer account">
          <div className="container">
            <div className="account__wrapper">
              <Accountsidebar></Accountsidebar>
              <div className="account-block">
                <div className="account-block__header">
                  <h2>Order Details</h2>
                </div>
                <div className="account-item account-item-info">
                  <div className="order-box">
                    <div className="info">
                      <div className="info-delivery">
                        <h6 className="mb-1 tx-14">Delivery Address</h6>
                        <p className="mb-0 tx-13"><strong>{OrderData?.trans_user_name}</strong></p>
                        <p className="mb-0 tx-13"> {OrderData?.trans_delivery_address}</p>
                        <p className="mb-0 tx-13">Email Id : {OrderData?.trans_user_email}</p>
                        <p className="tx-13">Mobile No : {OrderData?.trans_user_mobile}</p>
                        <div className="morderbox-status bg-light-yellow" style={{ display: "inline-block" }}>{Orderstataus(OrderData?.trans_status)}</div>
                      </div>
                    </div>
                    <div className="bcode">
                      <div className="orderid-box mb-5"><h6 className="mb-0">ORDER ID</h6><p className="mb-0 tx-13">{OrderData?.trans_order_number}</p></div>
                      <p className="tx-color-03 mb-0 tx-13">ORDER ON</p>
                      <p className="tx-12">{moment(OrderData?.created_at).format('MMM D, YYYY')}</p>
                      {OrderData?.trans_status == 2 || OrderData?.trans_status == 3 || OrderData?.trans_status == 1 ? <>
                        <div className="morderbox-status bg-black" style={{ color: "white" }} onClick={() => { setordertransid(OrderData?.trans_id); setshowmodal(true) }} >Cancel Order</div>
                      </> : ""}
                    </div>
                  </div>
                  <div className="card-table">
                    <div className="card-table-section">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th className="text-center">S.No</th>
                            <th className="text-center">Image</th>
                            <th>Title</th>
                            <th className="text-center">QTY</th>
                            <th className="text-center">Price (GST Included)</th>
                            <th className="text-center">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {multipleorderdetail?.map((value, index) => {
                            return (
                              <tr>
                                <td className="text-center">
                                  {index + 1}
                                </td>
                                <td className="text-center">
                                  <img src={value.td_item_image} alt={value.td_item_image} style={{ width: "35px" }} />
                                </td>
                                <td>
                                  <span>{value?.td_item_title}</span><br />
                                  {(() => {
                                    const selectedProducts = value.td_item_selected_products
                                      ? value.td_item_selected_products
                                      : [];

                                    if (value.td_item_crazy_deal === 1 && selectedProducts.length > 0) {
                                      return (
                                        <>
                                          {selectedProducts.map((product, index) => (
                                            <p className="tx-12 mb-0" key={`product-${index}`}>
                                              Item {index + 1}: {product.product_name}
                                            </p>
                                          ))}
                                        </>
                                      );
                                    }
                                    return null;
                                  })()}
                                </td>
                                <td className="text-center">{value?.td_item_qty}</td>
                                <td className="text-center">{OrderData?.trans_currency} {formatter.format(value?.td_item_sellling_price)}</td>
                                <td className="text-center">{OrderData?.trans_currency} {formatter.format(value?.td_item_sellling_price * value?.td_item_qty)}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td colSpan="3"></td>
                            <td colSpan=""></td>
                            <td>Sub Total</td>
                            <td className="text-center">{OrderData?.trans_currency} {formatter.format(OrderData?.item_sub_total ? OrderData?.item_sub_total : "0.00")}</td>
                          </tr>
                          <tr>
                            <td colSpan="4"></td>
                            <td>Discount</td>
                            <td className="text-center">-{OrderData?.trans_currency} {formatter.format(OrderData?.trans_discount_amount ? OrderData?.trans_discount_amount : "0.00")}</td>
                          </tr>
                          {Number(OrderData?.trans_prepaid_discount) > 0 && 
                          <tr>
                            <td colSpan="4"></td>
                            <td>Extra 5% Discount On Prepaid Order</td>
                            <td className="text-center">-{OrderData?.trans_currency} {formatter.format(OrderData?.trans_prepaid_discount ? OrderData?.trans_prepaid_discount : "0.00")}</td>
                          </tr>}
                          <tr>
                            <td colSpan="4"></td>
                            <td>Coupon Discount</td>
                            <td className="text-center">{OrderData?.trans_currency} {formatter?.format(OrderData?.trans_coupon_dis_amt ? OrderData?.trans_coupon_dis_amt : "0.00")}</td>
                          </tr>
                          <tr>
                            <td colSpan="4"></td>
                            <td>Delivery Charges</td>
                            <td className="text-center">{OrderData?.trans_currency} {formatter?.format(OrderData?.trans_delivery_amount ? OrderData?.trans_delivery_amount : "0.00")}</td>
                          </tr>
                          <tr>
                            <td colSpan="4"></td>
                            <td>
                              <strong>Grand total</strong>
                            </td>
                            <td className="text-center">
                              <strong>{OrderData?.trans_currency} {OrderData?.trans_amt ? OrderData?.trans_amt : "0.00"} </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BrowserView>
    <MobileView>
      <header className='mobileheader'>
        <div className='mobileheader-title'>
          <svg width="22" height="17" onClick={() => { navigate("/orders") }} viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path><path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path></svg>
          Order Detail
        </div>
      </header>
      <div className="panel p-3" style={{ background: '#fff', border: '0px' }}>
        <div className="panel-header mb-3">Shipping & Billing Address</div>
        <p className="mb-0 mt-0">
          <strong>{OrderData?.trans_user_name}</strong>
        </p>
        <p className="tx-12">{OrderData?.trans_delivery_address}</p>
        <p className="mb-0 mt-0">
          <strong>Email Id: </strong>
          {OrderData?.trans_user_email}
        </p>
        <p className="mb-0 mt-0">
          <strong>Phone No: </strong>
          {OrderData?.trans_user_mobile}
        </p>
      </div>
      <div className="spacer1"></div>
      <div className="panel vsteprocess" style={{ background: '#fff', border: '0px', paddingTop: '15px' }}>
        {(() => {
          if (OrderData?.trans_status == 1) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="" date="" statustext="Item Picked Up" />
                <Step status="" date="" statustext="Shipped" />
                <Step status="" date="" statustext="Delivered" />
              </ul>
            )
          } else if (OrderData?.trans_status == 4) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_pickedup_date} statustext="Item Picked Up" />
                <Step status="is-done" date={OrderData?.trans_shiped_date} statustext="Shipped" />
                <Step status="is-done" date={OrderData?.trans_delivered_date} statustext="Delivered" />
              </ul>
            )
          } else if (OrderData?.trans_status == 5) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_cancelled_date} statustext="Cancelled" />
              </ul>
            )
          } else if (OrderData?.trans_status == 6) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_pickedup_date} statustext="Item Picked Up" />
                <Step status="is-done" date={OrderData?.trans_shiped_date} statustext="Shipped" />
                <Step status="" date={OrderData?.trans_delivered_date} statustext="Delivered" />
              </ul>
            )
          } else if (OrderData?.trans_status == 7) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_pickedup_date} statustext="Item Picked Up" />
                <Step status="" date={OrderData?.trans_shiped_date} statustext="Shipped" />
                <Step status="" date={OrderData?.trans_delivered_date} statustext="Delivered" />
              </ul>
            )
          } else if (OrderData?.trans_status == 2) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_pendingpayment_date} statustext="Payment Pending" />
                <Step status="" date={OrderData?.trans_shiped_date} statustext="Shipped" />
                <Step status="" date={OrderData?.trans_delivered_date} statustext="Delivered" />
              </ul>
            )
          } else if (OrderData?.trans_status == 3) {
            return (
              <ul className="StepProgress">
                <Step status="is-done" date={OrderData?.created_at} statustext="Order Placed" />
                <Step status="is-done" date={OrderData?.trans_onhold_date} statustext="On Hold" />
                <Step status="" date={OrderData?.trans_shiped_date} statustext="Shipped" />
                <Step status="" date={OrderData?.trans_delivered_date} statustext="Delivered" />
              </ul>
            )
          }
        })()}
      </div>
      <div className="spacer1"></div>
      <div className="panel" style={{ background: '#fff', border: '0px' }}>
        {multipleorderdetail.map((value, index) => {
          return (
            <div className="oddetails-item" key={index}>
              <div className="oddetails-item-media">
                <img src={value.td_item_image} alt={value.td_item_image} />
              </div>
              <div className="oddetails-item-content">
                <h6 className="mb-1 tx-13">{value.td_item_title}</h6>
                <div className="price">
                  {value.td_item_unit && <p className="tx-12 mb-1">Weight: {value.td_item_unit}</p>}
                  <p className="tx-12 mb-0">₹{value.td_item_total}</p>
                </div>
                {(() => {
                  const selectedProducts = value.td_item_selected_products
                    ? value.td_item_selected_products
                    : [];

                  if (value.td_item_crazy_deal === 1 && selectedProducts.length > 0) {
                    return (
                      <>
                        {selectedProducts.map((product, index) => (
                          <p className="tx-12 mb-0" key={`product-${index}`}>
                            Item {index + 1}: {product.product_name}
                          </p>
                        ))}
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="spacer1"></div>
      <div className="panel checkoutlist" style={{ background: '#fff', border: '0px' }}>
        <div className="panel-header">Price Details</div>
        <div className="panel-body">
          <div className="pcb-list mt-2">
            <ul><li>Item Total<span className="ml-auto">{OrderData?.trans_currency}
              {formatter?.format(OrderData?.item_sub_total ? OrderData?.item_sub_total : "0.00")}</span></li>
              <li>Discount<span className="ml-auto tx-green">-{OrderData?.trans_currency}
                {formatter.format(OrderData?.trans_discount_amount ? OrderData?.trans_discount_amount : "0.00")}</span></li>
              {Number(OrderData?.trans_prepaid_discount) > 0 && 
              <li>Extra 5% Discount On Prepaid Order<span className="ml-auto tx-green">-{OrderData?.trans_currency}
                {formatter.format(OrderData?.trans_prepaid_discount ? OrderData?.trans_prepaid_discount : "0.00")}</span></li>}
              <li>Coupon Discount<span className="ml-auto tx-green">{OrderData?.trans_currency}
                {formatter.format(OrderData?.trans_coupon_dis_amt ? OrderData?.trans_coupon_dis_amt : "0.00")}</span></li>
              <li> Shipping<span className="ml-auto tx-green">{OrderData?.trans_currency}
                {formatter.format(OrderData?.trans_delivery_amount ? OrderData?.trans_delivery_amount : "0.00")}</span></li>
            </ul>
          </div>
          <hr />
          <div className="pcb-list-second">
            <ul>
              <li>Total Amount<span className="ml-auto">{OrderData?.trans_currency}{OrderData?.trans_amt}</span></li></ul>
          </div>
          <hr />
        </div>
      </div>
    </MobileView>
    <OrderCancelModal showmodal={showmodal} handleClose={handleClose} transId={ordertransid}></OrderCancelModal>
  </>)
}
export default Orderdetails