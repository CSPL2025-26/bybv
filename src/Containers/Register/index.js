import React, { useEffect, useRef, useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import { showToast } from "../../Components/Elements/utils/toastUtils"
import { useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import ReactPixel from "../../Components/services/FacebookPixel";

function Register() {
  const didMountRef = useRef(true)
  const navigate = useNavigate()
  const [spinnerLoading,setSpinnerLoading]=useState(false)
  const [saveAllData, setSaveAllData] = useState({ first_name: '', email: '', password: '' })

  useEffect(() => {
    if (didMountRef.current) {
    }
    didMountRef.current = false
  }, [])

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handlechangedata = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSaveAllData({ ...saveAllData, [name]: value })
  }

  const register = (e) => {
    e.preventDefault()
    if (saveAllData.first_name === '') {
      showToast('error', 'Please enter Full Name')
      return false
    } 
    if (saveAllData.email === '') {
      showToast('error', 'Please enter Email')
      return false
    }
    if (!isValidEmail(saveAllData.email)) {
      showToast('error', 'Email Address is invalid')
      return false
    }     
    if (saveAllData.password === '') {
      showToast('error', 'Please enter Password')
      return false
    }
    if (saveAllData.password.length<5) {
      showToast('error', 'Password must be at least 5 characters long')
      return false
    } 
      setSpinnerLoading(true)
    const dataString = {
      user_fname: saveAllData.first_name,
      user_email: saveAllData.email,
      user_password: saveAllData.password
    }
    ApiService.postData("user-register-process", dataString).then((res) => {
  
      if (res.status === 'success') {
        localStorage.setItem('USER_SESSION', JSON.stringify(res))
        setSpinnerLoading(false)
        ReactPixel.track('CompleteRegistration', {
          content_name: res.data.user_fname,
          status: 1,
          currency: 'INR',
          value: 0,
        });
        navigate("/")
        
        // showToast('success',res.message)
        // setTimeout(()=>{          
        //   navigate("/")
        // },2000)
      }else{
        setSpinnerLoading(false)
        showToast('error', res.message)
      }
    });
  };

  return (
    <>
      <Header />
      <section className="spaced-section login-section">
        <div className="article-template color-background-1">
          <div className="container">
            <div className="login-wrapper">
              <div className="customer login register">
                <div className="login__form">
                  <div className="page-header">
                    <div className="page-header__inner">
                      <div>
                        <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
                          <a href="/" title="Home" className="link-hover-line">Home</a>
                          <div className="breadcrumb__delimiter">
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
                              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
                            </svg>
                          </div>
                          <span>Account</span>
                        </nav>
                      </div>
                      <h2 className="title--page" tabIndex={-1}>Create Account</h2>
                      <div className="login__subtitle">
                        Join our community and enjoy exclusive perks, faster checkout, and personalized recommendations. checkout.
                      </div>
                    </div>
                  </div>
                  <form>
                    {
                      spinnerLoading == false ?                     
                    <div>
                      <div className="customer-form__placeholder-block">
                        <div className="field">
                          <input type="text" name="first_name" id="RegisterForm-FirstName" autocomplete="given-name" placeholder=" " onChange={(e) => handlechangedata(e)} />
                          <label for="RegisterForm-FirstName">Full name</label>
                        </div>
                        <div className="field">
                          <input type="email" name="email" className="field__input" id="CustomerEmail" autocomplete="email" autocorrect="off" autocapitalize="none" required="" placeholder=" " onChange={(e) => handlechangedata(e)} />
                          <label for="CustomerEmail">E-mail</label>
                        </div>
                        <div className="field">
                          <input type="password" name="password" className="field__input" id="CustomerPassword" autocomplete="current-password" required="" placeholder=" " onChange={(e) => handlechangedata(e)} />
                          <label for="CustomerPassword">Password</label>
                        </div>
                      </div>
                      <div className="customer__buttons">
                        <button className="button button--primary" onClick={(e) => register(e)}>
                          Create Account
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
                        <div className="login__page-link">
                          Already have an account?
                          <a href="/login" className="button button--simple">
                            <span className="button-simpl__label">Login</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    :<Triangle
                width="100%"
                height="80px"
                align-items="center"
                justify-content="center"
                color="#121212"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName="loader"
                visible={true}
              />
                    }
                  </form>
                </div>
              </div>
              <div className="login-wrapper__image">
                <div className="login-wrapper__image-box">
                  <img src="/img/login.jpg" sizes="100vw, (min-width: 1023px) 50vw"></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Register;
