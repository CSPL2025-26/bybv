import React, { useState, useContext, useEffect, useRef } from 'react'
import SpinnerLoader from "../utils/spinner_loader";
import { ApiService } from "../../services/apiServices";
import Alert from "react-bootstrap/Alert";
import { showToast } from "../utils/toastUtils";
import Loader from "react-js-loader";
import DataContext from "../context";
import localStorageData from "../utils/localStorageData";
function CouponModal({ showCouponmodal, onChildCouponData }) {
  const didMountRef = useRef(true);
  const [showCart, setShowCart] = useState(showCouponmodal);
  const dataArray = localStorageData();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [setSession, SetSession] = useState(localStorage.getItem("USER_SESSION"));
  const [cartData, SetCartData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const contextValues = useContext(DataContext);

  let { itemTotal } = 0;
  let { discount } = 0;
  let { total_Amount } = 0;
  const [CouponObject, setCouponObject] = useState({
    discount_amount: 0.0,
    promo_id: 0,
    promo_code: "",
    cart_amount: 0.0,
  });
  useEffect(() => {
    if (didMountRef.current) {
      getCouponData()
      if(setSession){
        cartSessionData()
     }else {
        contextValues.setCartSessionData(dataArray['CartSession']);
     }
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
      }
    });
  }

  const handleClose = () => {
    onChildCouponData(false)
  }

  const getCouponData = () => {
    setSpinnerLoading(true)
    ApiService.fetchData("coupons-list").then((res) => {
      if (res.status === "success") {
        setCouponData(res.resCouponsData);
        setSpinnerLoading(false)
      } else {
        setSpinnerLoading(true)
      }
    });
  };

  const onTodoCouponChange = (e) => {
    const { name, value } = e.target;
    setCouponObject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const applyCouponProcess = () => {
    setSuccessMessage('')
    setErrorMessage('')
    if (CouponObject.promo_code === '') {
      showToast('error', "Please enter Coupon Code")
      return false;
    }
    setSpinnerLoading(true);
    const dataString = {
      promo_code: CouponObject.promo_code,
      cart_total: contextValues.cartSummary && contextValues.cartSummary.sellingTotal ? contextValues.cartSummary.sellingTotal : 0,

    };
    ApiService.postData("select-coupon", dataString).then((res) => {
      if (res.data.status === "success") {
        localStorage.removeItem("COUPON_SESSION");
        const couponSessionObj = {
          discount_amount: res.data.discount_amount,
          promo_id: res.data.promo_id,
          promo_code: res.data.promo_code,
        };
        localStorage.setItem(
          "COUPON_SESSION",
          JSON.stringify(couponSessionObj)
        );
        cartSessionData()

        showToast('success', res.data.notification)
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } else {
        showToast('error', res.data.notification)
        setSpinnerLoading(false);
      }
    });
  };
  const handleCopyClick = async (copyText) => {
    setSpinnerLoading(true);
    const dataString = {
      promo_code: copyText,
      cart_total: contextValues.cartSummary && contextValues.cartSummary.sellingTotal ? contextValues.cartSummary.sellingTotal : 0,
    };
    ApiService.postData("select-coupon", dataString).then((res) => {
      if (res.data.status === "success") {
        localStorage.removeItem("COUPON_SESSION");
        const couponSessionObj = {
          discount_amount: res.data.discount_amount,
          promo_id: res.data.promo_id,
          promo_code: res.data.promo_code,
        };
        localStorage.setItem(
          "COUPON_SESSION",
          JSON.stringify(couponSessionObj)
        );
        cartSessionData()

        showToast('success', res.data.notification)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast('error', res.data.notification)
        setSpinnerLoading(false);
      }
    });
  };
  return (
    <>
        <> 
        <div className="couponModal-section" style={{ paddingBlockEnd: "30px" }}>
          <div className="couponModal-header">
            <h6>Apply Coupons</h6>
            <button className="pop-close" onClick={handleClose}></button>
          </div>
          
          <div className="couponModal-search">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (<Alert variant="success">{successMessage}</Alert>)}
          </div>
          <div className="couponModal-search">
            <input type="text" placeholder="Enter Coupon Code"
              name="promo_code"
              value={CouponObject.promo_code}
              onChange={(e) => onTodoCouponChange(e)} />
            <button className="lmc-apply" onClick={applyCouponProcess}> Apply</button>
          </div>
          {spinnerLoading ? <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} /> : ''}
          <div className="apply-coupons-list">
            <ul>
              {couponData.map((valueCoupon, index) => {
                return (
                  <li key={index}>
                    <div className="aclbox">
                      <div className="aclbox-coupon">{valueCoupon.promo_coupon_code}</div>
                      <div className="aclbox-desc">{valueCoupon.promo_description}</div>
                      <div className="aclbox-apply" onClick={(e) => handleCopyClick(valueCoupon.promo_coupon_code)}>Apply</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </> 

    </>
  );
}
export default CouponModal;
