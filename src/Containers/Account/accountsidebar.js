import { useEffect, useState, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { BrowserView, MobileView } from "react-device-detect";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Accountsidebar=()=>{
    const navigate = useNavigate();
    const pathname=window.location.pathname
    const [uerdata, setUserdata] = useState("");
    const [show, setShow] = useState(false);
    const location = useLocation();
    const logout = () => {
        setShow(true);
      };
    
      const Confirm = () => {
        localStorage.removeItem("USER_SESSION");
        localStorage.removeItem("MODALOPEN");
        //window.location.reload();
        navigate("/");
      };
    
      const Cancelalert = () => {
        setShow(false);
      };
    return(<>
    
    <div className="account__navigation">
                <div className="account__navigation-wrapper">
                  <ul className="account__navigation-list list-unstyled">
                    <li>
                      <a href="/account" className={`h3 ${pathname=="/account"?"active":""}`}>
                        Account
                      </a>
                    </li>
                    <li>
                      <a href="/address" className={`h3 ${pathname=="/address"?"active":""}`}>
                        Addresses
                      </a>
                    </li>
                    <li>
                      <a href="/orders" className={`h3 ${pathname=="/orders"?"active":""}`}>
                        Orders
                      </a>
                    </li>
                  </ul>
                  <a
                    className="title-link button button--simple"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <span className="button-simpl__label">Log Out</span>
                  </a>
                </div>
              </div>
              <SweetAlert
        warning
        confirmBtnCssClass="alertpop"
        title={` Are you sure ? You want to Logout From ByBv `}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        show={show}
        onConfirm={Confirm}
        onCancel={Cancelalert}
        btnSize="md"
        showCancel
        cancelBtnBsStyle="danger"
      ></SweetAlert>
    
    </>)
}

export default Accountsidebar