import React, { useState, useContext, useEffect, useRef } from 'react'
import {
    BrowserView,
    MobileView,
} from "react-device-detect";
import { useNavigate } from "react-router-dom";
import localStorageData from "../../Components/Elements/utils/localStorageData";
import CartHeader from "../../Components/Header/cart_header";
import SpinnerLoader from "../../Components/Elements/utils/spinner_loader";
import { ApiService } from "../../Components/services/apiServices";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import AddressModal from "../../Components/Elements/Modals/addressModal";
import Skeleton from 'react-loading-skeleton';
import Footer from "../../Components/Footer";
import Loader from "react-js-loader";
import DataContext from '../../Components/Elements/context';
import { trackInitiateCheckout } from "../../Components/services/facebookTracking";

const CartAddress = () => {
    const didMountRef = useRef(true);
    const navigate = useNavigate()
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [skelshow, setskelshow] = useState(true)
    const [showload, setshowload] = useState(true)
    const [resUserAddress, setResUserAddress] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [EditAddrData, setEditAddrData] = useState({});
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };
    const dataArray = localStorageData();
    const contextValues = useContext(DataContext);

    const CartSession = dataArray['CartSession'];
    const CouponSession = dataArray['CouponSession'];
    const CartSummary = dataArray['CartSummary'];
    const UserSession = dataArray['UserSession'];
    const AddressSession = dataArray['AddressSession'];

    useEffect(() => {
        if (didMountRef.current) {
            getUserAddress();
            getCountryData();
            console.log('CSSCCS',CartSession);
            if(localStorage.getItem("USER_SESSION")){
                cartSessionData()
             }else {
                contextValues.setcartCount(dataArray['CartSession'].length)
                contextValues.setCartSessionData(dataArray['CartSession'])
                contextValues.setCartSummary(dataArray['CartSummary'])
            }

        }
        didMountRef.current = false;
    }, []);

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

    const getUserAddress = () => {
        ApiService.fetchData("get-user-address").then((res) => {
            if (res.status === "success") {
                setTimeout(() => {
                    if (res.resUserAddress.length === 0) {
                        setShow(true)
                    }
                    setResUserAddress(res.resUserAddress);
                    setskelshow(false)
                    setshowload(false)

                }, 1000)
            } else {
                localStorage.removeItem("USER_SESSION");
                setskelshow(false)
                setshowload(false)
                navigate("/");
            }
        });
    };
    const getCountryData = () => {
        ApiService.fetchData("get-country").then((res) => {
            if (res.status == "success") {
                setCountryData(res.data);
            }
        });
    };

    const checkAvailibility = (addressData) => {
        setshowload(true)
        setSpinnerLoading(true);
        ApiService.postData("check-shipping-availability", addressData).then((res) => {
            if (res.status === "success") {
                localStorage.removeItem("ADDRESS_SESSION");
                setTimeout(() => {
                    setSpinnerLoading(false);
                    localStorage.setItem("ADDRESS_SESSION", JSON.stringify(addressData));
                    trackInitiateCheckout(contextValues.cartSessionData)
                    navigate("/checkout");
                }, 1000);
            } else {
                setshowload(false);
                setSpinnerLoading(false);
                showToast("error", res.notification, 1500);
            }
        });

    };
    return (
        <>
            <BrowserView>
                <CartHeader />
                {spinnerLoading ? <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} /> : ''}
                    {skelshow ? <>
                        <section className="sectionmedium">
                            <div className="container">
                                <div className="col-lg-12">
                                    <h2 className="text-center"><Skeleton width={250} /></h2>
                                    <div className="row justify-content-md-center">
                                        <div className="col-lg-4">
                                            <div
                                                className="addresscard save-address save-address-checkout"
                                            >
                                                <span className="save-address-check"></span>
                                                <h6 className="mb-1 tx-13">
                                                    <Skeleton width={250} />
                                                    <span className="ms-1">
                                                        <Skeleton width={250} />
                                                    </span>

                                                </h6>
                                                <span className="addresscard-type">
                                                    <Skeleton width={250} />
                                                </span>
                                                <p className="mb-1 address-full">
                                                    <Skeleton width={250} />

                                                </p>
                                                <p className="mb-1 tx-12"><Skeleton width={250} /></p>
                                                <p className="mb-0 tx-12"><Skeleton width={250} /></p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div
                                                className="addresscard save-address save-address-checkout"

                                            >
                                                <span className="save-address-check"></span>
                                                <h6 className="mb-1 tx-13">
                                                    <Skeleton width={250} />
                                                    <span className="ms-1">
                                                        <Skeleton width={250} />
                                                    </span>

                                                </h6>
                                                <span className="addresscard-type">
                                                    <Skeleton width={250} />
                                                </span>
                                                <p className="mb-1 address-full">
                                                    <Skeleton width={250} />

                                                </p>
                                                <p className="mb-1 tx-12"><Skeleton width={250} /></p>
                                                <p className="mb-0 tx-12"><Skeleton width={250} /></p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div
                                                className="addresscard save-address save-address-checkout"

                                            >
                                                <span className="save-address-check"></span>
                                                <h6 className="mb-1 tx-13">
                                                    <Skeleton width={250} />
                                                    <span className="ms-1">
                                                        <Skeleton width={250} />
                                                    </span>

                                                </h6>
                                                <span className="addresscard-type">
                                                    <Skeleton width={250} />
                                                </span>
                                                <p className="mb-1 address-full">
                                                    <Skeleton width={250} />

                                                </p>
                                                <p className="mb-1 tx-12"><Skeleton width={250} /></p>
                                                <p className="mb-0 tx-12"><Skeleton width={250} /></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </> : <>
                        <section className="sectionmedium">
                            <div className="container">
                                <div className="col-lg-12">
                                    <h2 className="text-center">shipping and billing address</h2>
                                    {resUserAddress.length > 0 ? (
                                        <>
                                            <div className="row justify-content-md-center">
                                                {resUserAddress.map((value, index) => (
                                                    <div className="col-lg-4" key={index}>
                                                        <div
                                                            className="addresscard save-address save-address-checkout"
                                                            onClick={(e) => checkAvailibility(value)}
                                                        >
                                                            <span className="save-address-check"></span>
                                                            <h6 className="mb-1 tx-13">
                                                                {value.ua_name}
                                                                <span className="ms-1">
                                                                    {value.ua_default_address === 1
                                                                        ? "(Default)"
                                                                        : ""}
                                                                </span>

                                                            </h6>
                                                            <span className="addresscard-type">
                                                                {value.ua_address_type === "Other"
                                                                    ? value.ua_address_type_other
                                                                    : value.ua_address_type}
                                                            </span>
                                                            <p className="mb-1 address-full">
                                                                {value.ua_house_no}, {value.ua_area},

                                                            </p>
                                                            <p className="mb-1 tx-12">{value.ua_city_name}, {value.ua_state_name}
                                                                {value.ua_pincode}</p>
                                                            <p className="mb-0 tx-12">Mobile No: +91-{value.ua_mobile}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="row justify-content-md-center text-center mt-4">
                                                <div className="col-lg-12">
                                                    <div className="addressbutton">
                                                        <a
                                                            href="#"
                                                            className="button button--primary"
                                                            onClick={handleShow}
                                                        >
                                                            Add New Address
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="noimg">
                                            <img
                                                src="/img/noaddress.png"

                                            />
                                            <h5>Save Your Address Now!</h5>
                                            <p>
                                                Add your home and office addresses and enjoy faster checkout
                                            </p>
                                            <a
                                                href="#"
                                                className="button button--primary mt-3"
                                                onClick={handleShow}
                                            >
                                                Add New Address
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section> 
                    </>} 
                <Footer></Footer>
            </BrowserView>
            <MobileView>
                
            {showload ? <SpinnerLoader /> : <>

                <CartHeader name="Select Address" route="/cart" stepcount={2}></CartHeader>
                {resUserAddress.length > 0 ? (
                    <>
                        {resUserAddress.map((value, index) => (
                            <div key={index}>
                                <div
                                    className="addresscard save-address save-address-checkout"
                                    onClick={(e) => checkAvailibility(value)}
                                >
                                    <span className="save-address-check"></span>
                                    <h6 className="mb-1 tx-13">
                                        {value.ua_name}
                                        <span className="ms-1">
                                            {value.ua_default_address === 1
                                                ? "(Default)"
                                                : ""}
                                        </span>

                                    </h6>
                                    <span className="addresscard-type">
                                        {value.ua_address_type === "Other"
                                            ? value.ua_address_type_other
                                            : value.ua_address_type}
                                    </span>
                                    <p className="mb-1 address-full">
                                        {value.ua_house_no}, {value.ua_area},

                                    </p>
                                    <p className="mb-1 tx-12">{value.ua_city_name}, {value.ua_state_name}
                                        {value.ua_pincode}</p>
                                    <p className="mb-0 tx-12">Mobile No: +91-{value.ua_mobile}</p>
                                </div>
                            </div>
                        ))}

                        <div className="mcfooter">
                            <a href="#" className="button button--primary" style={{ width: '100%' }} onClick={handleShow}>Add New Address</a>
                        </div>

                    </>
                ) : (

                    <div className="noimg">
                        <img
                            src="/img/noaddress.png"

                        />
                        <h5>Save Your Address Now!</h5>
                        <p>
                            Add your home and office addresses and enjoy faster checkout
                        </p>
                        <a
                            href="#"
                            className="button button--primary mt-3"
                            onClick={handleShow}
                        >
                            Add New Address
                        </a>
                    </div>
                )}
                 </>}
            </MobileView>
            {show && (
                <AddressModal
                    showmodal={show}
                    handleClose={handleClose}
                    countryData={countryData}
                    EditAddrData={EditAddrData}
                />
            )}
        </>
    );
};

export default CartAddress;
