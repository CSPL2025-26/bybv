
import React, { useEffect, useRef, useState, useCallback, useContext } from 'react'
import { ApiService } from '../../services/apiServices';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import constants from '../../services/constants';
import Skeleton from 'react-loading-skeleton';
import QuickviewModal from '../Modals/quickview_modal';
import DataContext from '../context';

function RecommendedProduct() {
  const didMountRef = useRef(true)
  const contextValues = useContext(DataContext);
  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [slugData, setSlugData] = useState(false);


  const handleShowQuickModal = (slug) => {
    setShowModal(true)
    setSlugData(slug)
  }
  const handleClose = () => {
    setShowModal(false)

  }


  useEffect(() => {
    if (contextValues.currentLocation) {
      getRecomProduct()
    }
    didMountRef.current = false
  },[contextValues.currentLocation])

  const getRecomProduct = () => {
    setLoading(true)
    const payload = contextValues.currentLocation;

    ApiService.postData("recommended-products-list", payload).then((res) => {
      if (res.status == 'success') {
        setProductData(res.recommendedproducts)
        setLoading(false)
      }
    })
  }


  const swipsliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (swipsliderRef.current && swipsliderRef.current.swiper) {
      swipsliderRef.current.swiper.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swipsliderRef.current && swipsliderRef.current.swiper) {
      swipsliderRef.current.swiper.slideNext();
    }
  }, []);
  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <>
      {
        loading == true ? <>
          (
          <section className='product-markers-section spaced-section slider_started'>
            <div className='product-markers'>
              <div className="section-header__line">
                <div className="container">
                  <div className="section-header__item"><div className="subtitle"> <Skeleton width={250} /></div>
                    <div className="section-header__title__block">
                      <h2 className="section-header__title title--section h2"> <Skeleton width={250} /> </h2>
                      <a href="/collections/recommended" className="button button--simple"><span className="button-simpl__label"> <Skeleton width={250} /></span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='product-markers__wrapper'>
                <div className='container'>
                  <div className='product-markers__box'>
                    <div className='product-markers__img'>
                      <Skeleton width='100%' height={700} />
                    </div>
                    <div className='product-markers__product-wrapper'>
                      <Swiper
                      >
                        <SwiperSlide className='color-background-1'>
                          <div className='product-markers__slider'>
                            <div className='product-markers__product collection-product-card  quickview--hover'>
                              <div className='card-wrapper'>
                                <div className='card card--product' tabIndex={-1}>
                                  <div className='card__inner full-unstyled-link'>
                                    <div className='media media--transparent media--portrait media--hover-effect' style={{ paddingBottom: '100%' }}>
                                      <Skeleton width={600} height={500} />
                                    </div>
                                  </div>
                                </div>
                                <div className='card-information'>
                                  <div className='card-information__wrapper'>
                                    <div className="caption-with-letter-spacing subtitle">
                                      <Skeleton width={150} />
                                    </div>
                                    <h3 className="card__title h5">
                                      <a className="full-unstyled-link" href="#" title="Whey protein isolate Max - Mango">
                                        <Skeleton width={150} /></a>
                                    </h3>
                                    <div className='price  price--on-sale'>
                                      <dl>
                                        <div className='price__sale'>
                                          <dd><span className="price-item price-item--sale"> <Skeleton width={150} /></span></dd>
                                          <dd className="price__compare"><span className="price-item price-item--regular"> <Skeleton width={150} /></span></dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )
        </> :
          productData.length > 0 && (<>
            <section className='product-markers-section spaced-section slider_started'>
              <div className='product-markers'>
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item"><div className="subtitle">new arrivals</div>
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">Explore Our Latest Collection</h2>
                        <a href="/collections/recommended" className="button button--simple"><span className="button-simpl__label">shop all</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='product-markers__wrapper'>
                  <div className='container'>
                    <div className='product-markers__box'>
                      <div className='product-markers__img'>
                        <img src="https://bybv.in/csadmin/public/img/uploads/products/11611703248801.jpeg" className="motion-reduce media--second" style={{ objectFit: "cover" }} />
                      </div>
                      <div className='product-markers__product-wrapper'>
                        <Swiper
                          modules={[Navigation, Pagination]}
                          spaceBetween={0}
                          slidesPerView={1}
                          loop={true}
                          navigation={{
                            prevEl: '.prev',
                            nextEl: '.next',
                          }}
                          pagination={{ clickable: true }}
                          ref={swipsliderRef}

                        >
                          {
                            productData.map((value, index) => {
                              return (
                                <SwiperSlide className='color-background-1' key={index}>
                                  <div className='product-markers__slider'>
                                    <div className='product-markers__product collection-product-card  quickview--hover'>
                                      <div className='card-wrapper'>
                                        <div className='card card--product' tabIndex={-1}>
                                          <div className='card__inner full-unstyled-link'>
                                            <div className='media media--transparent media--portrait media--hover-effect' style={{ paddingBottom: '120%' }}>
                                              <img src={value.product_image != null ? value.product_image : constants.DEFAULT_IMAGE} sizes='100vw' style={{ objectFit: 'cover' }} className="motion-reduce media--first"></img>
                                              <img src={value?.gallery != null ? value?.gallery[0]?.gallery_image : constants.DEFAULT_IMAGE} sizes='100vw' style={{ objectFit: 'cover' }} className="motion-reduce media--second"></img>
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
                                              {value.product_category_name}
                                            </div>
                                            <h3 className="card__title h5">
                                              <a className="full-unstyled-link" href="#" title="Whey protein isolate Max - Mango">
                                                {value.product_name}</a>
                                            </h3>
                                            <div className='price  price--on-sale'>
                                              <dl>
                                                <div className='price__sale'>
                                                  <dd><span className="price-item price-item--sale">₹{formatter.format(value.product_selling_price)}</span></dd>
                                                  <dd className="price__compare"><span className="price-item price-item--regular">MRP. ₹{formatter.format(value.product_price)}</span></dd>
                                                </div>
                                              </dl>
                                            </div>
                                          </div>
                                        </div>
                                        <a
                                          href={"/products/" + value.product_slug}

                                          className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"></a>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              )
                            })
                          }
                        </Swiper>
                        <div className="prev-arrow swiper-button swiper-button-prev swiper-button-absolute" onClick={handlePrev} >
                          <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                            <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                          </svg>
                          </span>
                        </div>
                        <div className="next-arrow swiper-button swiper-button-next swiper-button-absolute" onClick={handleNext} >
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
            </section>
          </>)

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

export default RecommendedProduct
