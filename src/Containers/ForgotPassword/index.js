import React, { useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import { ApiService } from "../../Components/services/apiServices";

function Forgotpassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState("");
  const [message, setMessage] = useState({});
  const [forgotemail, setforgotEmail] = useState("");
  const [emailInputs, setEmailInputs] = useState({
    user_email: "",
  });

  const handleEmailInput = (e) => {
    setMessage({});
    const { name, value } = e.target;
    setEmailInputs({
      ...emailInputs,
      [name]: value,
    });
  };

  function isValidEmail(user_email) {
    return /\S+@\S+\.\S+/.test(user_email);
  }

  const forgotpassword = (e) => {
    e.preventDefault();

    if (emailInputs.user_email === "") {
      showToast("error", "Please Enter Your Register Email");
      return false;
    }

    if(!isValidEmail(emailInputs.user_email)){
      showToast("error", "Email Address is Invalid");
      return false;
    }

    setIsLoading(true);
    const dataString = {
      user_email: emailInputs.user_email,
    };
    ApiService.postData("forgotpassword", dataString)
      .then((res) => {
        if (res.status == "success") {
          console.log(res);
          setIsLoading(false);
          showToast(
            "success",
            "We've Sent You an Email With a Link to Update Your Password."
          );
        } else if (res.status == "error") {
          setIsLoading(false);
          const errormsg = res?.message;
          showToast(
            "error",
            errormsg
          );
        }
      })
      .catch((error) => {});
  };

  return (
    <>
      <Header></Header>
      <section className="spaced-section login-section">
        <div className="article-template color-background-1">
          <div className="container">
            <div className="login-wrapper">
              <div className="customer login register">
                <div className="login__form">
                  <div className="page-header">
                    <div className="page-header__inner">
                      <div>
                        <nav
                          className="breadcrumb"
                          role="navigation"
                          aria-label="breadcrumbs"
                        >
                          <a href="/" title="Home" className="link-hover-line">
                            Home
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
                                strokeWidth="1.3"
                                strokeLinecap="square"
                              ></path>
                            </svg>
                          </div>
                          <span>Account</span>
                        </nav>
                      </div>
                      <h2 className="title--page" tabIndex={-1}>
                        RESET YOUR PASSWORD
                      </h2>
                      <div className="login__subtitle">
                        We will send you an email to reset your password
                      </div>
                    </div>
                  </div>
                  <div className="customer-form__placeholder-block login__fields">
                    <form>
                      <div className="field login__field">
                        <input
                          type="email"
                          name="user_email"
                          className="field__input"
                          id="CustomerEmail"
                          autocomplete="email"
                          autocorrect="off"
                          autocapitalize="none"
                          required=""
                          placeholder=" "
                          onChange={(e) => {
                            handleEmailInput(e);
                          }}
                        />
                        <label for="CustomerEmail">E-mail</label>
                      </div>

                      <div className="customer__buttons login__buttons">
                        <button
                          className="button button--primary login__sign-in"
                          onClick={(e) => {
                            forgotpassword(e);
                          }}
                        >
                          {isLoading ? (
                            <img
                              src="/img/loder01.gif"
                              width="60px"
                              height="11px"
                            />
                          ) : (
                            "Send"
                          )}
                          <span>
                            <svg
                              className="icon icon-button-arrow"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2071_16434)">
                                <path
                                  d="M2.24268 12.2427L12.1422 2.34326"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="square"
                                ></path>
                                <path
                                  d="M4.36377 1.63617H12.8491V10.1215"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="square"
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_2071_16434">
                                  <rect
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                  ></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                        </button>
                        <a
                          className="button button--secondary login__create-acc"
                          href="/login"
                        >
                          Cancel
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="login-wrapper__image">
                <div className="login-wrapper__image-box">
                  <img
                    src="/img/login.jpg"
                    sizes="100vw, (min-width: 1023px) 50vw"
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}

export default Forgotpassword;
