import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect , useRef, useContext} from "react";
import constants from "../../services/constants";
import DataContext from "../context";
const PopUPModal=({imageUrl, popupbannerdata})=>{
    const contextpopupbannerdatas= useContext(DataContext)
    const didMountRef = useRef(true)
    const popUpModal = () => {
        contextpopupbannerdatas.settogglePopupModal(!contextpopupbannerdatas.togglePopupModal)
    }

    return(<>
      <Modal show={contextpopupbannerdatas.togglePopupModal} onHide={popUpModal} className="cancelModal bottom">
         <button onClick={popUpModal} className="pop-close"><i className="d-icon-times"></i></button>

         <Modal.Body>
           
            {popupbannerdata && ( <div >
       
          <img
            src={popupbannerdata.slider_image ? imageUrl + popupbannerdata.slider_image : constants.DEFAULT_IMAGE}
            alt={popupbannerdata.slider_name}
            className="w-100"
          />
       
      </div>
          )}
        
        </Modal.Body>

       

      </Modal>
    
    </>)
}

export default PopUPModal