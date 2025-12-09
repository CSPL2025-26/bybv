import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import ReactStars from "react-rating-stars-component";
import { ApiService } from "../../services/apiServices";
import { showToast } from "../utils/toastUtils";

function FeedbackModal({ show, onChildData }) {
  const [showFeedback, setShowFeedback] = useState(show);
  const [saveAllData, setSaveAllData] = useState({ feedback_rating: '', feedback_recommend: '', feedback_remark: "" ,
  feedback_fullname: "",
  feedback_email: "",
  feedback_mobile: "",
})
  const [rating, setRating] = useState('');
  const handleClose = () => {
    setShowFeedback(false)
    onChildData(false)
  }
  const handlechangedata = (e) => {
    const value = e.target.value;
    const key = e.target.name;
    setSaveAllData({ ...saveAllData, [key]: value })
  }
  const handleSubmit = () => {
    if (rating <= 0) {
      showToast('error', 'Please select Ratings', 1500);
      return;
    }

    if (saveAllData.feedback_recommend === "") {
      showToast('error', 'Please select All Inputs', 1500);
      return;
    }

    if (rating === "") {
      showToast('error', 'Please select a feedback rating', 1500);
      return;
    }

    if (saveAllData.feedback_remark === "") {
      showToast('error', 'Please provide feedback remarks', 1500);
      return;
    }

    const dataString = {
      feedback_page: "ORDER_DETAIL",
      feedback_rating: rating,
      feedback_recommend: saveAllData.feedback_recommend,
      feedback_remark: saveAllData.feedback_remark,
      feedback_fullname: saveAllData.feedback_fullname,
      feedback_email: saveAllData.feedback_email,
      feedback_mobile: saveAllData.feedback_mobile,
    };

    ApiService.postData("submit-feedback", dataString).then((res) => {
      if (res.status === "success") {
        showToast('success', "Feedback Submitted Successfully", 1500);
        setTimeout(() => {
          window.location.reload()
        }, 500);
      } else {
        showToast('error', res.message, 1500);
      }
    });

  };
  const ratingChanged = (newRating) => {
    setRating(newRating);

  };
  return (
    <>
      <Modal show={showFeedback} onHide={handleClose} className="feedbackModal bottom">
        <button onClick={handleClose} className="pop-close"></button>
        <Modal.Body>
          <div className="feedbackModalbox-header mb-3">
            <h5 className="tx-theme mb-1">Customer Feedback Form </h5>
            <p className="tx-color-02 tx-12">
              Thank you for taking time to provide feedback. We appreciate hearing from you and will review your comments carefully.
            </p>
          </div>
          <div className="row g-3">
              <div className="col-lg-12">
                <div className="feedback-group mb-1">
                  <label>Full Name</label>
                  <input type="text"
                        name="feedback_fullname"
                        value={saveAllData.feedback_fullname} 
                        onChange={handlechangedata} /> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-1">
                  <label>Email Address</label>
                  <input type="email"
                        name="feedback_email"
                        value={saveAllData.feedback_email}
                        onChange={handlechangedata}/> 
                  </div>
                </div>
                <div className="col-lg-6 col-6">
                <div className="feedback-group mb-3">
                  <label>Phone Number</label>
                  <input type="number"
                        name="feedback_mobile"
                        value={saveAllData.feedback_mobile}
                        onChange={handlechangedata}/> 
                  </div>
                </div>
              </div>
          <div className="feedbackModalbox-form">
            <div className="feedback-from-group mb-3">
              <label>How satisfied are you with our company overall? </label>
              <ReactStars count={5} size={24} activeColor="#ffd700" onChange={ratingChanged} />
            </div>
            <div className="feedback-from-group mb-3">
              <label>Would you recommend it to your friends and colleagues? </label>
              <div className="feedgroup">
                <div className="feedgroup-inner me-5">
                  <input
                    type="radio"
                    name="feedback_recommend"
                    value="yes"
                    checked={saveAllData.feedback_recommend === "yes"}
                    onChange={handlechangedata}
                  />
                  <span className="ms-2">Yes</span>

                </div>
                <div className="feedgroup-inner">
                  <input
                    type="radio"
                    name="feedback_recommend"
                    value="no"
                    checked={saveAllData.feedback_recommend === "no"}
                    onChange={handlechangedata}
                  />
                  <span className="ms-2">No</span>
                </div>
              </div>
            </div>
            <div className="feedback-from-group mb-3">
              <label>Do you have any suggestions to improve our product and service?</label>
              <textarea name="feedback_remark" onChange={handlechangedata}></textarea>
            </div>
            <div className="feedback-from-group mb-3">
              <button type="button" className="button button--primary" onClick={handleSubmit}>Submit</button>
            </div>

          </div>
        </Modal.Body>

      </Modal>
    </>
  );
}

export default FeedbackModal;