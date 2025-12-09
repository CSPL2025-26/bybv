import React, { useEffect, useRef, useState, useContext } from "react";
import Footer from "../../Components/Footer";
import { BrowserView, MobileView } from "react-device-detect";
import CartHeader from "../../Components/Header/cart_header";
import localStorageData from "../../Components/Elements/utils/localStorageData";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import { ApiService } from "../../Components/services/apiServices";
import Modal from "react-bootstrap/Modal";
import CouponModal from "../../Components/Elements/Modals/coupon_modal";
import { ViewCart } from "../../Components/services/facebookTracking";
import LoginModal from "../../Components/Elements/Modals/login_modal";
import DataContext from "../../Components/Elements/context";
import getcartsummary from "../../Components/Elements/utils/getcartsummary";
import SpinnerLoader from "../../Components/Elements/utils/spinner_loader";
import Loader from "react-js-loader";

function Cart() {
  const dataArray = localStorageData();
  const didMountRef = useRef(true)
  const contextValues = useContext(DataContext);

  const CartSession = dataArray['CartSession'];
  const UserSession = dataArray['UserSession'];
  const CouponSession = dataArray['CouponSession'];
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [setSession, SetSession] = useState(localStorage.getItem("USER_SESSION"));
  const [SpinnerCart, setSpinnerCart] = useState(0);

  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handleShow = () => {
    contextValues.setToggleLoginModal(!contextValues.toggleLoginModal)

  };
  const [showCoupon, setShowCoupon] = useState(false);
  const handleShowCoupon = () => setShowCoupon(true);
  const handleCloseCoupon = () => setShowCoupon(false);
  const handleChildCouponData = (status) => {
    setShowCoupon(status);
  };

  useEffect(() => {
    if (didMountRef.current) {
      console.log('CartSession', CartSession);

      if (setSession) {
        cartSessionData()
      } else {
        contextValues.setcartCount(dataArray['CartSession'].length)
        contextValues.setCartSessionData(dataArray['CartSession'])
        contextValues.setCartSummary(dataArray['CartSummary'])
        setSpinnerLoading(false);
      }
      ViewCart(CartSession);
    }
    didMountRef.current = false
  }, [contextValues])

  const cartSessionData = (load = true) => {
    if (load) {
      setSpinnerLoading(true);
    }
    const dataString = {
      coupon_session: localStorage.getItem("COUPON_SESSION"),
    };
    ApiService.postData("cartSessionData", dataString).then((res) => {
      if (res.data.status === "success") {
        contextValues.setCartSessionData(res.data.resCartData)
        contextValues.setcartCount(res.data.resCartData.length)
        contextValues.setCartSummary(res.data.cartSummary)
        setTimeout(() => {
          setSpinnerLoading(false);
        }, 500);
      }
    });
  }

  const removeCoupon = () => {
    localStorage.removeItem("COUPON_SESSION");
    window.location.reload();
  };

  const removeProduct = (productData) => {
    setSpinnerLoading(true);
    localStorage.removeItem("COUPON_SESSION");
    if (localStorage.getItem("USER_SESSION")) {
      const dataString = {
        cart_id: productData.cart_id,
      };
      ApiService.postData("removecartproduct", dataString).then((res) => {
        if (res.data.status === "success") {
          contextValues.setCartSessionData(res.data.resCartData)
          contextValues.setCartSummary(res.data.cartSummary)
          contextValues.setcartCount(res.data.resCartData.length)
          setTimeout(() => {
            setSpinnerLoading(false);
          }, 500);
        } else {
          setTimeout(() => {
            setSpinnerLoading(false);
          }, 500);
        }
      });
    } else {
      let cartSession = localStorage.getItem("CART_SESSION");
      cartSession = cartSession ? JSON.parse(cartSession) : [];
      const existingProductIndex = cartSession.findIndex((item) => {
        return (
          item.product_id === productData.product_id &&
          item.product_crazy_deal === productData.product_crazy_deal &&
          JSON.stringify(item.product_variation) === JSON.stringify(productData.product_variation) &&
          JSON.stringify(item.product_selected_products) === JSON.stringify(productData.product_selected_products)
        );
      });

      if (existingProductIndex !== -1) {
        cartSession.splice(existingProductIndex, 1);
        localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
        let REVcartSession = localStorage.getItem("CART_SESSION");
        REVcartSession = REVcartSession ? JSON.parse(REVcartSession) : [];
        contextValues.setCartSessionData(REVcartSession);
        contextValues.setcartCount(REVcartSession.length);
        if (getcartsummary(REVcartSession)) {
          contextValues.setCartSummary(getcartsummary(REVcartSession));
        }
      }
      showToast('success', "Product Removed Successfully!!!", 1500);
      setTimeout(() => {
        setSpinnerLoading(false);
      }, 500);
    }
  };

  const plustocart = (productData, index) => {
    setSpinnerCart(index);
    if (localStorage.getItem("USER_SESSION")) {
      console.log(index);
      ApiService.postData("plustocartnew", productData).then((res) => {
        if (res.status === "success") {
          localStorage.removeItem("COUPON_SESSION");
          cartSessionData(false)
          showToast('success', 'Product Updated Successfully', 1000);
          setTimeout(() => {
            setSpinnerCart(0);
          }, 500);
        } else {
          showToast('error', res.message, 1000);
          setSpinnerCart(0);
        }
      });
    } else {
      localStorage.removeItem("COUPON_SESSION");
      ApiService.postData("plus-to-cart", productData).then((res) => {
        if (res.status === "success") {
          let cartSession = localStorage.getItem("CART_SESSION");
          cartSession = cartSession ? JSON.parse(cartSession) : [];
          const existingProductIndex = cartSession.findIndex((item) => {
            return (
              item.product_id === productData.product_id &&
              item.product_crazy_deal === productData.product_crazy_deal &&
              JSON.stringify(item.product_variation) === JSON.stringify(productData.product_variation) &&
              JSON.stringify(item.product_selected_products) === JSON.stringify(productData.product_selected_products)
            );
          });
          cartSession[existingProductIndex].quantity += 1;
          localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
          let REVcartSession = localStorage.getItem("CART_SESSION");
          REVcartSession = REVcartSession ? JSON.parse(REVcartSession) : [];
          contextValues.setCartSessionData(REVcartSession);
          contextValues.setcartCount(REVcartSession.length);
          if (getcartsummary(REVcartSession)) {
            contextValues.setCartSummary(getcartsummary(REVcartSession));
          }
          showToast('success', "Cart Updated Successfully!!!", 1500);
          setTimeout(() => {
            setSpinnerCart(0);
          }, 500);
        } else {
          showToast('error', res.message, 1500);
          setSpinnerCart(0);
        }
      });
    }
  };

  const minustocart = (productData, index) => {
    setSpinnerCart(index);
    if (localStorage.getItem("USER_SESSION")) {
      ApiService.postData("minustocartnew", productData).then((res) => {
        if (res.status === "success") {
          localStorage.removeItem("COUPON_SESSION");
          cartSessionData(false)
          showToast('success', 'Product Updated Successfully', 1000);
          setTimeout(() => {
            setSpinnerCart(0);
          }, 500);
        } else {
          showToast('error', res.message, 1000);
          setSpinnerCart(0);
        }
      });
    } else {
      let cartSession = localStorage.getItem("CART_SESSION");
      cartSession = cartSession ? JSON.parse(cartSession) : [];
      localStorage.removeItem("COUPON_SESSION");
      const existingProductIndex = cartSession.findIndex((item) => {
        return (
          item.product_id === productData.product_id &&
          item.product_crazy_deal === productData.product_crazy_deal &&
          JSON.stringify(item.product_variation) === JSON.stringify(productData.product_variation) &&
          JSON.stringify(item.product_selected_products) === JSON.stringify(productData.product_selected_products)
        );
      });

      if (existingProductIndex !== -1) {
        if (cartSession[existingProductIndex].quantity === 1) {
          cartSession.splice(existingProductIndex, 1);
        } else {
          cartSession[existingProductIndex].quantity -= 1;
        }
        localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
        let REVcartSessionsub = localStorage.getItem("CART_SESSION");
        REVcartSessionsub = REVcartSessionsub ? JSON.parse(REVcartSessionsub) : [];
        contextValues.setCartSessionData(REVcartSessionsub);
        contextValues.setcartCount(REVcartSessionsub?.length || 0);
        if (getcartsummary(REVcartSessionsub)) {
          contextValues.setCartSummary(getcartsummary(REVcartSessionsub));
        }
      }
      setTimeout(() => {
        showToast('success', "Cart Updated Successfully!!!", 1500);
        setSpinnerCart(0);
      }, 500);
    }
  };
  return (
    <>
      <BrowserView>
        {spinnerLoading ? <SpinnerLoader /> : <>
          <CartHeader />
          <div className="capvs ">
            <section className="sectionmedium spaced-section">
              {contextValues?.cartSessionData?.length > 0 ? <>
                <div className="section-header__line" style={{ paddingTop: '0px' }}>
                  <div className="container">
                    <div className="section-header__item">
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">My Cart</h2>
                        <a href="/" className="button button--simple"><span className="button-simpl__label">Continue shopping</span></a>
                      </div>
                    </div>
                  </div>
                </div>
              </> : ""}
              <div className="container">
                <div className="row justify-content-between">
                  {contextValues?.cartSessionData.length > 0 ? (
                    <>
                      <div className="col-lg-8">
                        {contextValues?.cartSessionData.map((value, index) => {
                          if (setSession) {
                            return (
                              <div className="cartsec" key={index}>
                                <div className="row">
                                  <div className="col-lg-2 col-3">
                                    <div className="cartsec-media">
                                      <img src={value.cart_prod_image} width={100} />
                                    </div>
                                  </div>
                                  <div className="col-lg-10 col-9">
                                    <h5 className="cartsec-name">
                                      <a href="javascript:void(0)">{value?.product?.product_name}</a>
                                    </h5>
                                    <div className="cartsec-price">
                                      <div className="price-new me-3">
                                        ₹{formatter.format(value.cart_prod_sellingprice)}
                                      </div>
                                      {value.cart_prod_discount > 0 ? <div className="price-old">
                                        ₹{formatter.format(value.cart_prod_price)}
                                      </div> : null}
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
                                    <div className="cartsec-footer">
                                      <div className="quantity">
                                        <button className="quantity__button" onClick={(e) => minustocart(value, index + Number(1))}>
                                          <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                            <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                          </svg>
                                        </button>
                                        <div>
                                          {SpinnerCart > 0 && SpinnerCart == index + Number(1) ?
                                            <div className='qtyloder'>
                                              <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={14} />
                                            </div>
                                            :
                                            <span id="spanQty20" className="quantity__input qtyinput" >{value.cart_qty}</span>
                                          }</div>
                                        <button className="quantity__button" onClick={(e) => plustocart(value, index + Number(1))}>
                                          <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                            <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                          </svg>
                                        </button>
                                      </div>
                                      <div className="cartsec-buttongroup">
                                        <a className="btn-remove"
                                          href="javascript:void(0)"
                                          onClick={(e) => removeProduct(value)}
                                        >
                                          <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                            <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="cartsec" key={index}>
                                <div className="row">
                                  <div className="col-lg-2 col-3">
                                    <div className="cartsec-media">
                                      <img src={value.product_image} width={100} />
                                    </div>
                                  </div>
                                  <div className="col-lg-10 col-9">
                                    <h5 className="cartsec-name">
                                      <a href="javascript:void(0)">{value.product_name}</a>
                                    </h5>
                                    <div className="cartsec-price">
                                      <div className="price-new me-3">
                                        ₹{formatter.format(value.product_selling_price)}
                                      </div>
                                      {value.product_discount > 0 ? <div className="price-old">
                                        ₹{formatter.format(value.product_price)}
                                      </div> : null}
                                    </div>
                                    {(() => {
                                      const productVariations = value.product_variation
                                        ? value.product_variation
                                        : [];
                                      const selectedProducts = value.product_selected_products
                                        ? value.product_selected_products
                                        : [];

                                      if (value.product_crazy_deal === 0 && productVariations.length > 0) {
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

                                      if (value.product_crazy_deal === 1 && selectedProducts.length > 0) {
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
                                    <div className="cartsec-footer">
                                      <div className="quantity">
                                        <button className="quantity__button" onClick={(e) => minustocart(value, index + Number(1))}>
                                          <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                            <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                          </svg>
                                        </button>
                                        <div>
                                          {SpinnerCart > 0 && SpinnerCart == index + Number(1) ?
                                            <div className='qtyloder'>
                                              <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={14} />
                                            </div>
                                            :
                                            <span id="spanQty20" className="quantity__input qtyinput">{value.quantity}</span>
                                          }</div>

                                        <button className="quantity__button" onClick={(e) => plustocart(value, index + Number(1))}>
                                          <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                            <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                          </svg>
                                        </button>
                                      </div>
                                      <div className="cartsec-buttongroup">
                                        <a className="btn-remove"
                                          href="javascript:void(0)"
                                          onClick={(e) => removeProduct(value)}
                                        >
                                          <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                            <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div className="col-lg-4">
                        <div className="capvs-right">
                          <div className="panel p-4 mb-3">
                            <div className="panel-body">
                              {UserSession ?
                                CouponSession.discount_amount === 0 ? (
                                  <div className="applycoup-desktop" onClick={(e) => handleShowCoupon(true)}>
                                    <div className="applycoup-mobile-text">
                                      <img src="/img/presents.png"></img>
                                      <h6 className="mb-0 tx-12">Apply Coupon</h6>
                                    </div>
                                    <div className="applycoup-mobile-arrow">
                                      <svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs"><path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path></svg>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="applycoup-desktop" onClick={removeCoupon}>
                                    <div className="applycoup-mobile-text">
                                      <h6 className="mb-0 tx-12">{CouponSession.promo_code} applied</h6>
                                    </div>
                                    <div className="applycoup-mobile-arrow">
                                      <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                        <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                    </div>
                                  </div>
                                ) :
                                <div className="applycoup-desktop" onClick={handleShow}>
                                  <div className="applycoup-mobile-text">
                                    <img src="/img/presents.png"></img>
                                    <h6 className="mb-0 tx-12">Apply Coupon</h6>
                                  </div>
                                  <div className="applycoup-mobile-arrow">
                                    <svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs"><path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path></svg>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="panel p-4 mb-3">
                            <div className="panel-header">Cart Summary</div>
                            <div className="panel-body">
                              <div className="pcb-list mt-3">
                                <ul>
                                  <li>
                                    Item Total
                                    <span className="ml-auto">
                                      ₹{formatter.format(contextValues.cartSummary.itemTotal)}
                                    </span>
                                  </li>
                                  <li>
                                    Discount
                                    <span className="ml-auto tx-green">
                                      -₹{formatter.format(contextValues.cartSummary.discount)}
                                    </span>
                                  </li>
                                  <li>
                                    Coupon Discount
                                    <span className="ml-auto tx-green">-₹{formatter.format(CouponSession.discount_amount)}</span>
                                  </li>
                                  <li> Shipping & taxes calculated at checkout</li>
                                </ul>
                              </div>
                              <hr />
                              <div className="pcb-list-second">
                                <ul>
                                  <li>
                                    Total Amount
                                    <span className="ml-auto">
                                      ₹{formatter.format(Number(contextValues.cartSummary.itemTotal) - Number(contextValues.cartSummary.discount) - Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0))}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <hr />
                              <p className="text-center mt-20">
                                We Accepted all Major Cards
                              </p>
                              <div className="cardlist">
                                <i className="fab fa-cc-paypal"></i>
                                <i className="fab fa-cc-mastercard"></i>
                                <i className="fab fa-cc-discover"></i>
                                <i className="fab fa-cc-visa"></i>
                              </div>
                            </div>
                          </div>
                          {UserSession ? (
                            <a
                              href="/cart-address"
                              className="button button--primary" style={{ width: '100%' }}
                            >
                              Proceed to Checkout
                            </a>
                          ) : (
                            <a
                              href="javascript:void(0)"
                              className="button button--primary" style={{ width: '100%' }}
                              onClick={() => { handleShow() }}
                            >
                              Proceed to Checkout
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="noimg">
                      <img src="/img/empty-cart.webp" className="img-fluid mb-3" />
                      <h6>Your cart is empty!</h6>
                      <p>There is nothing in your cart. Let's add some items</p>
                      <a
                        href="/"
                        className="button button--primary">
                        Continue Shopping
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
          <Footer></Footer>
        </>}
      </BrowserView>
      <MobileView>
        {spinnerLoading ? <SpinnerLoader /> : <>
          <CartHeader name="Shopping Cart" route="/" stepcount={1}></CartHeader>
          <div>
            <section className="spaced-section">
              {contextValues?.cartSessionData.length > 0 ? (
                <>
                  <div>

                    {contextValues?.cartSessionData.map((value, index) => {
                      if (setSession) {
                        return (
                          <div className="cartsec" key={index}>
                            <div className="row">
                              <div className="col-lg-2 col-3">
                                <div className="cartsec-media">
                                  <img src={value.cart_prod_image} width={100} />
                                </div>
                              </div>
                              <div className="col-lg-10 col-9">
                                <h6 className="cartsec-name">
                                  <a href="javascript:void(0)">{value?.product?.product_name}</a>
                                </h6>
                                <div className="cartsec-price">
                                  <div className="price-new me-3">
                                    ₹{formatter.format(value.cart_prod_sellingprice)}
                                  </div>
                                  {value.product_discount > 0 ? <div className="price-old">
                                    ₹{formatter.format(value.cart_prod_price)}
                                  </div> : null}
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
                                <div className="cartsec-footer">
                                  <div className="quantity">
                                    <button className="quantity__button" onClick={(e) => minustocart(value, index + Number(1))}>
                                      <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                        <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                      </svg>
                                    </button>
                                    <div>
                                      {SpinnerCart > 0 && SpinnerCart == index + Number(1) ?
                                        <div className='qtyloder'>
                                          <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={14} />
                                        </div>
                                        :
                                        <span id="spanQty20" className="quantity__input qtyinput" style={{ height: '3rem' }} >{value.cart_qty}</span>
                                      }</div>
                                    <button className="quantity__button" onClick={(e) => plustocart(value, index + Number(1))}>
                                      <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                        <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="cartsec-buttongroup">
                                    <a className="btn-remove"
                                      href="javascript:void(0)"
                                      onClick={(e) => removeProduct(value)}
                                    >
                                      <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                        <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>);
                      } else {
                        return (
                          <div className="cartsec" key={index}>
                            <div className="row">
                              <div className="col-lg-2 col-3">
                                <div className="cartsec-media">
                                  <img src={value.product_image} width={100} />
                                </div>
                              </div>
                              <div className="col-lg-10 col-9">
                                <h6 className="cartsec-name">
                                  <a href="javascript:void(0)">{value.product_name}</a>
                                </h6>
                                <div className="cartsec-price">
                                  <div className="price-new me-3">
                                    ₹{formatter.format(value.product_selling_price)}
                                  </div>
                                  {value.product_discount > 0 ? <div className="price-old">
                                    ₹{formatter.format(value.product_price)}
                                  </div> : null}
                                </div>
                                {(() => {
                                  const productVariations = value.product_variation
                                    ? value.product_variation
                                    : [];
                                  const selectedProducts = value.product_selected_products
                                    ? value.product_selected_products
                                    : [];

                                  if (value.product_crazy_deal === 0 && productVariations.length > 0) {
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

                                  if (value.product_crazy_deal === 1 && selectedProducts.length > 0) {
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
                                <div className="cartsec-footer">
                                  <div className="quantity">
                                    <button className="quantity__button" onClick={(e) => minustocart(value, index + Number(1))}>
                                      <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                        <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                      </svg>
                                    </button>
                                    <div>
                                      {SpinnerCart > 0 && SpinnerCart == index + Number(1) ?
                                        <div className='qtyloder'>
                                          <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={14} />
                                        </div>
                                        :
                                        <span id="spanQty20" className="quantity__input qtyinput" style={{ height: '3rem' }} >{value.quantity}</span>
                                      }</div>
                                    <button className="quantity__button" onClick={(e) => plustocart(value, index + Number(1))}>
                                      <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                        <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="cartsec-buttongroup">
                                    <a className="btn-remove"
                                      href="javascript:void(0)"
                                      onClick={(e) => removeProduct(value)}
                                    >
                                      <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                        <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>

                  <div>
                    <div className="capvs-right mb-5 pb-5">
                      <div className="panel p-4 applypanel">
                        <div className="panel-body">
                          {UserSession ?
                            CouponSession.discount_amount === 0 ? (
                              <div className="applycoup-desktop" onClick={(e) => handleShowCoupon(true)}>
                                <div className="applycoup-mobile-text">
                                  <img src="/img/presents.png"></img>
                                  <h6 className="mb-0 tx-12">Apply Coupon</h6>
                                </div>
                                <div className="applycoup-mobile-arrow">
                                  <svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs"><path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path></svg>
                                </div>
                              </div>
                            ) : (
                              <div className="applycoup-desktop" onClick={removeCoupon}>
                                <div className="applycoup-mobile-text">
                                  <h6 className="mb-0 tx-12">{CouponSession.promo_code} applied</h6>
                                </div>
                                <div className="applycoup-mobile-arrow">
                                  <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                    <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                  </svg>
                                </div>
                              </div>
                            ) :
                            <div className="applycoup-desktop" onClick={handleShow}>
                              <div className="applycoup-mobile-text">
                                <img src="/img/presents.png"></img>
                                <h6 className="mb-0 tx-12">Apply Coupon</h6>
                              </div>
                              <div className="applycoup-mobile-arrow">
                                <svg width="8" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs"><path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path></svg>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                      <div className="panel p-4 mb-3 cartsummary">
                        <div className="panel-header">Cart Summary</div>
                        <div className="panel-body">
                          <div className="pcb-list mt-3">
                            <ul>
                              <li>
                                Item Total
                                <span className="ml-auto">
                                  ₹{formatter.format(contextValues.cartSummary.itemTotal)}
                                </span>
                              </li>
                              <li>
                                Discount
                                <span className="ml-auto tx-green">
                                  -₹{formatter.format(contextValues.cartSummary.discount)}
                                </span>
                              </li>
                              <li>
                                Coupon Discount
                                <span className="ml-auto tx-green">-₹{formatter.format(CouponSession.discount_amount)}</span>
                              </li>
                              <li> Shipping & taxes calculated at checkout</li>
                            </ul>
                          </div>
                          <hr />
                          <div className="pcb-list-second">
                            <ul>
                              <li>
                                Total Amount
                                <span className="ml-auto">
                                  ₹{formatter.format(Number(contextValues.cartSummary.itemTotal) - Number(contextValues.cartSummary.discount) - Number(CouponSession && CouponSession.discount_amount ? CouponSession.discount_amount : 0))}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <hr />
                          <p className="text-center mt-20">
                            We Accepted all Major Cards
                          </p>
                          <div className="cardlist">
                            <i className="fab fa-cc-paypal"></i>
                            <i className="fab fa-cc-mastercard"></i>
                            <i className="fab fa-cc-discover"></i>
                            <i className="fab fa-cc-visa"></i>
                          </div>
                        </div>
                      </div>
                      <div className="mcfooter">
                        {UserSession ? (
                          <a
                            href="/cart-address"
                            className="button button--primary" style={{ width: '100%' }}
                          >
                            Proceed to Checkout
                          </a>
                        ) : (
                          <a
                            href="javascript:void(0)"
                            className="button button--primary" style={{ width: '100%' }}
                            onClick={() => { handleShow() }}
                          >
                            Proceed to Checkout
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="noimg">
                  <img src="/img/empty-cart.webp" className="img-fluid mb-3" />
                  <h6>Your cart is empty!</h6>
                  <p>There is nothing in your cart. Let's add some items</p>
                  <a
                    href="/"
                    className="button button--primary" style={{ width: '100%' }}
                  >
                    Continue Shopping
                  </a>
                </div>
              )}
            </section>
          </div>
        </>}
      </MobileView>
      <LoginModal />
      <Modal show={showCoupon} onHide={handleCloseCoupon} className="couponModal">
        {showCoupon && <CouponModal
          showCouponmodal={showCoupon}
          onChildCouponData={handleChildCouponData} />}
      </Modal>
    </>

  );
}

export default Cart;
