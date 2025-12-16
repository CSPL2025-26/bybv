import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../services/apiServices";
import constants from "../../services/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import 'swiper/swiper-bundle.css';
import DataContext from "../context";
import { useNavigate } from "react-router-dom";
function TopSlider() {
  const navigate = useNavigate()
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const [sliderData, setSliderData] = useState([]);
  const [sliderImagePath, setSliderImagePath] = useState("");
  const [sliderMobileData, setSliderMobileData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (contextValues.currentLocation) {
      getSliderData();
    }
    didMountRef.current = false;
  }, [contextValues.currentLocation]);

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const getSliderData = () => {
    setLoading(true);
    const payload = contextValues.currentLocation;

    ApiService.postData("dashboard", payload).then((res) => {
      if (res.status == "success") {
        setSliderData(res.homeTopSliderData);
        setSliderImagePath(res.slider_img_path);
        setSliderMobileData(res.homeTopMobileSliderData);
        setLoading(false)
      }
    });
  };
  const onBannerClick = (e, value) => {
    e.preventDefault()
    if (value.category !== null && value.slider_category !== null) {
      navigate(`/collections/category/${value?.category?.cat_slug}`)
    }
    else if (value.tag !== null && value.slider_tags !== null) {
      navigate(`/collections/tag/${value?.tag?.tag_slug}`)
    }
    else if (value.slider_url !== null) {
      navigate(value.slider_url)
    }

  }
  return (
    <>
      <BrowserView>
        <div className="homeSlider">
          {loading == false ? (
            sliderData.length > 0 ?
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
              >
                {sliderData.map((value, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div key={index}>
                        <a href="#"
                          onClick={(e) => { e.preventDefault(); onBannerClick(e, value) }}>
                          <div>
                            {value.slider_video ? (
                              <video
                                src={value.slider_video ? sliderImagePath + value.slider_video : "/assets/img/v01.mp4"}
                                autoPlay="autoplay"
                                loop
                                muted
                                playsInline
                              ></video>
                            ) : (
                              <img
                                src={
                                  value.slider_image != null
                                    ? sliderImagePath + value.slider_image
                                    : constants.DEFAULT_IMAGE
                                }
                                sizes="100vw"
                                style={{ width: "100%" }}
                              ></img>
                            )}
                          </div>
                          {value.slider_image == '' && value.slider_image == null && (<div className="slideshow-slide__text">
                            <h2 className="slideshow-slide__title h1" style={{ textTransform: "capitalize" }}>
                              {value.slider_name}
                            </h2>
                            <div className="slideshow-slide__desc richtext__content">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: value.slider_desc,
                                }}
                              ></p>
                            </div>
                          </div>)}
                        </a>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
              : null
          ) : (
            <>
              <Skeleton width={"100%"} height={500} />
            </>
          )}
        </div>
        <section className="ticker-section">
          <div className="ticker color-background-4">
            <marquee>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
            </marquee>
          </div>
        </section>
      </BrowserView>
      <MobileView>
        <section className="slideshow-section spaced-section slider_started">
          {loading == false ? (
            sliderMobileData.length > 0 ?
              <Swiper
                className="slideshow"
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                navigation={{
                  prevEl: ".prev",
                  nextEl: ".next",
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: false }}
              >
                {sliderMobileData.map((value, index) => (
                  <SwiperSlide className="slideshow-swiper__slide" key={index}>
                    <div className="slideshow-slide color-background-4" data-id="block_3">
                      <a href="#" onClick={(e) => { e.preventDefault(); onBannerClick(e, value) }}>
                        <div className="slideshow-slide__img have-overlay">
                          {value.slider_video ? (
                            <video src={value.slider_video ? sliderImagePath + value.slider_video : "/assets/img/v01.mp4"} autoPlay="autoplay" loop muted playsInline></video>
                          ) : (
                            <img src={value.slider_image != null ? sliderImagePath + value.slider_image : constants.DEFAULT_IMAGE} sizes="100vw" style={{ width: "100%" }}></img>
                          )}
                        </div>
                        {value.slider_image == '' && value.slider_image == null && (
                          <div className="slideshow-slide__text">
                            <h1 className="slideshow-slide__title h1">
                              {value.slider_name}
                            </h1>
                            <div className="slideshow-slide__desc richtext__content">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: value.slider_desc,
                                }}
                              ></p>
                            </div>
                          </div>
                        )}
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              : null
          ) : (
            <>
              <Skeleton width={"100%"} height={500} />
            </>
          )}
        </section>
        <section className="ticker-section">
          <div className="ticker color-background-4">
            <marquee>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
              <div className="ticker__title">
                <h6 style={{ textTransform: "capitalize" }}>{contextValues.settingData.setting_marquee_tag}</h6>
              </div>
            </marquee>
          </div>
        </section>
      </MobileView>
    </>
  );
}

export default TopSlider;
