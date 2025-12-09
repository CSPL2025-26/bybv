import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiService } from '../../Components/services/apiServices'
import { Alert } from 'react-bootstrap'
import { showToast } from '../../Components/Elements/utils/toastUtils'
import { Helmet } from "react-helmet";
import constants from '../../Components/services/constants'
function Contact() {

  const navigate = useNavigate();
  const didMountRef = useRef(true)
  const [pageData, setPageData] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [settingData, setSettingData] = useState({})
  const [headerImageUrl, setHeaderImageUrl] = useState("")


  const { slug } = useParams();
  const [contactDetails, setContactDetails] = useState({
    contact_name: "",
    contact_email: "",
    contact_mobile: "",
    contact_message: "",
  })

  useEffect(() => {
    if (didMountRef.current) {
      getPagesData()
      getSettingData()

    }
    didMountRef.current = false
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails({
      ...contactDetails,
      [name]: value
    })
  }
  const resetContactForm = () => {
    setContactDetails({
      contact_name: "",
      contact_email: "",
      contact_mobile: "",
      contact_message: "",
    });
  };

  function isValidEmail(contact_email) {
    return /\S+@\S+\.\S+/.test(contact_email);
  }
  function isValidNumber(contact_mobile) {
    return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(contact_mobile);
  }

  const contactprocess = () => {
    if (contactDetails.contact_name === '') {
      showToast("error", "Please Enter Name ");
      return false;
    }
    if (!isValidEmail(contactDetails.contact_email)) {
      showToast("error", "Please Enter Valid Email address");
      return false;
    }
    if (!isValidNumber(contactDetails.contact_mobile)) {
      showToast("error", "Please enter a valid Mobile Number");
      return false;
    }

    ApiService.postData("contact-details", contactDetails).then((res) => {
      if (res.status == "success") {
        setSuccessMessage(res.message)
        resetContactForm();
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

  const getSettingData = () => {

    ApiService.fetchData('settingsdata').then((res) => {
      if (res.status == "success") {
        setSettingData(res.sitesettings)
      }
    })
  }

  const getPagesData = () => {
    const dataString = {
      slug: "contact"
    }
    ApiService.postData('page-content', dataString).then(res => {
      if (res.status === 'success') {
        setPageData(res.pageData)
        setHeaderImageUrl(res.page_header_image_path);
      } else {
        navigate('/error_404')
      }
    })

  }

  return (
    <>
              <Helmet>
        <title>{pageData?.page_meta_title ?? "BYBV"}</title>
        <meta name="description" itemprop="description"content={pageData?.page_meta_desc ?? "BYBV"}/>
        {pageData?.page_meta_keyword && (
        <meta name="keywords" content={pageData.page_meta_keyword} />
        )}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData?.page_meta_title ?? "BYBV"}/>
        <meta name="twitter:url" content={window.location.href} />
        {pageData?.page_header_image ? (
          <meta property="og:image" content={headerImageUrl + pageData.page_header_image} />
        ) : (
          <meta property="og:image" content={constants.FRONT_URL + 'img/logo.png'} />
        )}
        <meta property="og:url" content={window.location.href} />
        {pageData?.page_meta_desc ? (
          <meta property="og:description" content={pageData.page_meta_desc} />
        ) : (
          <meta property="og:description" content="BYBV" />
        )}
        <meta name="twitter:title" content={pageData?.page_meta_title ?? "BYBV"}
        />
        {pageData?.page_meta_desc ? (
          <meta property="twitter:description" content={pageData.page_meta_desc} />
        ) : (
          <meta property="twitter:description" content="BYBV" />
        )}
        {pageData?.page_header_image ? (
          <meta property="twitter:image" content={headerImageUrl + pageData.page_header_image}
          />
        ) : (
          <meta property="twitter:image" content={constants.FRONT_URL + 'img/logo.png'}
          />
        )}
      </Helmet>
      <Header />
      <section className='spaced-section'>
        <div className="container ">
          <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
            <a href="/" title="Home" className="link-hover-line">Home</a>

            <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg></div>
            <span>{pageData.page_name}
            </span>

          </nav>
        </div>

        <div className="shopify-policy__container">
          <div style={{ textAlign: 'center' }}>
            <h1>{pageData.page_name}</h1>
          </div>
        </div>
        </section>
        <section className='sectionlarge spaced-section'>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-lg-4'>
                <h2 className='mb-5'>Contact Info</h2>
                <h4>ByBv Nutra LLP</h4>
                <p><a href="javascript:;" style={{ textDecoration: "none" }}>{settingData.usa_address}</a></p>
                <h4>Admin office in India</h4>
                <p><a href="https://maps.app.goo.gl/u3M1nnSQrSZQuvRR6" target="new" style={{ textDecoration: "none" }}>{settingData.address}</a></p>
                <h4>Email</h4>
                <p><a href={"mailto:" + settingData.admin_email} style={{ textDecoration: "none" }}>{settingData.admin_email}</a></p>
                <h4>Phone</h4>
                <p><a href={"tel:" + settingData.admin_mobile} style={{ textDecoration: "none" }}>{settingData.admin_mobile}</a></p>
              </div>

              <div className='col-lg-5 '>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <div className='contactform '>
                  <h2>Get In Touch</h2>
                  <p>If you have any questions or enquiries please feel free to contact us and we will get back to you as soon as possible</p>
                  <div className='contactform-group mb-4'>
                    <label>Full Name</label>
                    <input type='text'
                      name='contact_name'
                      value={contactDetails.contact_name}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Email Address</label>
                    <input type='text'
                      name='contact_email'
                      value={contactDetails.contact_email}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Phone Number</label>
                    <input type='text'
                      name='contact_mobile'
                      value={contactDetails.contact_mobile}
                      onChange={(e) => { handleInputChange(e) }}
                    ></input>
                  </div>
                  <div className='contactform-group mb-4'>
                    <label>Message</label>
                    <textarea
                      name='contact_message'
                      value={contactDetails.contact_message}
                      onChange={(e) => { handleInputChange(e) }}
                    ></textarea>
                  </div>
                  <button className="button button--primary" onClick={contactprocess}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>

      )
}

      export default Contact