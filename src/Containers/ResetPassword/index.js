import React, { useEffect, useState, useRef } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../Components/Elements/utils/toastUtils";
import { ApiService } from "../../Components/services/apiServices";

function ResetPassword() {
  const navigate = useNavigate();
  const [message, setMessage] = useState({});
  const [userdata,setuserdata]=useState("")
  const [isLoading, setIsLoading] = useState("");
  const [passwordInputs, setpasswordInputs] = useState({
    password: "",
    confirm_password: "",
  });
  const { id} = useParams();
  const didMountRef = useRef(true);
  useEffect(() => {
    if (didMountRef.current) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id')
      const dataString = {
        token: id,
      };
      ApiService.postData("changepassword", dataString).then(
        (res) => {
          if (res?.status == "error") {
            alert(res?.message);
            navigate("/");
          }
          else if(res?.status=="success"){
            setuserdata(res?.userData)
          }
        }
      );
    }
    didMountRef.current = false;
  }, []);

  const handlePasswordInput = (e) => {
    setMessage({});
    const { name, value } = e.target;
    setpasswordInputs({
      ...passwordInputs,
      [name]: value,
    });
  };

  const submitNewPassword = (e) => {
    e.preventDefault();
    if (passwordInputs.password == "") {
      showToast("error", "Please Enter New Password");
      return false;
    }
    if (passwordInputs.confirm_password == "") {
      showToast("error", "Please Enter Confirm Password");
      return false;
    }

    if (passwordInputs.password !== passwordInputs.confirm_password) {
      showToast(
        "error",
        "Your Confirm Password is not matched with New Password"
      );
      return false;
    }

    setIsLoading(true);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    const dataString = {
      token: id,
      password: passwordInputs.password,
      confirm_password:passwordInputs.confirm_password
    };
    ApiService.postData("changepassword", dataString).then((res) => {
       if(res?.status == "success") {
        console.log(res)
        setIsLoading(false);
        showToast("success", "Your Password has been Changed Successfuly")
        navigate("/login")
       } else if (res.status == "error") {
        setIsLoading(false);
         showToast("error", "Something Went Wrong!")
         return false
       }
    }).catch((error) => {});
  };

  return (
    <>
      <Header/>
      <section className="spaced-section login-section">
        <div className="article-template color-background-1">
          <div className="container">
            <div className="login-wrapper">
              <div className="customer login register">
                <div className="login__form">
                  <div className="page-header">
                    <div className="page-header__inner">
                     
                      <h2 className="title--page" tabIndex={-1}>
                        RESET ACCOUNT PASSWORD
                      </h2>
                      <div className="login__subtitle">
                      Enter a new password for {userdata?.user_email}
                      </div>
                    </div>
                  </div>
                  <div className="customer-form__placeholder-block login__fields">
                    <form>
                      <div className="field login__field">
                        <input
                          type="password"
                          name="password"
                          className="field__input"
                          id="CustomerEmail"
                          autocorrect="off"
                          required=""
                          placeholder=" "
                          onChange={(e) => {
                            handlePasswordInput(e);
                          }}
                        />
                        <label for="CustomerEmail">New Password</label>
                       
                      </div>
                      <div className="field login__field">
                      <input
                          type="password"
                          name="confirm_password"
                          className="field__input"
                          id="CustomerEmail"
                          autocorrect="off"
                          autocapitalize="none"
                          required=""
                          placeholder=""
                          onChange={(e) => {
                            handlePasswordInput(e);
                          }}
                        />
                        <label for="CustomerEmail">Confirm Password</label>
                      </div>

                      <div className="customer__buttons login__buttons">
                        <button
                          className="button button--primary login__sign-in"
                          disabled={isLoading}
                          onClick={(e) => {
                            submitNewPassword(e);
                          }}
                        >
                          {isLoading ? (
                            <img
                              src="/img/loder01.gif"
                              width="60px"
                              height="11px"
                            />
                          ) : (
                            "Submit"
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

export default ResetPassword;
