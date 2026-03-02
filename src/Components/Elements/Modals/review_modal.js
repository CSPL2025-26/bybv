import React, { useState } from 'react'
import { ApiService } from '../../services/apiServices';

function ReviewModal({ reviewModalActive, reviewModalToggle, productData }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userReviewDetails, setUserReviewDetails] = useState({
        review: "0",
        comment: "",
        product_id: productData?.product_id,
    });
    const onTodoRegChange = (e) => {
        const { name, value } = e.target;
        setUserReviewDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const userReviewProcess = () => {
        setErrorMessage("");
        if (userReviewDetails.review === '0') {
            setErrorMessage("Please choose rating");
            return false;
        }
        if (userReviewDetails.comment === '') {
            setErrorMessage("Please enter comment");
            return false;
        }
        if (userReviewDetails.product_id === '') {
            setErrorMessage("Product Id missing");
            return false;
        }
        setIsLoading(true)
        ApiService.postData("userReviewProcess", userReviewDetails).then((res) => {
            if (res.status === "success") {
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

    return (
        <>
            <div id='search-modal' className={`search-modal color-background-1${reviewModalActive ? ' active' : ''}`}>
                <div className='search-modal__wrapper'>
                    <h2 className="search-modal__title"><p>Add a Review</p></h2>
                    <div className='search-modal__search-form'>
                        <div className="reviewModalBody">
                            <form method="post" id="reviewForm" enctype='multipart/form-data'>
                                <input type="hidden" name="product_id" id="review_product_id" />
                                <input type="hidden" name="user_id" id="review_user_id" value="" />

                                <div className="alert alert-success d-none" role="alert"></div>
                                <div className="alert alert-danger d-none" role="alert"></div>

                                <div className="review-form mb-3">
                                    <label>Your Rating <span>*</span></label>
                                    <div tabindex="0" aria-label="" className="review-stars" style={{ overflow: "hidden", position: "relative" }}>
                                        <span data-index="0" data-forhalf="★" style={{ position: "relative", overflow: "hidden", cursor: "pointer", display: "block", float: "left", color: "gray", fontSize: "24px" }}>★</span>
                                        <span data-index="1" data-forhalf="★" style={{ position: "relative", overflow: "hidden", cursor: "pointer", display: "block", float: "left", color: "gray", fontSize: "24px" }}>★</span>
                                        <span data-index="2" data-forhalf="★" style={{ position: "relative", overflow: "hidden", cursor: "pointer", display: "block", float: "left", color: "gray", fontSize: "24px" }}>★</span>
                                        <span data-index="3" data-forhalf="★" style={{ position: "relative", overflow: "hidden", cursor: "pointer", display: "block", float: "left", color: "gray", fontSize: "24px" }}>★</span>
                                        <span data-index="4" data-forhalf="★" style={{ position: "relative", overflow: "hidden", cursor: "pointer", display: "block", float: "left", color: "gray", fontSize: "24px" }}>★</span>
                                    </div>
                                    <input type="hidden" name="review" id="review"
                                        value={userReviewDetails.review}
                                        onChange={(e) => onTodoRegChange(e)} />
                                </div>
                                <div className="review-form mb-3">
                                    <label>Your Review <span>*</span></label>
                                    <textarea name="comment" id="comment" className="required"
                                        value={userReviewDetails.comment}
                                        onChange={(e) => onTodoRegChange(e)}
                                    ></textarea>
                                </div>
                                <button type="button" className="btn btn-primary btn-md addreview" disabled={isLoading}  onClick={userReviewProcess}>{isLoading ? (<img src="/img/loder01.gif" width="60px" height="11px" />) : ("Submit")}</button>
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
                            </form>
                        </div>
                    </div>
                    <button type="button" className="search-modal__close modal__close-button link focus-inset modal-close-button" onClick={reviewModalToggle}>
                        <svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
                            <path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={`search-modal__mask color-inverse${reviewModalActive ? ' active' : ''}`} onClick={reviewModalToggle}></div>
        </>
    )
}

export default ReviewModal