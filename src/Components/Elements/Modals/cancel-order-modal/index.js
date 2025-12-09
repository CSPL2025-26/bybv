import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import { ApiService } from "../../../services/apiServices";
import Alert from "react-bootstrap/Alert";
function OrderCancelModal({ transId,showmodal, onChildData,handleClose, closeModal }) {
  const [orderReason, setOrderReason] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCancelOrder = () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (orderReason === '') {
      setErrorMessage('Please choose cancel reason');
      return false;
    }
    const dataString = {
      trans_id: transId,
      order_reason:orderReason
    };
    ApiService.postData("cancel-order", dataString).then((res) => {
      if (res.data.status === "success") {
        setSuccessMessage(res.data.notification);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
       } else {
        setErrorMessage(res.data.notification);
       }
    });
  };
  return (
    <>
         <Modal show={showmodal} onHide={handleClose} className="cancelModal bottom">
         <button onClick={handleClose} className="pop-close"><i className="d-icon-times"></i></button>

         <Modal.Body>
         <h5 className="tx-theme mb-1">Reason For Cancellation</h5>
            <p className="tx-color-02 tx-12">
              Please choose cancellation reason
          </p>
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}
          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}
       <div className="cancleform">
        <ul>
          <li><input type="radio" value="Order Created by Mistake" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Order Created by Mistake</span></li>
          <li><input type="radio" value="Item(s) Would Not Arrive on Time" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Item(s) Would Not Arrive on Time</span></li>
          <li><input type="radio" value="Shipping Cost too high"name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Shipping Cost too high</span></li>
          <li><input type="radio" value="Item Price Too High" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Item Price Too High</span></li>
          <li><input type="radio" value="Found Cheaper Somewhere Else" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Found Cheaper Somewhere Else</span></li>
          <li><input type="radio" value="Need to change Shipping Address" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Need to change Shipping Address</span></li>
          <li><input type="radio" value="Need to change Shipping Speed" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Need to change Shipping Speed</span></li>
          <li><input type="radio" value="Need to change Billing Address" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Need to change Billing Address</span></li>
          <li><input type="radio" value="Need to change Payment Method" name="cancel_reason" onChange={(e) => setOrderReason(e.target.value)}></input><span>Need to change Payment Method</span></li>

        </ul>
       </div>
          
        </Modal.Body>

        <Modal.Footer>
       
          <button className="button button--primary" onClick={handleCancelOrder}>Submit</button>
        </Modal.Footer>

      </Modal>
    </>
  );
}

export default OrderCancelModal;