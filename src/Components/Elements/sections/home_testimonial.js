import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ApiService } from '../../services/apiServices';
import constants from '../../services/constants';
import Skeleton from 'react-loading-skeleton';
import QuickviewModal from '../Modals/quickview_modal';
import DataContext from '../context';
function HomeTestimonial() {
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const [testimonials, setTestimonials] = useState([])
  const [testimonialImage, setTestimonialImage] = useState('')
  const [loading, setLoading] = useState();
  const [slugData, setSlugData] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleShowQuickModal = (slug) => {
    setSlugData(slug)
    setShowModal(true)
  }
  const handleClose = () => {
    setShowModal(false)
  }

  useEffect(() => {
    if (contextValues.currentLocation) {
      getTestimonialData()
    }
    didMountRef.current = false
  }, [contextValues.currentLocation])

  const getTestimonialData = () => {
    setLoading(true)
    const payload = contextValues.currentLocation;

    ApiService.postData('testimonials',payload).then(res => {
      if (res.status === 'success') {
        setTestimonials(res.testimonial)
        setTestimonialImage(res.testimonial_image_path)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }).catch(error => {
      setLoading(false);
    });

  }

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          viewBox="0 0 16 15"
          fill="none"
          role="presentation"
          className={`icon icon-star ${i < rating ? 'star-active' : ''}`}
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8 0L10.0878 5.12637L15.6085 5.52786L11.3782 9.09763L12.7023 14.4721L8 11.552L3.29772 14.4721L4.62185 9.09763L0.391548 5.52786L5.91219 5.12637L8 0Z"
            fill="currentColor"
          ></path>
        </svg>
      );
    }
    return stars;
  };

  const sliderRef = useRef(null);
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, [])

  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      {
        loading == true ? <>
          (
          <>
            <section className='product-testimonials-section spaced-section slider_started'>
              <Swiper
                className='product-testimonials__slider'
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}

                pagination={{ clickable: true }}
                ref={sliderRef}
              >
                {
                  <SwiperSlide className='product-testimonials__slide swiper-slide color-background-1 color_scheme' >
                    <div className='product-testimonials__block'>
                      <div className='container'>
                        <div className='product-testimonials__wrapper'>
                          <div className='product-testimonials__text'>
                            <div className='product-testimonials__subtitle subtitle'><Skeleton width={250} /></div>
                            <div className="product-testimonials__slide-stars">
                              <Skeleton width={250} />
                            </div>
                            <div className='product-testimonials__desc richtext__content h2'>
                              <Skeleton width={250} />
                            </div>
                            <div className='product-testimonials__author color-border-1'>
                              <div className="product-testimonials__author-img">
                              </div>
                              <div className="product-testimonials__author-text">
                                <div className="product-testimonials__author-position subtitle"><Skeleton width={250} /></div>
                                <div className="product-testimonials__author-name"><Skeleton width={250} /></div>
                              </div>
                            </div>
                          </div>

                          <div className='product-testimonials__product color-border-1 collection-product-card quickview--hover'>
                            <div className='card-wrapper'>
                              <div className='card card--product' tabIndex={-1}>
                                <div className='card__inner full-unstyled-link'>
                                  <div className='media media--transparent media--portrait media--hover-effect' style={{ paddingBottom: '120%' }}>
                                    <Skeleton height='100%' width='100%' />
                                  </div>
                                </div>
                              </div>
                              <div className='card-information'>
                                <div className='card-information__wrapper'>
                                  <div className="caption-with-letter-spacing subtitle">
                                    <Skeleton width={250} />
                                  </div>
                                  <h3 className="card__title h5">
                                    <a className="full-unstyled-link" href="#" title="Sandalwood Beard Oil">
                                      <Skeleton width={250} /></a>
                                  </h3>
                                  <div className='price  price--on-sale'>
                                    <dl>
                                      <div className='price__sale'>
                                        <dd><span className="price-item price-item--sale"><Skeleton width={250} /></span></dd>
                                        <dd className="price__compare"><span className="price-item price-item--regular"><Skeleton width={250} /></span></dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                              <a href="#" className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                }
              </Swiper>
            </section>
          </>
          )
        </> :
          testimonials && testimonials.length > 0 && (
            <>
              <section className='product-testimonials-section spaced-section slider_started'>
                <Swiper
                  className='product-testimonials__slider'
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                  }}
                  pagination={{ clickable: true }}
                  ref={sliderRef}
                >
                  {
                    testimonials.map((value, index) => {
                      return <>
                        <SwiperSlide className='product-testimonials__slide swiper-slide color-background-1 color_scheme' key={index} >
                          <div className='product-testimonials__block'>
                            <div className='container'>
                              <div className='product-testimonials__wrapper'>
                                <div className='product-testimonials__text'>
                                  <div className='product-testimonials__subtitle subtitle'>What The Clients are Saying</div>
                                  <h2 className="section-header__title title--section h2">Testimonials</h2>
                                  <div className="product-testimonials__slide-stars">
                                    {renderRatingStars(value.testimonial_rating)}
                                  </div>
                                  <div className='product-testimonials__desc richtext__content h3'>
                                    <p dangerouslySetInnerHTML={{ __html: value.testimonial_desc }}></p>
                                  </div>
                                  <div className='product-testimonials__author color-border-1'>
                                    <div className="product-testimonials__author-img">
                                      <img src={value.testimonial_image != null ? testimonialImage + value.testimonial_image : constants.DEFAULT_IMAGE} alt='' sizes='(min-width: 270px) 50vw, 100vw'></img>
                                    </div>
                                    <div className="product-testimonials__author-text">
                                      <div className="product-testimonials__author-position subtitle">Blogger</div>
                                      <div className="product-testimonials__author-name">{value.testimonial_name}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className='product-testimonials__product color-border-1 collection-product-card quickview--hover'>
                                  <div className='card-wrapper'>
                                    <div className='card card--product' tabIndex={-1}>
                                      <div className='card__inner full-unstyled-link'>
                                        <div className='media media--transparent media--portrait media--hover-effect' style={{ paddingBottom: '120%' }}>
                                          <img src={value.product_image ? value.product_image : constants.DEFAULT_IMAGE} alt='' sizes='100vw' style={{ objectFit: 'cover' }}></img>
                                        </div>
                                        <div className='quick-add no-js-hidden'>
                                          <button type="button" name="add" className="card__link button button--primary button--full-width"
                                            onClick={() => handleShowQuickModal(value.product_slug)}
                                          >
                                            <div className="quick-add__label">Quick view</div>
                                            <span>

                                              <svg className="icon icon-button-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2071_16434)">
                                                  <path d="M2.24268 12.2427L12.1422 2.34326" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                  <path d="M4.36377 1.63617H12.8491V10.1215" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_2071_16434">
                                                    <rect width="14" height="14" fill="currentColor"></rect>
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </span>

                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='card-information'>
                                      <div className='card-information__wrapper'>
                                        <div className="caption-with-letter-spacing subtitle">
                                          {value?.product_category_name}
                                        </div>
                                        <h3 className="card__title h5">
                                          <a className="full-unstyled-link" href={`/products/${value?.product_slug}`} title="Sandalwood Beard Oil">
                                            {value?.product_name}</a>
                                        </h3>
                                        <div className="price price--on-sale">
                                    <dl>
                                      <div className="price__sale">
                                        {(() => {
                                          const mrp = Number(value.product_price);
                                          const selling = Number(value.product_selling_price);

                                          const discount =
                                            mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0;

                                          return (
                                            <>
                                              <dd>
                                                <span className="price-item price-item--sale">
                                                  ₹{selling.toFixed(2)}
                                                </span>
                                              </dd>

                                              <dd className="price__compare">
                                                <span className="price-item price-item--regular">
                                                  MRP. ₹{mrp.toFixed(2)}
                                                </span>
                                              </dd>

                                              {discount > 0 && (
                                                <span className="price_discount">{discount}% Off</span>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </dl>
                                  </div>
                                      </div>
                                    </div>
                                    <a href={`/products/${value?.product_slug}`} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      </>
                    })
                  }

                </Swiper>
                <div className='product-testimonials__navigation'>
                  <div className='container'>
                    <div className='product-testimonials__navigation-wrapper'>
                      <div className='swiper-buttons__box' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="prev-arrow swiper-button swiper-button-prev color-background-1" onClick={handlePrev} style={{ alignItems: 'center' }}>
                          <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                            <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                          </svg>
                          </span>
                        </div>
                        <div className="next-arrow swiper-button swiper-button-next color-background-1" onClick={handleNext} style={{ alignItems: 'center' }}>
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
              </section>
            </>
          )

      }
      {
        showModal ?
          <QuickviewModal
            showModal={showModal}
            handleClose={handleClose}
            slugData={slugData}
          />
          : null}
    </>
  )
}

export default HomeTestimonial