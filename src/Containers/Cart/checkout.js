import React, { useEffect, useRef, useState, useContext } from "react";
import Footer from '../../Components/Footer'
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { BrowserView, MobileView } from 'react-device-detect'
import CartHeader from '../../Components/Header/cart_header'
import localStorageData from '../../Components/Elements/utils/localStorageData'
import { ApiService } from '../../Components/services/apiServices';
import { showToast } from '../../Components/Elements/utils/toastUtils';
import Loader from "react-js-loader";
import DataContext from "../../Components/Elements/context";

import { trackPurchase } from '../../Components/services/facebookTracking';
function Checkout() {
  const didMountRef = useRef(true);
  const navigate = useNavigate()
  const dataArray = localStorageData();
  const contextValues = useContext(DataContext);

  const [settingData, setSettingData] = useState({});
  const CartSession = dataArray['CartSession'];
  const AddressSession = dataArray['AddressSession'];
  const CouponSession = dataArray['CouponSession'];
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("1");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingData, setShippingData] = useState({});
  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [textarea, setTextarea] = useState('');

  const handleChangeTextarea = (event) => {
    setTextarea(event.target.value);
  };
  const selectpaymentMode = (mode) => {
    setPaymentMethod(mode)
    if (mode === 'COD') {
      setPaymentType('1')
      calculateShippingAmount('1')
    } else {
      setPaymentType('0')
      calculateShippingAmount('0')
    }
  };

  useEffect(() => {
    if (didMountRef.current) {
      cartSessionData()
      setSpinnerLoading(true);
      setTimeout(() => {
        setSpinnerLoading(false);
      }, 1000);
    }
    didMountRef.current = false;
  }, [contextValues]);

  const cartSessionData = () => {
    const dataString = {
      coupon_session: localStorage.getItem("COUPON_SESSION"),
    };
    ApiService.postData("cartSessionData", dataString).then((res) => {
      if (res.data.status === "success") {
        contextValues.setCartSessionData(res.data.resCartData)
        contextValues.setcartCount(res.data.resCartData.length)
        contextValues.setCartSummary(res.data.cartSummary)
        getSettingsData(res.data.cartSummary, res.data.resCartData)

      }
    });
  }

  const getSettingsData = (summary, cartdata) => {
    ApiService.fetchData("settingsdata").then((res) => {
      if (res.status === "success") {
        setSettingData(res.sitesettings);
        if (res.sitesettings.admin_cod_status === 1) {
          setPaymentMethod("COD")
          calculateShippingAmount("1", summary, cartdata)
        } else {
          setPaymentMethod('credit-debit')
          calculateShippingAmount("0", summary, cartdata)
        }
      }
    });
  };

  const calculateShippingAmount = (paymentType, summary = contextValues.cartSummary, cartdata = contextValues.cartSessionData) => {
    const dataString = {
      itemtotal: summary.total_amount,
      ua_id: AddressSession.ua_id,
      cart_data: cartdata,
      payment_type: paymentType,
      payment_type_admin: settingData.admin_shipping_cod
    };

    ApiService.postData("calculate-shipping-amount", dataString).then((res) => {
      if (res.status === "success") {
        setShippingCharge(res.shipping_amount);
        setShippingData(res.shipping_data)
        setTimeout(() => {
          setSpinnerLoading(false);
        }, 500);

      } else {
        setTimeout(() => {
          setSpinnerLoading(false);
        }, 500);
      }
    });
  };
  const checkOutProccess = () => {
    if (paymentMethod === '') {
      showToast('error', 'Please select Payment Method', 1500)
      return;
    }
    if (contextValues.cartSummary.total_amount + shippingCharge < settingData.admin_min_order) {
      showToast('error', 'Minimum Order should be ₹' + settingData.admin_min_order, 1500)
      return;
    }
    if (paymentMethod !== 'COD') {
      if (settingData.admin_payment_active === 1) {
        ccavenue()
      } else {

      }
    } else {
      const dataString = {
        cartSummary: contextValues.cartSummary,
        parsedAddressSession: AddressSession,
        parsedCartSession: contextValues.cartSessionData,
        parsedCouponSession: CouponSession,
        paymentMethod: paymentMethod,
        shippingCharge: shippingCharge,
        shippingData: shippingData,
        textarea: textarea,
        amount: Number(contextValues.cartSummary.itemTotal) - Number(contextValues.cartSummary.discount) - Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) + Number(shippingCharge),
      };
      setSpinnerLoading(true)
      ApiService.postData("makecodorder", dataString).then((res) => {
        if (res.status === "success") {
          trackPurchase(CartSession)
          localStorage.removeItem("CART_SESSION")
          localStorage.removeItem("ADDRESS_SESSION")
          localStorage.removeItem("COUPON_SESSION")
          navigate('/thankyou/' + res.order_number)
        } else {
          setSpinnerLoading(false)
        }
      });
    }

  };

  const ccavenue = () => {
    const finalAmount = Number(contextValues.cartSummary.itemTotal) -
      Number(contextValues.cartSummary.discount) -
      Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) +
      Number(shippingCharge);
    let totalAmount = 0;
    let prepaidDiscount = 0;
    if (paymentMethod !== 'COD') {
      const afterDiscount = (finalAmount * 5) / 100;
      totalAmount = Number(finalAmount - afterDiscount);
      prepaidDiscount = Number(afterDiscount);
    } else {
      totalAmount = Number(finalAmount);
    }
    const dataString = {
      cartSummary: contextValues.cartSummary,
      parsedAddressSession: AddressSession,
      parsedCartSession: contextValues.cartSessionData,
      parsedCouponSession: CouponSession,
      paymentMethod: paymentMethod,
      shippingCharge: shippingCharge,
      shippingData: shippingData,
      textarea: textarea,
      amount: totalAmount,
      prepaidDiscount: prepaidDiscount
    };
    setSpinnerLoading(true)
    ApiService.postData("initiateCCPayment", dataString).then((res) => {
      if (res.status === "success") {
        window.location.href = res.production_url;
        setSpinnerLoading(false)
      } else {
        setSpinnerLoading(false)
      }
    });
  }

  return (<>
    <BrowserView>
      <CartHeader />
      {spinnerLoading ? <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} /> : ''}
      <div className='capvs'>
        <section className='sectionmedium'>
          <div className='container'>
            <div className='row justify-content-between'>
              <div className='col-lg-8'>
                <div className="address-checkout mb-3">
                  <a href="/cart-address" className="change-address">Change</a>
                  <h6>Shipping and Billing Address</h6>
                  <p style={{ marginBottom: "3px", fontWeight: "600" }}>
                    {AddressSession.ua_name} ({AddressSession.ua_address_type == "Other" ? AddressSession.ua_address_type_other : AddressSession.ua_address_type})
                  </p>
                  <p className="address-full" style={{ marginBottom: "3px" }}>Mobile No: {AddressSession.ua_mobile}</p>
                  <div className="address-full">{AddressSession.ua_house_no}, {AddressSession.ua_area}, {AddressSession.ua_city_name}, {AddressSession.ua_state_name} {AddressSession.ua_pincode}</div>
                </div>
                <Accordion defaultActiveKey={['2']} alwaysOpen>
                  <Accordion.Item eventKey="0" className="checkout-accord">
                    <Accordion.Header>
                      <h6 className="mb-0 tx-14">Order Summary</h6>
                    </Accordion.Header>
                    <Accordion.Body>
                      {contextValues?.cartSessionData.map((value, index) => {
                        return (
                          <div className="cartsec mt-0 pb-0" key={index} style={{ borderBottom: '0px' }}>
                            <div className="row g-3">
                              <div className="col-lg-2 col-3">
                                <div className="cartsec-media"><img src={value.cart_prod_image} /></div>
                              </div>
                              <div className="col-lg-9 col-9">
                                <h6 className="cartsec-name"><a href="#" onClick={(e) => e.preventDefault()} className="mycartbox-title">{value?.product?.product_name}</a></h6>
                                <h6>Quantity: {value.cart_qty}</h6>
                                <div className="cartsec-price">
                                  <div className="price-new me-2">₹{formatter.format(value.cart_prod_sellingprice)}</div>
                                  {value.cart_prod_discount > 0 ? <div className="price-old">MRP. ₹{formatter.format(value.cart_prod_price)}</div> : null}
                                </div>
                                {(() => {
                                  const productVariations = value.cart_product_variation
                                    ? JSON.parse(value.cart_product_variation)
                                    : [];
                                  const selectedProducts = value.cart_selected_products
                                    ? JSON.parse(value.cart_selected_products)
                                    : [];

                                  if (value.cart_crazy_deal === 0 && productVariations.length > 0) {
                                    return (
                                      <dl>
                                        {productVariations.map((variation, index) => (
                                          <div className="product-option" key={`variation-${index}`}>
                                            <dd>{variation}</dd>
                                          </div>
                                        ))}
                                      </dl>
                                    );
                                  }

                                  if (value.cart_crazy_deal === 1 && selectedProducts.length > 0) {
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
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" className="checkout-accord">
                    <Accordion.Header>
                      <h6 className="mb-0 tx-14">Order Note</h6>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="order-notetextarea">
                        <textarea name="textarea" className="form-control" placeholder="How can we help you?" value={textarea} onChange={handleChangeTextarea} />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2" className="checkout-accord">
                    <Accordion.Header>
                      <h6 className="mb-0 tx-14">Payment Method</h6>
                    </Accordion.Header>
                    <Accordion.Body style={{ padding: '0px' }}>
                      <div className="payment-option-list">
                        <ul>
                          {settingData.admin_shipping_cod === 1 ?
                            <li>
                              <img src="/img/delivery.png" />
                              Cash On Delivery
                              <Form.Check className="ml-auto" name="payment_method" type="radio" value="COD" onChange={(e) => selectpaymentMode('COD')} checked={paymentMethod == 'COD' ? true : false} />
                            </li>
                            : null}
                          <li>
                            <img src="/img/creditcard.png" />
                            Credit/Debit Card
                            <Form.Check className="ml-auto" name="payment_method" type="radio" value="credit-debit" onChange={(e) => selectpaymentMode('credit-debit')} checked={paymentMethod == 'credit-debit' ? true : false} />
                          </li>
                          <li>
                            <img src="/img/phonepe.png" />
                            PhonePe/Gogle Pay/BHIM UPI
                            <Form.Check className="ml-auto" name="payment_method" type="radio" value="upi" onChange={(e) => selectpaymentMode('upi')} />
                          </li>
                          <li>
                            <img src="/img/paytm.png" />
                            Paytm/Payzapp/Wallets
                            <Form.Check className="ml-auto" name="payment_method" type="radio" value="wallet" onChange={(e) => selectpaymentMode('wallet')} />
                          </li>
                          <li>
                            <img src="/img/netbanking.png" />
                            Netbanking
                            <Form.Check className="ml-auto" name="payment_method" type="radio" value="netbanking" onChange={(e) => selectpaymentMode('netbanking')} />
                          </li>
                        </ul>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="col-lg-4">
                <div className='capvs-right'>
                  <div className="panel p-4 mb-3">
                    <div className="panel-header">Price Details</div>
                    <div className="pcb-list mb-4">
                      <ul>
                        <li>Item Total<span className="ml-auto">{formatter.format(contextValues.cartSummary.itemTotal)}</span></li>
                        <li>Discount<span className="ml-auto tx-green">-{formatter.format(contextValues.cartSummary.discount)}</span></li>
                        {paymentMethod !== 'COD' &&
                          <li>Extra 5% Discount On Prepaid Order<span className="ml-auto tx-green">-
                            {(() => {
                              const finalAmount = Number(contextValues.cartSummary.itemTotal) -
                                Number(contextValues.cartSummary.discount) -
                                Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) +
                                Number(shippingCharge);
                              const afterDiscount = (finalAmount * 5) / 100;
                              return `₹${formatter.format(afterDiscount)}`;
                            })()}
                          </span>
                          </li>
                        }
                        <li>Coupon Discount<span className="ml-auto tx-green">-{formatter.format(CouponSession.discount_amount)}</span></li>
                        <li>Shipping Charge<span className="ml-auto" id="shippingAmount">{formatter.format(shippingCharge)}</span></li>
                      </ul>
                    </div>
                    <hr />
                    <div className="pcb-list-second">
                      <ul>
                        <li>
                          Total Amount
                          <span className="ml-auto" id="finalTotal">
                            {(() => {
                              const finalAmount = Number(contextValues.cartSummary.itemTotal) -
                                Number(contextValues.cartSummary.discount) -
                                Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) +
                                Number(shippingCharge);
                              if (paymentMethod !== 'COD') {
                                const afterDiscount = (finalAmount * 5) / 100;
                                return `₹${formatter.format(finalAmount - afterDiscount)}`;
                              } else {
                                return `₹${formatter.format(finalAmount)}`;
                              }
                            })()}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <hr />
                    <p className="text-center mt-20" style={{ color: '#06B2B6' }}>Extra 5% discount on prepaid order</p>
                    <p className="text-center mt-20">We Accepted all Major Cards</p>
                    <div className="cardlist">
                      <i className="fab fa-cc-paypal"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-discover"></i>
                      <i className="fab fa-cc-visa"></i>
                    </div>
                  </div>
                  {spinnerLoading ?
                    <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} />
                    :
                    <a href="#" className="button button--primary" style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); checkOutProccess() }}>Proceed to Checkout</a>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </BrowserView>
    <MobileView>
      <div className='capvs checkutsec' style={{ paddingBottom: '150px' }}>
        <div className="address-checkout">
          <a href="/cart-address" className="change-address">Change</a>
          <h6>Shipping and Billing Address</h6>
          <p style={{ marginBottom: "3px", fontWeight: "600" }}>
            {AddressSession.ua_name} ({AddressSession.ua_address_type == "Other" ? AddressSession.ua_address_type_other : AddressSession.ua_address_type})
          </p>
          <p className="address-full" style={{ marginBottom: "3px" }}>Mobile No: {AddressSession.ua_mobile}</p>
          <div className="address-full">{AddressSession.ua_house_no}, {AddressSession.ua_area}, {AddressSession.ua_city_name}, {AddressSession.ua_state_name}, {AddressSession.ua_pincode}</div>
        </div>
        <Accordion defaultActiveKey={['2']} alwaysOpen>
          <Accordion.Item eventKey="0" className="checkout-accord">
            <Accordion.Header>
              <h6 className="mb-0 tx-14">Order Summary</h6>
            </Accordion.Header>
            <Accordion.Body>
              {contextValues?.cartSessionData.map((value, index) => {
                return (
                  <div className="cartsec mb-3" key={index} style={{ borderBottom: '0px' }}>
                    <div className="row g-3">
                      <div className="col-lg-2 col-3">
                        <div className="cartsec-media"><img src={value.cart_prod_image} /></div>
                      </div>
                      <div className="col-lg-9 col-9">
                        <h6 className="cartsec-name"><a href="#" onClick={(e) => e.preventDefault()} className="mycartbox-title">{value?.product?.product_name}</a></h6>
                        <div className="cartsec-price">
                          <div className="price-new me-2">₹{formatter.format(value.cart_prod_sellingprice)}</div>
                          {value.cart_prod_discount > 0 ? <div className="price-old">MRP. ₹{formatter.format(value.cart_prod_price)}</div> : null}
                        </div>
                        {(() => {
                          const productVariations = value.cart_product_variation
                            ? JSON.parse(value.cart_product_variation)
                            : [];
                          const selectedProducts = value.cart_selected_products
                            ? JSON.parse(value.cart_selected_products)
                            : [];

                          if (value.cart_crazy_deal === 0 && productVariations.length > 0) {
                            return (
                              <dl>
                                {productVariations.map((variation, index) => (
                                  <div className="product-option" key={`variation-${index}`}>
                                    <dd>{variation}</dd>
                                  </div>
                                ))}
                              </dl>
                            );
                          }

                          if (value.cart_crazy_deal === 1 && selectedProducts.length > 0) {
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
              })}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="checkout-accord">
            <Accordion.Header>
              <h6 className="mb-0 tx-14">Order Note</h6>
            </Accordion.Header>
            <Accordion.Body>
              <div className="order-notetextarea">
                <textarea name="textarea" className="form-control" placeholder="How can we help you?" value={textarea} onChange={handleChangeTextarea} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="checkout-accord">
            <Accordion.Header>
              <h6 className="mb-0 tx-14">Payment Method</h6>
            </Accordion.Header>
            <Accordion.Body style={{ padding: '0px' }}>
              <div className="payment-option-list">
                <ul>
                  {settingData.admin_shipping_cod === 1 ?
                    <li>
                      <img src="/img/delivery.png" />
                      Cash On Delivery
                      <Form.Check className="ml-auto" name="payment_method" type="radio" value="COD" onChange={(e) => selectpaymentMode('COD')} checked={paymentMethod == 'COD' ? true : false} />
                    </li>
                    : null}
                  <li>
                    <img src="/img/creditcard.png" />
                    Credit/Debit Card
                    <Form.Check className="ml-auto" name="payment_method" type="radio" value="credit-debit" onChange={(e) => selectpaymentMode('credit-debit')} />
                  </li>
                  <li>
                    <img src="/img/phonepe.png" />
                    PhonePe/Gogle Pay/BHIM UPI
                    <Form.Check className="ml-auto" name="payment_method" type="radio" value="upi" onChange={(e) => selectpaymentMode('upi')} />
                  </li>
                  <li>
                    <img src="/img/paytm.png" />
                    Paytm/Payzapp/Wallets
                    <Form.Check className="ml-auto" name="payment_method" type="radio" value="wallet" onChange={(e) => selectpaymentMode('wallet')} />
                  </li>
                  <li>
                    <img src="/img/netbanking.png" />
                    Netbanking
                    <Form.Check className="ml-auto" name="payment_method" type="radio" value="netbanking" onChange={(e) => selectpaymentMode('netbanking')} />
                  </li>
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="col-lg-4">
          <div className='capvs-right'>
            <div className="panel p-4 mb-3">
              <div className="panel-header">Price Details</div>
              <div className="pcb-list mb-4">
                <ul>
                  <li>Item Total<span className="ml-auto">{formatter.format(contextValues.cartSummary.itemTotal)}</span></li>
                  <li>Discount<span className="ml-auto tx-green">-{formatter.format(contextValues.cartSummary.discount)}</span></li>
                  {paymentMethod !== 'COD' &&
                    <li>Extra 5% Discount On Prepaid Order<span className="ml-auto tx-green">-
                      {(() => {
                        const finalAmount = Number(contextValues.cartSummary.itemTotal) -
                          Number(contextValues.cartSummary.discount) -
                          Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) +
                          Number(shippingCharge);
                        const afterDiscount = (finalAmount * 5) / 100;
                        return `₹${formatter.format(afterDiscount)}`;
                      })()}
                    </span>
                    </li>
                  }
                  <li>Coupon Discount<span className="ml-auto tx-green">-{formatter.format(CouponSession.discount_amount)}</span></li>
                  <li>Shipping Charge<span className="ml-auto" id="shippingAmount">{formatter.format(shippingCharge)}</span></li>
                </ul>
              </div>
              <hr />
              <div className="pcb-list-second">
                <ul>
                  <li>
                    Total Amount
                    <span className="ml-auto" id="finalTotal">
                      {(() => {
                        const finalAmount = Number(contextValues.cartSummary.itemTotal) -
                          Number(contextValues.cartSummary.discount) -
                          Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0) +
                          Number(shippingCharge);
                        if (paymentMethod !== 'COD') {
                          const afterDiscount = (finalAmount * 5) / 100;
                          return `₹${formatter.format(finalAmount - afterDiscount)}`;
                        } else {
                          return `₹${formatter.format(finalAmount)}`;
                        }
                      })()}
                    </span>
                  </li>
                </ul>
              </div>
              <hr />
              <p className="text-center mt-20" style={{ color: '#06B2B6' }}>Extra 5% discount on prepaid order</p>
              <p className="text-center mt-20">We Accepted all Major Cards</p>
            </div>
          </div>
        </div>
        <div className="mcfooter">
          {spinnerLoading ?
            <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} />
            :
            <a href="#" className="button button--primary" style={{ width: '100%' }} onClick={(e) => { e.preventDefault(); checkOutProccess() }}>Proceed to Checkout</a>
          }
        </div>
      </div>
    </MobileView>
  </>
  )
}

export default Checkout