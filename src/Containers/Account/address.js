import { BrowserView, MobileView } from "react-device-detect";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useNavigate } from "react-router-dom";
import { ApiService } from "../../Components/services/apiServices";
import SweetAlert from "react-bootstrap-sweetalert";
import React, { useEffect, useState, useRef } from "react";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import AddressModal from "../../Components/Elements/Modals/addressModal";
import { toast, ToastContainer } from "react-toastify";
import Accountsidebar from "./accountsidebar";
import Skeleton from "react-loading-skeleton";

function Address() {
  const navigate = useNavigate()
  const [ueraddress, setUseraddress] = useState([])
  const [countrydata, setcountrydata] = useState([])
  const [addressInputs, setaddressInputs] = useState({
    ua_fname: "",
    ua_lname: "",
    ua_company_name: "",
    ua_address_1: "",
    ua_area: "",
    ua_pincode: "",
    ua_mobile: "",
    ua_country_id: "",
    ua_city_name: "",
    ua_default_address: false
  })
  const [show, setShow] = useState(false);
  const [addressid, setaddressId] = useState(" ")
  const pathname = window.location.pathname

  const [showaddressmodal, setshowaddressmodal] = useState(false)
  const didMountRef = useRef(true);
  const [loading, setLoading] = useState()
  useEffect(() => {
    if (didMountRef.current) {
      setLoading(true)
      ApiService.fetchData("get-user-address").then((res) => {
        if (res?.status == "success") {
          setUseraddress(res?.resUserAddress)
          setLoading(false)
        }
        else if (res?.message == "No User Found!") {
          localStorage.removeItem("USER_SESSION")
          navigate("/")
        }
      })
    }
    didMountRef.current = false
  }, [])
  // useEffect(() => {
  //   if (addressid !== "" && !show) {
  //     getaddressDetail()
  //   }
  // }, [addressid])

  const fetchaddress = () => {

    ApiService.fetchData("get-user-address").then((res) => {

      if (res?.status == "success") {
        setUseraddress(res?.resUserAddress)
      }
      else if (res?.message == "No User Found!") {

        localStorage.removeItem("USER_SESSION")
        window.location.href = "/"
      }
    })
  }


  const Confirm = () => {
    setShow(false);
    const dataString = {
      addrid: addressid,
    };

    ApiService.postData("remove-address", dataString).then((res) => {
      if (res?.status == "success") {
        fetchaddress();
        setaddressId("")
      } else {
      }
    })

  };

  const handleClose = () => {
    setshowaddressmodal(false)
  }

  const Cancelalert = () => {
    setShow(false);
  };






  return (
    <>
      <Header></Header>
      <BrowserView>
    
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
                  stroke-width="1.3"
                  stroke-linecap="square"
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
                  stroke-width="1.3"
                  stroke-linecap="square"
                ></path>
              </svg>
            </div>
            <span>Addresses</span>

          </nav>
        </div>

        <section className="spaced-section customer-section addresses">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                <Accountsidebar></Accountsidebar>

                <div className="account-block">
                  <div className="account-item__title-box account-item__title-box-border account-block__header">
                    <h2> Address</h2>
                    <div className="button button--simple address-add-new" onClick={() => { setaddressId(" "); setshowaddressmodal(!showaddressmodal) }}>Add New Address</div>
                  </div>
                  {
                    loading == true ? <>
                      {/* skeleton start */}
                      <div className="address-list">
                        <div className="account-item address-list__item-wrapper address-list__item-wrapper--default">
                          <div className="address-list__item">
                            {[...Array(2)]?.map((_, index) => {
                              return <React.Fragment key={index}>
                                <div className="address-list__inner mb-3">
                                  <div className="address-list__wrapper">
                                    <ul className="customer-address__list addresses-address__list">
                                      <li className="customer-address__item addresses-address__list-item">
                                        <h6 className="mb-1 tx-13">
                                          <Skeleton width={150} />
                                        </h6>
                                        <Skeleton width={200} height={50} />
                                      </li>
                                    </ul>
                                    <Skeleton width={150} />

                                  </div>
                                  <div className="address-edit-buttons">
                                    <button className="button button--simple button-address-edit no-js-hidden" type="button">
                                      <span className="button-simpl__label" ><Skeleton width={150} /></span>
                                    </button>

                                  </div>
                                </div>
                              </React.Fragment>
                            })}
                          </div>
                        </div>
                      </div>
                      {/* skeleton end */}
                    </> : <>
                      {ueraddress?.length > 0 ? <>
                        <div className="address-list">
                          <div className="account-item address-list__item-wrapper address-list__item-wrapper--default">
                            <div className="address-list__item">
                              {ueraddress?.map((items, index) => {
                                return <>
                                  <div className="address-list__inner mb-3">
                                    <div className="address-list__wrapper">
                                      <ul className="customer-address__list addresses-address__list">
                                        <li className="customer-address__item addresses-address__list-item">
                                          <h6 className="mb-1 tx-13">
                                            {items.ua_name}{" "}
                                          </h6>
                                          <span className="addresses-address__value">  {items?.ua_house_no ? items?.ua_house_no + "," : ""}{items?.ua_area ? items?.ua_area + "," : ""}{items?.ua_city_name ? items?.ua_city_name + "," : ""}{items?.ua_state_name ? items?.ua_state_name + "," : ""}{items?.ua_country_name ? items?.ua_country_name + "," : ""}</span>
                                        </li>
                                      </ul>
                                      {items?.ua_default_address == 1 ? <span className="small-text default-address">Default</span> : ""}

                                    </div>
                                    <div className="address-edit-buttons">
                                      <button className="button button--simple button-address-edit no-js-hidden" type="button">
                                        <span className="button-simpl__label" onClick={() => { setaddressId(items?.ua_id); setshowaddressmodal(true) }}>Edit Address</span>
                                      </button>
                                      <button className="btn-remove button-address-delete" onClick={() => { setShow(true); setaddressId(items?.ua_id) }}>
                                        <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M16.875 4.375H3.125" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                          <path d="M6.875 1.875H13.125" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"></path>
                                          <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              })}
                            </div>
                          </div>
                        </div>
                      </> : <>
                        <div className="noimg text-center">
                          <img
                            src="/img/noaddressimg.png"
                            className="mb-5"
                            style={{ width: "250px" }}
                          ></img>
                          <h6 className="mb-0">Save Your Address Now</h6>
                          <p>Add Your home and office address and enjoy faster checkout</p>

                          <button
                            className="button button--primary "
                            type="button"
                            onClick={() => { setaddressId(" "); setshowaddressmodal(!showaddressmodal) }}
                          >
                            Add New Address
                          </button>
                        </div>
                      </>
                      }
                    </>
                  }

                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer></Footer>

      </BrowserView>
      <MobileView>
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
                  stroke-width="1.3"
                  stroke-linecap="square"
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
                  stroke-width="1.3"
                  stroke-linecap="square"
                ></path>
              </svg>
            </div>
            <span>Addresses</span>

          </nav>
        </div>

        <section className="spaced-section customer-section addresses">
          <div className="customer account">
            <div className="container">
              <div className="account__wrapper">
                <Accountsidebar></Accountsidebar>

                <div className="account-block">
                  <div className="account-item__title-box account-item__title-box-border account-block__header">
                    <h2> Address</h2>
                    <div className="button button--simple address-add-new" onClick={() => { setaddressId(" "); setshowaddressmodal(!showaddressmodal) }}>Add New Address</div>
                  </div>

                  {
                    loading == true ? <>
                      {/* skeleton start */}


                      <div className="address-list">
                        <div className="account-item address-list__item-wrapper address-list__item-wrapper--default">
                          <div className="address-list__item">
                            {[...Array(2)]?.map((_, index) => {
                              return <React.Fragment key={index}>
                                <div className="address-list__inner mb-3">
                                  <div className="address-list__wrapper">
                                    <ul className="customer-address__list addresses-address__list">
                                      <li className="customer-address__item addresses-address__list-item">
                                        <h6 className="mb-1 tx-13">
                                          <Skeleton width={50} />
                                        </h6>
                                        <Skeleton width={150} height={30} />
                                      </li>
                                    </ul>
                                    <Skeleton width={50} />

                                  </div>
                                  <div className="address-edit-buttons">
                                    <button className="button button--simple button-address-edit no-js-hidden" type="button">
                                      <span className="button-simpl__label" ><Skeleton width={150} /></span>
                                    </button>

                                  </div>
                                </div>
                              </React.Fragment>
                            })}
                          </div>
                        </div>
                      </div>
                      {/* skeleton end */}
                    </> : <>
                      {ueraddress?.length > 0 ? <>
                        <div className="address-list">
                          <div className="account-item address-list__item-wrapper address-list__item-wrapper--default">
                            <div className="address-list__item">
                              {ueraddress?.map((items, index) => {
                                return <>
                                  <div className="address-list__inner mb-3">
                                    <div className="address-list__wrapper">
                                      <ul className="customer-address__list addresses-address__list">
                                        <li className="customer-address__item addresses-address__list-item">
                                          <h6 className="mb-1 tx-13">
                                            {items.ua_name}{" "}
                                          </h6>
                                          <span className="addresses-address__value">  {items?.ua_house_no ? items?.ua_house_no + "," : ""}{items?.ua_area ? items?.ua_area + "," : ""}{items?.ua_city_name ? items?.ua_city_name + "," : ""}{items?.ua_state_name ? items?.ua_state_name + "," : ""}{items?.ua_country_name ? items?.ua_country_name + "," : ""}</span>
                                        </li>
                                      </ul>
                                      {items?.ua_default_address == 1 ? <span className="small-text default-address">Default</span> : ""}

                                    </div>
                                    <div className="address-edit-buttons">
                                      <button className="button button--simple button-address-edit no-js-hidden" type="button">
                                        <span className="button-simpl__label" onClick={() => { setaddressId(items?.ua_id); setshowaddressmodal(true) }}>Edit Address</span>
                                      </button>
                                      <button className="btn-remove button-address-delete" onClick={() => { setShow(true); setaddressId(items?.ua_id) }}>
                                        <svg width="20" height="20" className="icon icon-remove" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M16.875 4.375H3.125" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                          <path d="M6.875 1.875H13.125" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"></path>
                                          <path d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              })}
                            </div>
                          </div>
                        </div>
                      </> : <>
                        <div className="noimg text-center">
                          <img
                            src="/img/noaddressimg.png"
                            className="mb-5"
                            style={{ width: "250px" }}
                          ></img>
                          <h6 className="mb-0">Save Your Address Now</h6>
                          <p>Add Your home and office address and enjoy faster checkout</p>

                          <button
                            className="button button--primary "
                            type="button"
                            onClick={() => { setaddressId(" "); setshowaddressmodal(!showaddressmodal) }}
                          >
                            Add New Address
                          </button>
                        </div>
                      </>
                      }
                    </>
                  }

                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer></Footer>
      </MobileView>




      <SweetAlert
        warning
        confirmBtnCssClass="alertpop"
        title={` Are you sure ? You want to delete the address `}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        show={show}
        onConfirm={Confirm}
        onCancel={Cancelalert}
        btnSize="md"
        showCancel
        cancelBtnBsStyle="danger"
      ></SweetAlert>
      {showaddressmodal ? <>
        <AddressModal showmodal={showaddressmodal} handleClose={handleClose} editaddressid={addressid} ></AddressModal>

      </> : ""}


    </>
  )
}

export default Address