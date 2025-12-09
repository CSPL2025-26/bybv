import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiService } from '../../Components/services/apiServices'
import { Alert } from 'react-bootstrap'
import { showToast } from '../../Components/Elements/utils/toastUtils'
import { Helmet } from "react-helmet";
import constants from '../../Components/services/constants'
function DeleteAccount() {

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [AccountDetails, setAccountDetails] = useState({
    account_name: "",
    account_email: "",
    account_mobile: "",
    account_message: "",
  })


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({
      ...AccountDetails,
      [name]: value
    })
  }
  const resetDeleteForm = () => {
    setAccountDetails({
        account_name: "",
        account_email: "",
        account_mobile: "",
        account_message: "",
    });
  };

  function isValidEmail(account_email) {
    return /\S+@\S+\.\S+/.test(account_email);
  }
  function isValidNumber(account_mobile) {
    return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(account_mobile);
  }

  const deleteaccountprocess = () => {
    if (AccountDetails.account_name === '') {
      showToast("error", "Please Enter Name ");
      return false;
    }
    if (!isValidEmail(AccountDetails.account_email)) {
      showToast("error", "Please Enter Valid Email address");
      return false;
    }
    if (!isValidNumber(AccountDetails.account_mobile)) {
      showToast("error", "Please enter a valid Mobile Number");
      return false;
    }

    ApiService.postData("delete-account", AccountDetails).then((res) => {
      if (res.status == "success") {
        setSuccessMessage(res.message)
        resetDeleteForm();
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        setErrorMessage(res.message)
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      }
    })
  }


  return (
    <>
      <Header />
      <section className='spaced-section'>
        <div className="container ">
          <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
            <a href="/" title="Home" className="link-hover-line">Home</a>

            <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg></div>
            <span>Delete Account
            </span>

          </nav>
        </div>

        <div className="shopify-policy__container">
          <div style={{ textAlign: 'center' }}>
            <h1>Delete Account</h1>
          </div>
        </div>
        </section>
        <section className='sectionlarge spaced-section'>
          <div className='container'>
            <div className='row justify-content-center'>

              <div className='col-lg-5 '>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <div className='contactform '>
                  <div className='contactform-group mb-4'>
                    <label>Full Name</label>
                    <input type='text'
                      name='account_name'
                      value={AccountDetails.account_name}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Email Address</label>
                    <input type='text'
                      name='account_email'
                      value={AccountDetails.account_email}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Phone Number</label>
                    <input type='number'
                      name='account_mobile'
                      value={AccountDetails.account_mobile}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Message</label>
                    <textarea
                      name='account_message'
                      value={AccountDetails.account_message}
                      onChange={(e) => { handleInputChange(e) }}
                    ></textarea>
                  </div>
                  <button className="button button--primary" onClick={deleteaccountprocess}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>

      )
}

      export default DeleteAccount