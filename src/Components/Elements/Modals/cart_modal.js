import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import localStorageData from '../utils/localStorageData'
import { ApiService } from '../../services/apiServices';
import { showToast } from '../utils/toastUtils';
import SpinnerLoader from "../utils/spinner_loader";
import DataContext from '../context';
import getcartsummary from '../utils/getcartsummary';
import Loader from "react-js-loader";

function CartModal({ cartModalActive, cartModalToggle }) {
    const navigate = useNavigate()
    const dataArray = localStorageData();
    const contextValues = useContext(DataContext);
    const UserSession = dataArray['UserSession'];
    const [setSession, SetSession] = useState(localStorage.getItem("USER_SESSION"));
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [SpinnerCart, setSpinnerCart] = useState(0);
    const [removeSpinnerCart, setremoveSpinnerCart] = useState(0);

    const didMountRef = useRef(true)
    let formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    useEffect(() => {
        if (didMountRef.current) {
            contextValues.setCouponSession(dataArray['CartSession'])
            contextValues.setCartSummary(dataArray['CartSummary'])
            console.log('CartSession', dataArray['CartSession']);

            if (setSession) {
                cartSessionData()
            } else {
                contextValues.setcartCount(dataArray['CartSession'].length)
                contextValues.setCartSessionData(dataArray['CartSession'])
                contextValues.setCartDealSessionData(dataArray['CartDealSession'])
                contextValues.setCartSummary(dataArray['CartSummary'])
            }
        }
        didMountRef.current = false;
    }, [dataArray]);

    const cartSessionData = () => {
        const dataString = {
            coupon_session: localStorage.getItem("COUPON_SESSION"),
        };
        ApiService.postData("cartSessionData", dataString).then((res) => {
            if (res.data.status === "success") {
                contextValues.setCartSessionData(res.data.resCartData)
                contextValues.setcartCount(res.data.resCartData.length)
                contextValues.setCartSummary(res.data.cartSummary)
            }
        });
    }

    const loginModal = () => {
        contextValues.setToggleLoginModal(!contextValues.toggleLoginModal)
    }

    const removeProduct = (productData, index) => {
        setremoveSpinnerCart(index);
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
                        setremoveSpinnerCart(0);
                    }, 500);
                } else {
                    setTimeout(() => {
                        setremoveSpinnerCart(0);
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
                setremoveSpinnerCart(0);
            }, 500);
        }
    };


    const plustocart = (productData, index) => {
        setSpinnerCart(index);
        if (localStorage.getItem("USER_SESSION")) {
            ApiService.postData("plustocartnew", productData).then((res) => {
                if (res.status === "success") {
                    localStorage.removeItem("COUPON_SESSION");
                    cartSessionData()
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
                    cartSessionData()
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
            <div className={`drawer animate${cartModalActive ? ' active' : ''}`}>
                <div className='cart-drawer'>
                    <div className='cart-drawer__overlay' onClick={cartModalToggle}></div>
                    <div className='drawer__inner'>
                        {spinnerLoading ? <SpinnerLoader /> : <>
                            {contextValues?.cartSessionData?.length > 0 ? (
                                <>
                                    <div className="drawer__header">
                                        <h2 className="drawer__heading">Your Cart ({contextValues?.cartSessionData?.length})</h2>
                                        <button type="button" className="drawer__close modal__close-button link focus-inset modal-close-button" onClick={cartModalToggle}>
                                            <svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
                                                <path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <cart-drawer-items>
                                        <div className='cart__contents cart-drawer__form'>
                                            <div className='drawer__contents js-contents'>
                                                <div className='drawer__cart-items-wrapper'>
                                                    {contextValues?.cartSessionData?.map((value, index) => {
                                                        if (setSession) {
                                                            return (
                                                                <div className='cart-item' key={index}>
                                                                    <div className='cart-item__inner-top'>
                                                                        <div className='cart-item__media'>
                                                                            <img src={value.cart_prod_image} className='cart-item__image' alt={value?.product?.product_name}></img>
                                                                        </div>
                                                                        <div className='cart-item__details'>
                                                                            <div className="cart-item__vendor subtitle">{value?.product?.product_category_name}</div>
                                                                            <a href="javascript:void(0)" className="cart-item__name"><span>{value?.product?.product_name}</span></a>
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
                                                                                                    <dd>Item {index+1}: {product.product_name}</dd>
                                                                                                </div>
                                                                                            ))}
                                                                                        </dl>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                            <div className='cart-item__quantity-price'>
                                                                                <div className="price  price--on-sale">
                                                                                    <dl style={{ margin: "0" }}>
                                                                                        <div className='price__sale'>
                                                                                            <dd><span className="price-item price-item--sale">₹{formatter.format(value.cart_prod_sellingprice)}</span></dd>
                                                                                            {value.cart_prod_discount > 0 ? <dd className="price__compare"><span className="price-item price-item--regular">
                                                                                                MRP. ₹{formatter.format(value.cart_prod_price)}
                                                                                            </span></dd> : null}
                                                                                        </div>
                                                                                    </dl>
                                                                                </div>
                                                                                <div className='cart-item__quantity-wrapper'>
                                                                                    <div className="quantity">
                                                                                        <button className="quantity__button no-js-hidden" name="minus" type="button" onClick={(e) => minustocart(value, index + Number(1))}>
                                                                                            <span className="visually-hidden">Decrease quantity for {value.product.product_name}</span>
                                                                                            <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                                                                                <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                        <div>
                                                                                            {SpinnerCart > 0 && SpinnerCart == index + Number(1) ?
                                                                                                <div className='qtyloder'>
                                                                                                    <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={14} />
                                                                                                </div> :
                                                                                                <input className="quantity__input" type="number" name="updates[]" value={value.cart_qty} min="0" />}
                                                                                        </div>
                                                                                        <button className="quantity__button no-js-hidden" name="plus" type="button" onClick={(e) => plustocart(value, index + Number(1))}>
                                                                                            <span className="visually-hidden">Increase quantity for {value.product.product_name}</span>
                                                                                            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                                                                                <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                {removeSpinnerCart > 0 && removeSpinnerCart == index + Number(1) ? <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={30} /> :
                                                                                    <cart-remove-button>
                                                                                        <button type="button" className="btn-remove" style={{ marginTop: '-8px' }} onClick={(e) => removeProduct(value, index + Number(1))}>
                                                                                            <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                                <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                                                                                <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </cart-remove-button>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className='cart-item' key={index}>
                                                                    <div className='cart-item__inner-top'>
                                                                        <div className='cart-item__media'>
                                                                            <img src={value.product_image} className='cart-item__image' alt={value?.product_name}></img>
                                                                        </div>
                                                                        <div className='cart-item__details'>
                                                                            <div className="cart-item__vendor subtitle">{value?.product_category_name}</div>
                                                                            <a href="javascript:void(0)" className="cart-item__name"><span>{value?.product_name}</span></a>
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
                                                                                                    <dd>Item {index+1}: {product.product_name}</dd>
                                                                                                </div>
                                                                                            ))}
                                                                                        </dl>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                            <div className='cart-item__quantity-price'>
                                                                                <div className="price  price--on-sale">
                                                                                    <dl style={{ margin: "0" }}>
                                                                                        <div className='price__sale'>
                                                                                            <dd><span className="price-item price-item--sale">₹{formatter.format(value.product_selling_price)}</span></dd>
                                                                                            {value.product_discount > 0 ? <dd className="price__compare"><span className="price-item price-item--regular">
                                                                                                MRP. ₹{formatter.format(value.product_price)}
                                                                                            </span></dd> : null}
                                                                                        </div>
                                                                                    </dl>
                                                                                </div>
                                                                                <div className='cart-item__quantity-wrapper'>
                                                                                    <div className="quantity">
                                                                                        <button className="quantity__button no-js-hidden" name="minus" type="button" onClick={(e) => minustocart(value, index + Number(1))}>
                                                                                            <span className="visually-hidden">Decrease quantity for {value.product_name}</span>
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
                                                                                                <input className="quantity__input" type="number" name="updates[]" value={value.quantity} min="0" />}
                                                                                        </div>
                                                                                        <button className="quantity__button no-js-hidden" name="plus" type="button" onClick={(e) => plustocart(value, index + Number(1))}>
                                                                                            <span className="visually-hidden">Increase quantity for {value.product_name}</span>
                                                                                            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                                                                                <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                {removeSpinnerCart > 0 && removeSpinnerCart == index + Number(1) ? <Loader type="spinner-cub" bgColor={'#212529'} color={'#212529'} size={30} /> :
                                                                                    <cart-remove-button>
                                                                                        <button type="button" className="btn-remove" style={{ marginTop: '-8px' }} onClick={(e) => removeProduct(value, index + Number(1))}>
                                                                                            <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M16.875 4.375H3.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                                <path d="M6.875 1.875H13.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
                                                                                                <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                                            </svg>
                                                                                        </button>
                                                                                    </cart-remove-button>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </cart-drawer-items>
                                    <div className='drawer__footer'>
                                        <div className='cart-drawer__footer'>
                                            <div className="totals">
                                                <h3 className="totals__subtotal">Discount</h3>
                                                <p className="totals__subtotal-text">Calculated at checkout</p>
                                            </div>
                                            <div className="totals">
                                                <h3 className="totals__subtotal">Shipping</h3>
                                                <p className="totals__subtotal-text">Calculated at checkout</p>
                                            </div>
                                            <div className="totals richtext__content">
                                                <h3 className="totals__subtotal">Subtotal</h3>
                                                <p className="totals__subtotal-value">₹{parseFloat(contextValues.cartSummary.itemTotal)}</p>
                                            </div>
                                        </div>
                                        <div className='cart-drawer__bottom'>
                                            <div className='cart__ctas'>
                                                {UserSession ? (
                                                    <button type="submit" className="cart__checkout-button button button--primary button--full-width" name="checkout" onClick={() => { navigate("/cart-address") }}>
                                                        Checkout
                                                        <span>
                                                            <svg className="icon icon-button-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0_2071_16434)">
                                                                    <path d="M2.24268 12.2427L12.1422 2.34326" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                    <path d="M4.36377 1.63617H12.8491V10.1215" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_2071_16434">
                                                                        <rect width="14" height="14" fill="currentColor"></rect>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="cart__checkout-button button button--primary button--full-width" name="checkout" onClick={() => { loginModal() }}>
                                                        Checkout
                                                        <span>
                                                            <svg className="icon icon-button-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0_2071_16434)">
                                                                    <path d="M2.24268 12.2427L12.1422 2.34326" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                    <path d="M4.36377 1.63617H12.8491V10.1215" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_2071_16434">
                                                                        <rect width="14" height="14" fill="currentColor"></rect>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                )}
                                                <Link to="/cart" className="button button--simple">
                                                    <span className="button-simpl__label">View My Cart</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="drawer__header">
                                        <h2 className="drawer__heading">Shopping Cart</h2>
                                        <button type="button" className="drawer__close modal__close-button link focus-inset modal-close-button" onClick={cartModalToggle}>
                                            <svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
                                                <path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="noimg">
                                        <img src="/img/empty-cart.webp" className="mb-3" alt='cart-image' />
                                        <h6>Your cart is empty!</h6>
                                        <p>There is nothing in your cart. Let's add some items</p>
                                        <a
                                            href="/"
                                            className="button button--primary mt-3"
                                        >
                                            Continue Shopping
                                        </a>
                                    </div>
                                </>
                            )}
                        </>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartModal