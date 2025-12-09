import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { Swiper, SwiperSlide } from 'swiper/react';
import { ApiService } from "../../services/apiServices";
import Skeleton from 'react-loading-skeleton';


function HomeShipping() {
    const sliderRef = useRef(null);
    const didMountRef = useRef(true);
    const [homeSectionData, setHomeSectionData] = useState([]);
    const [loading, setLoading] = useState()

    useEffect(() => {
        if (didMountRef.current) {

            getSettingsData()
        }
        didMountRef.current = false;
    }, []);


    const getSettingsData = () => {
        setLoading(true)
        ApiService.fetchData("home-section").then((res) => {
            if (res.status === "success") {
                setHomeSectionData(res?.homeIdData)
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        });
    };



    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, [])

    return (
        <>
            <BrowserView>
                {
                    loading == true ? <>
                        <section className='spaced-section multicolumn-section'>
                            <div className='background-1 multicolumn section_border_top section_border_bottom'>
                                <div className='container'>
                                    <div className='multicolumn__wrapper'>
                                        <div className='multicolumn-list'>
                                            <div className='multicolumn-list__wrapper multicolumn-list__wrapper--3'>
                                                {
                                                    [...Array(3)].map((_, index) => {
                                                        return <React.Fragment key={index}>

                                                            <div className='multicolumn-card multicolumn-card--image'>
                                                                <div className='multicolumn-card__image-wrapper'>
                                                                    <div className='multicolumn-card__image-block multicolumn-card__image-size-icon'>
                                                                        <div className='multicolumn-card__image-item multicolumn-card__image-ratio-adapt' >
                                                                            <Skeleton width={100} height={100} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='multicolumn-card__info text-center'>
                                                                    <h4 className="multicolumn-card__info-title h4"><Skeleton width={100} /></h4>
                                                                    <div className="multicolumn-card__info-text"><Skeleton width={250} height={30} /></div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    })
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </> : homeSectionData.length > 0 && (
                        <section className='spaced-section multicolumn-section'>
                            <div className='background-1 multicolumn section_border_top section_border_bottom'>
                                <div className='container'>
                                    <div className='multicolumn__wrapper'>
                                        <div className='multicolumn-list'>
                                            <div className='multicolumn-list__wrapper multicolumn-list__wrapper--3'>
                                                {
                                                    homeSectionData.map((value, index) => {
                                                        return <React.Fragment key={index}>
                                                            <div className='multicolumn-list__item'>
                                                                <div className='multicolumn-card multicolumn-card--image'>
                                                                    <div className='multicolumn-card__image-wrapper'>
                                                                        <div className='multicolumn-card__image-block multicolumn-card__image-size-icon'>
                                                                            <div className='multicolumn-card__image-item multicolumn-card__image-ratio-adapt' style={{ paddingBottom: "98.46153846153847%" }}>
                                                                                <img src={value?.home_image != null ? value?.home_image : ''} alt="" className='header__heading-logo header__logo-light'></img>
                                                                                <img src={value?.home_dark_image != null ? value?.home_dark_image : ''} alt="" className="header__heading-logo header__heading-logo--overlay"></img>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='multicolumn-card__info'>
                                                                        <h4 className="multicolumn-card__info-title h4 ">{value.home_title}</h4>
                                                                        <div className="multicolumn-card__info-text"><p dangerouslySetInnerHTML={{ __html: value.home_desc }}></p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }

            </BrowserView>
            <MobileView>
                {
                    loading == true ? <>
                        <section className='spaced-section multicolumn-section'>
                            <div className="background-1 multicolumn  section_border_top section_border_bottom">
                                <div className="container">
                                    <div className="multicolumn__wrapper">
                                        <div className="multicolumn-list" style={{ position: 'relative' }}>
                                            <div>
                                                <Swiper className="multicolumn-list__wrapper multicolumn-list__wrapper--3" ref={sliderRef}>

                                                    {
                                                        [...Array(3)].map((_, index) => {
                                                            return <React.Fragment key={index}>
                                                                <SwiperSlide>
                                                                    <div className="multicolumn-list__item">
                                                                        <div className="multicolumn-card multicolumn-card--image ">
                                                                            <div className="multicolumn-card__image-wrapper">
                                                                                <div className="multicolumn-card__image-block multicolumn-card__image-size-icon">
                                                                                    <div className="multicolumn-card__image-item multicolumn-card__image-ratio-adapt" style={{ paddingBottom: '50.46153846153847%' }}>
                                                                                        <Skeleton width={70} height={70} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="multicolumn-card__info">
                                                                                <h4 className="multicolumn-card__info-title h4"><Skeleton width={100} /></h4>
                                                                                <div className="multicolumn-card__info-text"><Skeleton width={200} height={30} /></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SwiperSlide>
                                                            </React.Fragment>
                                                        })
                                                    }

                                                </Swiper>



                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </> : homeSectionData.length > 0 && (
                        <section className='spaced-section multicolumn-section'>
                            <div className="background-1 multicolumn  section_border_top section_border_bottom">
                                <div className="container">
                                    <div className="multicolumn__wrapper">
                                        <div className="multicolumn-list" style={{ position: 'relative' }}>
                                            <div>
                                                <Swiper className="multicolumn-list__wrapper multicolumn-list__wrapper--3" ref={sliderRef}>

                                                    {
                                                        homeSectionData.map((value, index) => {
                                                            return <React.Fragment key={index}>
                                                                <SwiperSlide>
                                                                    <div className="multicolumn-list__item">
                                                                        <div className="multicolumn-card multicolumn-card--image ">
                                                                            <div className="multicolumn-card__image-wrapper">
                                                                                <div className="multicolumn-card__image-block multicolumn-card__image-size-icon">
                                                                                    <div className="multicolumn-card__image-item multicolumn-card__image-ratio-adapt" style={{ paddingBottom: '98.46153846153847%' }}>
                                                                                        <img src={value.home_image != null ? value.home_image : ''} alt='' className='header__heading-logo header__logo-light'></img>
                                                                                        <img src={value.home_dark_image != null ? value.home_dark_image : ''} alt='' className="header__heading-logo header__heading-logo--overlay"></img>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="multicolumn-card__info">
                                                                                <h4 className="multicolumn-card__info-title h4">{value.home_title}</h4>
                                                                                <div className="multicolumn-card__info-text"><p dangerouslySetInnerHTML={{ __html: value.home_desc }}></p></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SwiperSlide>
                                                            </React.Fragment>
                                                        })
                                                    }

                                                </Swiper>



                                            </div>
                                            <div className='swiper-buttons__wrapper'>
                                                <div className='container'>
                                                    <div className='swiper-buttons__box'>
                                                        <div className="swiper-button swiper-button-prev" style={{ alignItems: 'center' }} onClick={handlePrev} >
                                                            <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                                                                <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                                                            </svg>
                                                            </span>
                                                        </div>
                                                        <div className="swiper-button swiper-button-next" onClick={handleNext} style={{ alignItems: 'center' }}>
                                                            <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                                                                <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                                                            </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }


            </MobileView>


        </>

    )
}

export default HomeShipping