import React, { useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import ReactPixel from "../../Components/services/FacebookPixel";

function Login() {
  const [isLoading, setIsLoading] = useState("");
  const [Errorobject, setErrorobject] = useState({});
  const [message, setMessage] = useState({});

  const [loginInputs, setLoginInputs] = useState({
    user_email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const handleLoginInput = (e) => {
    setErrorobject({});
    setMessage({});
    const { name, value } = e.target;

    setLoginInputs({
      ...loginInputs,
      [name]: value,
    });
  };

  function isValidEmail(user_email) {
    return /\S+@\S+\.\S+/.test(user_email);
  }

  const loginprocess = (e) => {
    e.preventDefault();

    if (loginInputs.user_email == "") {
      showToast("error", "Please Enter Email address");
      return false;
    }

    if (!isValidEmail(loginInputs.user_email)) {
      showToast("error", "Email Address is invalid");
      return false;
    }

    if (loginInputs.user_password == "") {
      showToast("error", "Please Enter Password");
      return false;
    }

    setIsLoading(true);
    const dataString = {
      user_email: loginInputs.user_email,
      user_password: loginInputs.user_password,
    };
    ApiService.postData("user-login", dataString).then((res) => {
        if (res.status == "success") {
          let data = res?.data;
          localStorage.setItem("USER_SESSION", JSON.stringify(data));
          setIsLoading(false);
          ReactPixel.track('Login', {
            em: res.data.user_email,
            fo: res.data.user_fname,
          });
          navigate("/");
          console.log("USER_SESSION", JSON.parse(localStorage.getItem("USER_SESSION")));
        } else if (res?.status == "error") {
          setIsLoading(false);

          const errormsg = res?.message;
          if (errormsg == "Invalid Credentials. Please try again") {
            {
              /* setMessage({
              ...message,
              Login_msg: "Invalid Credentials. Please enter correct details",
            });*/
            }
            showToast(
              "error",
              "Invalid Credentials. Please enter correct details"
            );
            return false;
          }
        }
      })
      .catch((error) => { });
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
                        Login
                      </h2>
                      <div className="login__subtitle">
                        Welcome back! Log in to your account to access your
                        order history and enjoy faster checkout.
                      </div>
                    </div>
                  </div>
                  <div className="customer-form__placeholder-block login__fields">
                    <form>
                      <div
                        className={`field login__field ${Errorobject?.user_email !== "" ? "has-error" : ""
                          }`}
                      >
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
                            handleLoginInput(e);
                          }}
                        />
                        <label for="CustomerEmail">E-mail</label>
                      </div>
                      <div
                        className={`field login__field ${Errorobject?.user_password !== "" ? "has-error" : ""
                          }`}
                      >
                        <input
                          type="password"
                          //value=""
                          name="user_password"
                          className="field__input"
                          id="CustomerPassword"
                          autocomplete="current-password"
                          required=""
                          placeholder=" "
                          onChange={(e) => {
                            handleLoginInput(e);
                          }}
                        />
                        <label for="CustomerPassword">Password</label>
                      </div>

                      <div className="customer__buttons login__buttons">
                        <button
                          className="button button--primary login__sign-in"
                          disabled={isLoading}
                          onClick={(e) => {
                            loginprocess(e);
                          }}
                        >
                          {isLoading ? (
                            <img
                              src="/img/loder01.gif"
                              width="60px"
                              height="11px"
                            />
                          ) : (
                            "Sign In"
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
                          href="/register"
                        >
                          Create Account
                        </a>
                      </div>
                      <div className="login__forgot-password">
                        <a href="/forgot-password" className="button button--simple">
                          <span className="button-simpl__label">
                            Forgot Password ?
                          </span>
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
      <Footer />
    </>
  );
}

export default Login;
