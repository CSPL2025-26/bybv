import { useEffect, useRef, useState, useContext } from 'react';
import OTPInput from 'react-otp-input';
import { ApiService } from '../../services/apiServices';
import Modal from 'react-bootstrap/Modal';
import DataContext from '../context';
import localStorageData from '../utils/localStorageData'

function LoginModal() {
    const [otp, setOtp] = useState('');
    const [steps, setSteps] = useState(1);
    const didMountRef = useRef(true);
    const dataArray = localStorageData();
    const CartSession = dataArray['CartSession'];

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [spinnerLoading, setspinnerLoading] = useState(false);
    const [registerDisable, setRegisterDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    // const [modalopen, setmodalopen] = useState(modalshow);
    const [resendTimer, setResendTimer] = useState(30);
    const [userLoginDetails, setUserLoginDetails] = useState({
        user_mobile: "",
    });
    const [userRegDetails, setUserRegDetails] = useState({
        user_fname: "",
        user_email: "",
        user_mobile: "",
    });
    const contextValues = useContext(DataContext);
    const { settingData, settingImageBaseUrl } = useContext(DataContext);

    const validEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const validNumber = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    
    useEffect(() => {
        if (didMountRef.current) {
        }
        const { user_fname, user_email } = userRegDetails;
        const isEmailValid = validEmail.test(user_email);
        const shouldDisableRegister = !user_fname || !user_email || !isEmailValid;
        setRegisterDisable(shouldDisableRegister);
        didMountRef.current = false;
        const timerId = setInterval(() => {
            if (resendTimer > 0) {
                setResendTimer(resendTimer - 1);
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, [resendTimer, userRegDetails]);

    const onTodoChange = (e) => {
        const { name, value } = e.target;
        setUserLoginDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const onChangeOpt = (otp) => {
        setErrorMessage("");
        setOtp(otp);
        if (otp.length === 4) {
            userLoginOtpProcess(otp);
        }
    };

    const userLogin = () => {
        if (!validNumber.test(userLoginDetails.user_mobile)) {
            setErrorMessage("Please enter valid Mobile Number");
            return false;
        }
        setIsLoading(true)
        ApiService.loginProccessPostData("logincheck", userLoginDetails).then((res) => {
            if (res.status === "success") {
                localStorage.setItem("TEMP_USER_TOKEN", res.user_token);
                setSteps(2);
                setIsLoading(false)
                setResendTimer(30);
            } else {
                setErrorMessage(res.message);
                setIsLoading(false)
            }
        })
    };

    const resendOTP = () => {
        setErrorMessage("");
        setResendTimer(30);
        setOtp("");
        setspinnerLoading(true)
        const dataString = {
            user_token: '',
        }
        ApiService.loginProccessPostData('resendotp', dataString).then((res) => {
            if (res.status === "success") {
                setTimeout(() => {
                    setspinnerLoading(false);
                }, 500);
            } else {
                setErrorMessage(res.message);
                setTimeout(() => {
                    setspinnerLoading(false);
                }, 500);
            }
        });
    }

    const userLoginOtpProcess = (otp) => {
        setErrorMessage("");
        setspinnerLoading(true)
        const dataString = {
            user_otp: otp,
            "session_data": CartSession,

        };
        ApiService.loginProccessPostData("otpverify", dataString).then((res) => {
            if (res.status === "success") {
                if (res.user_status === 'registration_incomplete') {
                    setTimeout(() => {
                        setSteps(3)
                        setspinnerLoading(false)
                    }, 500);
                } else {
                    setTimeout(() => {
                        localStorage.setItem("USER_SESSION", JSON.stringify(res.data));
                        localStorage.removeItem("CART_SESSION"); 
                        window.location.reload();
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    setErrorMessage(res.message);
                    setspinnerLoading(false)
                }, 500);
            }
        });

    };

    const userRegisterProcess = () => {
        setErrorMessage("");
        if (userRegDetails.user_fname === '') {
            setErrorMessage("Please enter Full Name");
            return false;
        } else if (userRegDetails.user_email === '') {
            setErrorMessage("Please enter Email Address");
            return false;
        } else if (!validEmail.test(userRegDetails.user_email)) {
            setErrorMessage("Please enter valid Email Address");
            return false;
        }

        const dataString = {
            "user_fname": userRegDetails.user_fname,
            "user_email": userRegDetails.user_email,
        };
        setIsLoading(true)
        ApiService.loginProccessPostData("registerprocessnew", dataString).then((res) => {
            if (res.status === "success") {
                localStorage.setItem("USER_SESSION", JSON.stringify(res.data));
                setSuccessMessage(res.message)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                setErrorMessage(res.message);
                setTimeout(() => {
                    setIsLoading(false)
                }, 500);
            }
        });
    }

    const onTodoRegChange = (e) => {
        const { name, value } = e.target;
        setUserRegDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const goBack = () => {
        setErrorMessage("");
        setOtp("");
        setSteps(1);
    }
    const loginModal = () => {
        contextValues.setToggleLoginModal(!contextValues.toggleLoginModal)
    }
    return (
        <>
            <Modal show={contextValues.toggleLoginModal} onHide={(e) => loginModal()} className='loginModal'>
                <div className='loginContant'>
                    <button type="button" className="btn-close" onClick={(e) => loginModal()}></button>
                    {steps == 1 && (
                        <>
                            <div className='text-center mb-5'>
                                <img src={settingImageBaseUrl + settingData.logo} className='mb-4' alt="" width="125" height="84" />
                                <h5 className='fw700'>Log in or Sign up</h5>
                                <p className='tx-15'>For Better Experience, Order tracking & Regular updates</p>
                            </div>
                            <div className='form-group country-input mb-4'>
                                <input name="user_mobile" type='number' placeholder='Enter your mobile number' value={userLoginDetails.user_mobile} onChange={(e) => onTodoChange(e)}></input>
                                <span className='country-code'>+91</span>
                            </div>
                            <div className='form-group mb-4'>
                                <button className='button button--primary' style={{width:'100%'}} type='button' onClick={userLogin} disabled={userLoginDetails.user_mobile.length !== 10} >
                                    {isLoading ? (<img src="/img/loder01.gif" width="60px" height="11px" />) : ("Continue")}
                                </button>
                            </div>
                            <p className='text-center tx-12'>By continuing, you agree to our <a href='/terms-condition' className='tx-primary' target='new'>Terms & Conditions</a> & <a href='/privacy-policy' className='tx-primary' target='new'>Privacy policy</a></p>
                        </>
                    )}
                    {steps == 2 && (
                        <>

                            <div className='text-center mb-5'>
                                <h5 className='fw700'>OTP Verification</h5>
                                <p className='tx-gray'>We have sent a verification code to {userLoginDetails.user_mobile} <a href='javascript:;' className='tx-primary' onClick={(e) => goBack()}>Change</a></p>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            <div className='form-group mb-5 otp-input'>
                                <OTPInput
                                    value={otp}
                                    onChange={onChangeOpt}
                                    numInputs={4}
                                    renderInput={(props) => <input {...props} />}
                                />
                            </div>
                            {resendTimer === 0 ? (
                                <p className='tx-gray text-center'>
                                    Did not receive OTP? <a href='javascript:;' className='tx-primary' onClick={(e) => resendOTP()}>Resend OTP</a>
                                </p>
                            ) : (
                                <h6 className='tx-gray text-center'>Resend code in {resendTimer} sec</h6>
                            )}
                            {spinnerLoading && (
                                <div className="siteloader text-center">
                                    <img src="/img/loader.webp" alt="Loading..." width="30" height="30" />
                                </div>
                            )}
                        </>
                    )}

                    {steps == 3 && (
                        <>
                            <div className='text-center mb-5'>
                                <h5 className='fw700'>Complete Your Registration</h5>
                                <p className='tx-gray tx-15'>One stop for 100% authentic & best Nutritional Supplements.</p>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            <div className="form-group mb-4">
                                <input
                                    type="text"
                                    name="user_fname"
                                    className="form-control registerRequired"
                                    value={userRegDetails.user_fname}
                                    onChange={(e) => onTodoRegChange(e)}
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <input
                                    type="text"
                                    name="user_email"
                                    className="form-control registerRequired"
                                    value={userRegDetails.user_email}
                                    onChange={(e) => onTodoRegChange(e)}
                                    placeholder="Email Address"
                                />
                            </div>
                            <button className='button button--primary' style={{width:'100%'}} type='button' onClick={userRegisterProcess} disabled={registerDisable}>
                                {isLoading ? (
                                    <img src="/img/loder01.gif" width="60px" height="11px" />
                                ) : (
                                    "Register"
                                )}
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default LoginModal;
