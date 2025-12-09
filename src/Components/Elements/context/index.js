import React, { useState, useEffect, useRef, createContext } from "react";

import { ApiService } from '../../services/apiServices';
const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [cartCount,setcartCount] = useState(0) 
  const [settingData, setSettingData] = useState({});
  const [settingImageBaseUrl, setSettingImageBaseUrl] = useState('');
  const [toggleLoginModal, setToggleLoginModal] = useState(false);
  const [togglePopupModal, settogglePopupModal] = useState(false);
  const [couponSession, setCouponSession] = useState({});
  const [cartSessionData, setCartSessionData] = useState([]);
  const [cartDealSessionData, setCartDealSessionData] = useState([]);
  const [cartSummary, setCartSummary] = useState({});

  const didMountRef = useRef(true);

  useEffect(() => {
    if (didMountRef.current) {
      ApiService.fetchData("settingsdata").then((res) => {
        if (res?.status === "success") {
          setSettingData(res?.sitesettings);
          setSettingImageBaseUrl(res?.setting_image_path);
        }
      });
    }
    didMountRef.current = false;
  }, );

  return (
    <DataContext.Provider value={
      {
        cartCount,setcartCount,
        settingData, setSettingData,
        settingImageBaseUrl, setSettingImageBaseUrl, 
        toggleLoginModal, setToggleLoginModal,
        togglePopupModal, settogglePopupModal, 
        couponSession, setCouponSession,
        cartSessionData, setCartSessionData,
        cartDealSessionData, setCartDealSessionData,
        cartSummary, setCartSummary,

        }
      }>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;