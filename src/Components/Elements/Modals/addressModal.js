import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../services/apiServices";
import SpinnerLoader from "../utils/spinner_loader";
function AddressModal({
    showmodal,
    handleClose,
    countryData,
    EditAddrData = null,
    editaddressid
  }) {
    const didMountRef = useRef(true);
    const [show, setShow] = useState(showmodal);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [disablestate,setdisablestate]=useState(false)
    const [showSignup, setshowSignup] = useState(false);
    const [showSignin, setshowSignin] = useState(true);
    const [spinnerLoading, setspinnerLoading] = useState(false);
    const [statesData, setstatesData] = useState([]);
    const [cityData, setcityData] = useState([]);
  
    const [userAddressDetails, setUserAddressDetails] = useState({
      ua_id: 0,
      ua_name: "",
      ua_email: "",
      ua_mobile: "",
      ua_pincode: "",
      ua_house_no: "",
      ua_area: "",
      ua_state_name: "",
      ua_city_name: "",
      ua_address_type: "",
      ua_address_type_other: "",
      ua_state_id: "",
      ua_city_id: "",
      ua_default_address: 0,
      ua_country_id: "101",
    });
  
    // const handleClose = () => {
    //   setShow(false);
    //   onChildData(false);
    // };
    useEffect(() => {
      if (didMountRef.current) {
    
        getStateData();
        getallcityData();
        if (EditAddrData) {
          setUserAddressDetails({
            ua_id: EditAddrData.ua_id,
            ua_name: EditAddrData.ua_name,
            ua_email: "",
            ua_mobile: EditAddrData.ua_mobile,
            ua_pincode: EditAddrData.ua_pincode,
            ua_house_no: EditAddrData.ua_house_no,
            ua_area: EditAddrData.ua_area,
            ua_state_name: EditAddrData.ua_state_name,
            ua_city_name: EditAddrData.ua_city_name,
            ua_address_type: EditAddrData.ua_address_type,
            ua_address_type_other: EditAddrData.ua_address_type_other,
            ua_state_id: EditAddrData.ua_state_id,
            ua_city_id: EditAddrData.ua_city_id,
            ua_default_address: EditAddrData.ua_default_address,
            ua_country_id: EditAddrData.ua_country_id,
          });
        } else {
          setUserAddressDetails({
            ua_id: 0,
            ua_name: "",
            ua_email: "",
            ua_mobile: "",
            ua_pincode: "",
            ua_house_no: "",
            ua_area: "",
            ua_state_name: "",
            ua_city_name: "",
            ua_address_type: "",
            ua_address_type_other: "",
            ua_state_id: "",
            ua_city_id: "",
            ua_default_address: "",
            ua_country_id: "101",
          });
        }
        if (editaddressid !== "" ) {
          getaddressDetail()
        }
      }
      didMountRef.current = false;
    }, []);
  
    const getStateData = () => {
      ApiService.fetchData("get-states-data").then((res) => {
        if (res.status === "success") {
          setstatesData(res.data);
        }
      });
    };
  
    const getallcityData = () => {
      ApiService.fetchData("getallcitydata").then((res) => {
        if (res) {
          setcityData(res);
        }
      });
    };
  
    const onTodoRegChange = (e) => {
      const { name, value } = e.target;
      setUserAddressDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
     
  
      /* if (name === "ua_country_id") {
        if (value === "101") {
          getStateData();
          getallcityData();
        }
      } */
      if (name === "ua_state_id") {
        getcityData(value);
      }
      if (name === "ua_pincode") {
        if (value.length === 6) {
          checkPincode(value);
        } else {
        }
      }
    };
  
    const getcityData = (value) => {
      const dataString = {
        stateid: value,
      };
      ApiService.postData("get-city-data", dataString).then((res) => {
        if (res.status == "success") {
          setcityData(res.data);
        }
      });
    };
  
    const checkPincode = (value) => {
      const dataString = {
        pincode: value,
      };
      setspinnerLoading(true);
      ApiService.postData("check-pincode", dataString).then((res) => {
        if (res.status == "success") {
          setUserAddressDetails((prevState) => ({
            ...prevState,
            ua_state_id: res.data.pin_state_id,
            ua_city_id: res.data.pin_city_id,
          }));
          setdisablestate(true)
          setspinnerLoading(false);
        } 
        else  {
          setUserAddressDetails((prevState) => ({
            ...prevState,
            ua_state_id: "",
            ua_city_id: "",
          }));
          setspinnerLoading(false);
          setdisablestate(false)
        }
      });
    };
    const handleAddressProcess = () => {
  
      let counter = 0;
      const myElements = document.getElementsByClassName("required");
      for (let i = 0; i < myElements.length; i++) {
        if (myElements[i].value === "") {
          myElements[i].style.border = "1px solid red";
          counter++;
        } else {
          myElements[i].style.border = "";
        }
      }
      if (counter === 0) {
        setErrorMessage("");
        if (
          userAddressDetails.ua_state_id == "" &&
          userAddressDetails.ua_country_id == "101"
        ) {
          setErrorMessage("Plese Select State");
          return false;
        } else if (
          userAddressDetails.ua_state_name == "" &&
          userAddressDetails.ua_country_id != "101"
        ) {
          setErrorMessage("Plese Enter State");
          return false;
        } else {
          setErrorMessage("");
        }
        if (
          userAddressDetails.ua_city_id == "" &&
          userAddressDetails.ua_country_id == "101"
        ) {
          setErrorMessage("Plese Select City");
          return false;
        } else if (
          userAddressDetails.ua_city_name == "" &&
          userAddressDetails.ua_country_id != "101"
        ) {
          setErrorMessage("Plese Enter City");
          return false;
        } else {
          setErrorMessage("");
        }
        setspinnerLoading(true);
        
        ApiService.postData("user-address-process", userAddressDetails).then(
          (res) => {
            if (res.status == "success") {
              setSuccessMessage(res.message);
              setspinnerLoading(false);
              window.location.reload();
            } else {
              setErrorMessage(res.message);
              setspinnerLoading(false);
            }
          }
        );
      }
    };
    const getaddressDetail = () => {
      let datastring = {
        addrid: editaddressid
      }
      ApiService.postData("get-address-details", datastring).then((res) => {
        if (res?.status == "success") {
          setUserAddressDetails(res?.resUserAddress)
        }
      })
    }
    return (
      <>
        <Modal show={show} onHide={handleClose} className="addressModal">
          {spinnerLoading ? <SpinnerLoader />:<>
          
          <BrowserView>
            <button onClick={handleClose} className="pop-close"></button>
            <Modal.Body>
              <div className="mb-3 addressModal-header">
                <h5 className="tx-theme mb-1">Add New Address</h5>
                <p style={{fontSize:'12px'}}>Add your home and office addresses and enjoy faster checkout</p>
              </div> 
              <div className="row g-3">
                <div className="col-lg-12">
                  <div className="form-group-white">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="ua_name"
                      className="form-control required"
                      value={userAddressDetails.ua_name}
                      onChange={(e) => onTodoRegChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group-white">
                    <label>Mobile Number</label>
                    <input
                      type="number"
                      name="ua_mobile"
                      className="form-control required"
                      value={userAddressDetails.ua_mobile}
                      onChange={(e) => onTodoRegChange(e)}
                    />
                  </div>
                </div>
  
                <div className="col-lg-6 col-6">
                  <div className="form-group-white">
                    <label>Postcode</label>
                    <input
                      type="number"
                      name="ua_pincode"
                      className="form-control required"
                      value={userAddressDetails.ua_pincode}
                      onChange={(e) => onTodoRegChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div className="form-group-white">
                    <label>State</label> 
                      <select
                        name="ua_state_id"
                        className="form-control ua_state_id"
                        value={userAddressDetails.ua_state_id}
                        onChange={(e) => onTodoRegChange(e)}
                        disabled={userAddressDetails?.ua_state_id!==""&& disablestate==true && userAddressDetails?.ua_state_id!==null?true:false}
                        readOnly={userAddressDetails?.ua_state_id!==""&& disablestate==true && userAddressDetails?.ua_state_id!==null?true:false}
                      >
                        <option value="">Select State</option>
                        {statesData.length > 0 &&
                          statesData.map((value) => (
                            <option value={value.state_id}>
                              {value.state_name}
                            </option>
                          ))}
                      </select> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div className="form-group-white">
                    <label>City</label> 
                      <select
                        name="ua_city_id"
                        className="form-control ua_city_id"
                        disabled={userAddressDetails?.ua_city_id!=="" && disablestate==true&&  userAddressDetails?.ua_city_id!==null?true:false}
                        readOnly={userAddressDetails?.ua_city_id!=="" && disablestate==true&& userAddressDetails?.ua_city_id!==null?true:false}
                        value={userAddressDetails.ua_city_id}
                        onChange={(e) => onTodoRegChange(e)}
                      >
                        <option value="">Select City</option>
                        {cityData.length > 0 &&
                          cityData.map((value) => (
                            <option value={value.cities_id}>
                              {value.cities_name}
                            </option>
                          ))}
                      </select> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div className="form-group-white">
                    <label>House No, Building Name</label>
                    <input
                      type="text"
                      name="ua_house_no"
                      className="form-control required"
                      value={userAddressDetails.ua_house_no}
                      onChange={(e) => onTodoRegChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                  <div className="form-group-white">
                    <label>Road Name, Area, Colony</label>
                    <input
                      type="text"
                      name="ua_area"
                      className="form-control required"
                      value={userAddressDetails.ua_area}
                      onChange={(e) => onTodoRegChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group-white">
                    <label>Address Type</label>
                    <select
                      name="ua_address_type"
                      className="form-control required"
                      value={userAddressDetails.ua_address_type}
                      onChange={(e) => onTodoRegChange(e)}
                    >
                      <option value="">Select</option>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
  
                {userAddressDetails.ua_address_type === "Other" ? (
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <input
                        type="text"
                        name="ua_address_type_other"
                        className="form-control required"
                        value={userAddressDetails.ua_address_type_other}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Enter name"
                      />
                    </div>
                  </div>
                ) : null}
                <div className="col-lg-12">
                  <div className="form-group-white">


                  {editaddressid==""?<>
                  
                  <input type="checkbox" checked={userAddressDetails?.ua_default_address==1?true:false} onClick={(e) => {
                    e.target.checked ? setUserAddressDetails({
                      ...userAddressDetails,
                      ua_default_address: 1,
                    }) : setUserAddressDetails({
                      ...userAddressDetails,
                      ua_default_address: 0,
                    });
                  }}></input><label style={{marginLeft:'10px'}}>Set as Default Address</label>
                  
                       
                  </>:<>
                  
                  <input type="checkbox" checked={userAddressDetails?.ua_default_address==1?true:false} onClick={(e) => {
                   setUserAddressDetails({
                    ...userAddressDetails,
                    ua_default_address:!userAddressDetails?.ua_default_address ,
                  });
                  }}></input><label style={{marginLeft:'10px'}}>Set as Default Address</label></>}
                    {/* <input
                      type="checkbox"
                      name="ua_default_address"
                      value="1"
                      checked={
                        userAddressDetails.ua_default_address == "1"
                          ? true
                          : false
                      }
                      onChange={(e) => onTodoRegChange(e)}
                    />
                    <label className="ms-2">Set default address</label> */}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="button button--secondary" style={{width:'100%', minHeight:'5rem'}} onClick={handleClose}>Cancel</button>
              <button className="button button--primary" style={{width:'100%', minHeight:'5rem'}} onClick={handleAddressProcess}> Save</button>
            </Modal.Footer>
          </BrowserView>
  
          <MobileView>
            <button onClick={handleClose} className="pop-close "></button>
            <Modal.Body className="p-0" style={{background:'#fff'}}>
              <div style={{paddingBottom:'150px'}}>
              <div className="addressModal-header">
                <h3 className="tx-theme mb-1">Add New Address</h3>
                <p style={{fontSize:'12px'}}>Add your home and office addresses and enjoy faster checkout</p>
              </div>
               
              <div className="addressModal-header-title">Contact Details</div>
              <div className="p-3">
                <div className="row g-3">
                  <div className="col-lg-6">
                    <div className="form-group-white">
                      <input
                        type="text"
                        name="ua_name"
                        className="form-control required"
                        value={userAddressDetails.ua_name}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group-white">
                      <input
                        type="number"
                        name="ua_mobile"
                        className="form-control required"
                        value={userAddressDetails.ua_mobile}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Mobile Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="addressModal-header-title">Address Details</div>
              <div className="p-3">
                <div className="row g-3">
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <input
                        type="number"
                        name="ua_pincode"
                        className="form-control required"
                        value={userAddressDetails.ua_pincode}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Pin Code"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <input
                        type="text"
                        name="ua_house_no"
                        className="form-control required"
                        value={userAddressDetails.ua_house_no}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Address (House No, Building, Street, Area)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <input
                        type="text"
                        name="ua_area"
                        className="form-control required"
                        value={userAddressDetails.ua_area}
                        onChange={(e) => onTodoRegChange(e)}
                        placeholder="Road Name, Area, Colony"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="form-group-white"> 
                        <select
                          name="ua_state_id"
                          className="form-control ua_state_id"
                          disabled={userAddressDetails?.ua_state_id!==""&& disablestate==true && userAddressDetails?.ua_state_id!==null?true:false}
                          readOnly={userAddressDetails?.ua_state_id!==""&& disablestate==true && userAddressDetails?.ua_state_id!==null?true:false}
                          value={userAddressDetails.ua_state_id}
                          onChange={(e) => onTodoRegChange(e)}
                        >
                          <option value="">Select State</option>
                          {statesData.length > 0 &&
                            statesData.map((value) => (
                              <option value={value.state_id}>
                                {value.state_name}
                              </option>
                            ))}
                        </select> 
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="form-group-white"> 
                        <select
                          name="ua_city_id"
                          className="form-control ua_city_id"
                          disabled={userAddressDetails?.ua_city_id!==""&& disablestate==true && userAddressDetails?.ua_city_id!==null?true:false}
                          readOnly={userAddressDetails?.ua_city_id!==""&& disablestate==true && userAddressDetails?.ua_city_id!==null?true:false}
                          value={userAddressDetails.ua_city_id}
                          onChange={(e) => onTodoRegChange(e)}
                        >
                          <option value="">Select City</option>
                          {cityData.length > 0 &&
                            cityData.map((value) => (
                              <option value={value.cities_id}>
                                {value.cities_name}
                              </option>
                            ))}
                        </select> 
                    </div>
                  </div>
                </div>
              </div>
              <div className="addressModal-header-title">Save Address As</div>
              <div className="p-3">
                <div className="row g-3">
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <select
                        name="ua_address_type"
                        className="form-control required"
                        value={userAddressDetails.ua_address_type}
                        onChange={(e) => onTodoRegChange(e)}
                      >
                        <option value="">Select</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
  
                  {userAddressDetails.ua_address_type === "Other" ? (
                    <div className="col-lg-12">
                      <div className="form-group-white">
                        <input
                          type="text"
                          name="ua_address_type_other"
                          className="form-control required"
                          value={userAddressDetails.ua_address_type_other}
                          onChange={(e) => onTodoRegChange(e)}
                          placeholder="Enter name"
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="col-lg-12">
                    <div className="form-group-white">
                      <input
                        type="checkbox"
                        name="ua_default_address"
                        value="1"
                        checked={
                          userAddressDetails.ua_default_address == "1"
                            ? true
                            : false
                        }
                        onChange={(e) => onTodoRegChange(e)}
                      />
                      <label className="ms-2">Set default address</label>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="maddress-footer modal-footer">
            <button className="button button--secondary" style={{width:'100%', minHeight:'5rem'}} onClick={handleClose}>Cancel</button>
              <button className="button button--primary" style={{width:'100%', minHeight:'5rem'}} onClick={handleAddressProcess}> Save</button>
              
            </Modal.Footer>
          </MobileView>
          
          
          
          </>}
  
        
        </Modal>
      </>
    );
  }
  export default AddressModal;
