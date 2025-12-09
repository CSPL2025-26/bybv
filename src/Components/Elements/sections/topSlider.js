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
    if (didMountRef.current) {
      getSliderData();
    }
    didMountRef.current = false;
  }, []);

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
    ApiService.fetchData("/dashboard").then((res) => {
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
    if (value.category !== null && value.slider_category!==null) {
      navigate(`/collections/category/${value?.category?.cat_slug}`)
    }
    else if (value.tag !==null && value.slider_tags!==null){
      navigate(`/collections/tag/${value?.tag?.tag_slug}`)
    }
    else if(value.slider_url!==null){
      navigate(value.slider_url)
    }

  }
  return (
    <>
      <BrowserView>
        <div className="homeSlider">
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
              return (<>
                <SwiperSlide>
                  <div key={index}>
                    <a href="javascript:void(0)"
                      onClick={(e) => { onBannerClick(e, value) }}>
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
                            style={{width:"100%"}}
                          ></img>
                        )}
                      </div>
                      {value.slider_image=='' &&  value.slider_image==null && ( <div className="slideshow-slide__text">
                      <h2 className="slideshow-slide__title h1" style={{textTransform:"capitalize"}}>
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
              </>)
            })}
          </Swiper>
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
          {loading == false && sliderMobileData.length > 0 ? (
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
              pagination={{ clickable: true }}
              ref={sliderRef}
            >
              {sliderMobileData.map((value, index) => (
                <SwiperSlide className="slideshow-swiper__slide" key={index}>
                  <div
                    className="slideshow-slide color-background-4"
                    data-id="block_3"
                  >
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => { onBannerClick(e, value) }}>
                    
                      <div className="slideshow-slide__img have-overlay">
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
                            style={{width:"100%"}}
                          ></img>
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
                          {/* <div className="slideshow-slide__button">
   <a
     href="/collections/all"
     className="button button--primary button--primary-size "
   >
     Shop all
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
   </a>
 </div> */}
                        </div>

                      )}

                    </a>
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <>
              <Skeleton width={"100%"} height={500} />
            </>
          )}

          {/* <div className="swiper-buttons__wrapper">
            <div className="container">
              <div className="swiper-buttons__box">
                <div
                  className="prev-arrow swiper-button swiper-button-prev color-background-4"
                  tabIndex={0}
                  onClick={handlePrev}
                >
                  <span>
                    <svg
                      width="27"
                      height="22"
                      viewBox="0 0 32 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 14L26 14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                      ></path>
                      <path
                        d="M17.6514 3L29.6514 14L17.6514 25"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                      ></path>
                    </svg>
                  </span>
                </div>
                <div
                  className="next-arrow swiper-button swiper-button-next color-background-4"
                  onClick={handleNext}
                >
                  <span>
                    <svg
                      width="27"
                      height="22"
                      viewBox="0 0 32 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 14L26 14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                      ></path>
                      <path
                        d="M17.6514 3L29.6514 14L17.6514 25"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div> */}
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
