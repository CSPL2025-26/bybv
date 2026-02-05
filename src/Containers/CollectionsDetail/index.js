import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import constants from "../../Components/services/constants";
import { useContext } from "react";
import DataContext from '../../Components/Elements/context/index';
import { showToast } from "../../Components/Elements/utils/toastUtils";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { BrowserView, MobileOnlyView, MobileView } from "react-device-detect";
import QuickviewModal from "../../Components/Elements/Modals/quickview_modal";
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet";
import { trackAddToCart } from "../../Components/services/facebookTracking";
import ReactPixel from "../../Components/services/FacebookPixel";
import Loader from "react-js-loader";

function CollectionsDetail() {
  const navigate = useNavigate()
  const { slug } = useParams();
  const contextValues = useContext(DataContext)

  const didMountRef = useRef(true)
  const [productData, setProductData] = useState("")
  const [productDataGallery, setProductDataGallery] = useState([])
  const [productVariationDataGallery, setproductVariationDataGallery] = useState([])
  const [VarImageUrl, setVarImageUrl] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [variationDataa, setVariationData] = useState([]);
  const [descActive, setdescActive] = useState(true);
  const [selvararray, setSelvararray] = useState([]);
  const [arySelectedData, setArySelectedData] = useState([]);
  const [adminData, setAdminData] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [slugData, setSlugData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading1, setLoading1] = useState()
  const [loading2, setLoading2] = useState()
  const sliderRef1 = useRef(null);
  const [setSession, SetSession] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  const handleShowQuickModal = (slug) => {
    setSlugData(slug)
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const descToggle = () => {
    setdescActive(!descActive);
  };
  const sliderRef = useRef(null);
  const MobsliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, [])
  const MobhandlePrev = useCallback(() => {
    if (!MobsliderRef.current) return;
    MobsliderRef.current.swiper.slidePrev();
  }, []);

  const MobhandleNext = useCallback(() => {
    if (!MobsliderRef.current) return;
    MobsliderRef.current.swiper.slideNext();
  }, [])


  const [productTabsActive, setProductTabsActive] = useState(null);

  const productTabsToggle = (tabId) => {
    setProductTabsActive((prevActiveTab) => (prevActiveTab === tabId ? null : tabId));
  };

  useEffect(() => {
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_SESSION"));
      setLoading1(true)
      setLoading2(true)
      getProductDetails();
    }
    didMountRef.current = false
  }, [])
  let mrpValue = 0
  let sellingPriceValue = 0
  let discount = 0
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const getProductDetails = () => {
    const dataString = {
      slug: slug,
      location: contextValues.currentLocation
    }
    ApiService.postData("product-details", dataString).then((res) => {
      if (res.status == "success") {
        setAdminData(res.admin_data);
        setProductData(res.rowProductData)
        setProductDataGallery(res?.rowProductData?.gallery)
        setproductVariationDataGallery(res?.rowProductData?.variationgallery)
        setSelvararray(res.selvararray);
        setRelatedProducts(res.relatedProducts)
        setVariationData(res.variationData);
        setVarImageUrl(res.imageurl);

        setLoading2(false)
        setLoading1(false)
        ReactPixel.track('ProductView', {
          content_id: res.rowProductData.product_id,
          content_category_id: res.rowProductData.product_category_id,
          product_id: res.rowProductData.product_uniqueid,
          product_name: res.rowProductData.product_name,
          product_category: res.rowProductData.product_category_name,
          price: res.rowProductData.product_selling_price,
        });
        mrpValue = parseFloat(res.rowProductData.product_price);
        sellingPriceValue = parseFloat(
          res.rowProductData.product_selling_price
        );
        if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
          discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
          setDiscountPercentage(discount.toFixed(2));
        }

        let parentcounter = 0;
        let childcounter = 0;
        res.variationData.map((parent) => {
          if (parent.attributes && parent.attributes.attribute_type == 3) {
            parent.attr_terms.map((child) => {
              parentcounter++;
              if (parentcounter == 1) {
                arySelectedData.push(child.terms_name);
              }
            });
            parentcounter = 0;
          } else if (
            parent.attributes &&
            parent.attributes.attribute_type == 2
          ) {
            parent.attr_terms.map((child) => {
              childcounter++;
              if (childcounter == 1) {
                arySelectedData.push(child.terms_name);
              }
            });
            childcounter = 0;
          } else if (
            parent.attributes &&
            parent.attributes.attribute_type == 1
          ) {
            parent.attr_terms.map((child) => {
              childcounter++;
              if (childcounter == 1) {
                arySelectedData.push(child.terms_name);
              }
            });
            childcounter = 0;
          }
        });
      } else {

      }
    })
  }
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const variationSelect = (item, index) => {
    const updatedSelectedData = [...arySelectedData];
    updatedSelectedData[index] = item.terms_name;
    const selvararray = updatedSelectedData;
    const dataString = {
      variation: selvararray,
      product_id: productData.product_id,
      location: contextValues.currentLocation
    };

    ApiService.postData("variation-wise-price", dataString).then((res) => {
      setSelvararray(selvararray);
      productData.product_sku = res.data.pv_sku;
      productData.product_selling_price = res.data.pv_sellingprice;
      productData.product_price = res.data.pv_price;
      productData.product_stock = res.data.pv_quantity;
      productData.product_moq = res.data.pv_moq;
      productData.product_discount = res.data.pv_discount;
      productData.variationdefault_image = res.data.pv_image;
      if (item.variation_images) {
        productData.product_image =
          item.variation_images.pti_image != null
            ? item.variation_images.pti_image
            : constants.DEFAULT_IMAGE;
      } else {
        productData.product_image =
          productData.product_image != null
            ? productData.product_image
            : constants.DEFAULT_IMAGE;
      }
      if (sliderRef.current && sliderRef.current.swiper) {
        // Slide to the first tab (index 0)
        sliderRef.current.swiper.slideTo(0);
      }
      if (MobsliderRef.current && MobsliderRef.current.swiper) {
        // Slide to the first tab (index 0)
        MobsliderRef.current.swiper.slideTo(0);
      }
      setProductData(productData);
      setproductVariationDataGallery(res.data.productvariationsgallery)
      mrpValue = parseFloat(res.data.pv_price);
      sellingPriceValue = parseFloat(res.data.pv_sellingprice);
      if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
        discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
      }
      setDiscountPercentage(discount.toFixed(2));
      setQuantity(1);
    });
  };

  const addtocart = (addproduct, purchaseType) => {
    //localStorage.removeItem("CART_SESSION");return ;
    let cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];

    const product = {
      product_id: Number(addproduct.product_id),
      product_name: addproduct.product_name,
      product_image: addproduct.product_image
        ? addproduct.product_image
        : constants.DEFAULT_IMAGE,
      product_type: Number(addproduct.product_type),
      product_price: Number(addproduct.product_price),
      product_selling_price: Number(addproduct.product_selling_price),
      product_discount: addproduct.product_discount,
      product_category_name: addproduct.product_category_name,
      product_category_id: addproduct.product_category_id,
      product_variation: selvararray,
      product_moq: addproduct.product_moq,
      product_selected_products: [],
      product_crazy_deal: 0,
    };
    const existingProductIndex = cartSession.findIndex((item) => {
      return (
        item.product_id === product.product_id &&
        JSON.stringify(item.product_variation) ===
        JSON.stringify(product.product_variation)
      );
    });
    if (Number(addproduct.product_type) === 0) {
      if (Number(addproduct.product_inventory) === 1) {
        if (Number(addproduct.product_backorder) !== 0) {
          if (Number(addproduct.product_stock) > 0) {
            if (existingProductIndex !== -1) {
              if (Number(cartSession[existingProductIndex].quantity) + quantity <= Number(addproduct.product_stock)) {
                if (Number(addproduct.product_moq) === 0 || Number(cartSession[existingProductIndex].quantity) + quantity <= Number(addproduct.product_moq)) {
                  cartSession[existingProductIndex].quantity += quantity;
                  showToast('success', "Quantity updated Successfully");
                } else {
                  showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
                  return false;
                }
              } else {
                showToast('error', "Product is out of stock");
                return false;
              }
            } else {
              if (quantity <= Number(addproduct.product_stock)) {
                if (Number(addproduct.product_moq) === 0 || quantity <= Number(addproduct.product_moq)) {
                  cartSession.push({ ...product, quantity: quantity });
                  showToast('success', "Product Added in cart Successfully");
                } else {
                  showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
                  return false;
                }
              } else {
                showToast('error', "Product is out of stock");
                return false;
              }
            }
          } else {
            showToast('error', "Product is out of stock");
            return false;
          }
        } else {
          showToast('error', "Product is out of stock");
          return false;
        }
      } else {
        if (existingProductIndex !== -1) {
          if (Number(addproduct.product_moq) === 0 || Number(cartSession[existingProductIndex].quantity) + quantity <= Number(addproduct.product_moq)) {
            cartSession[existingProductIndex].quantity += quantity;
            showToast('success', "Quantity updated Successfully");
          } else {
            showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
            return false;
          }
        } else {
          if (Number(addproduct.product_moq) === 0 || quantity <= Number(addproduct.product_moq)) {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          } else {
            showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
            return false;
          }
        }
      }
    } else {
      if (existingProductIndex !== -1) {
        if (Number(cartSession[existingProductIndex].quantity) + quantity <= Number(addproduct.product_stock)) {
          if (Number(addproduct.product_moq) === 0 || Number(cartSession[existingProductIndex].quantity) + quantity <= Number(addproduct.product_moq)) {
            cartSession[existingProductIndex].quantity += quantity;
            showToast('success', "Quantity updated Successfully");
          } else {
            showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
            return false;
          }
        } else {
          showToast('error', "Product is out of stock");
          return false;
        }
      } else {
        if (quantity <= Number(addproduct.product_stock)) {
          if (Number(addproduct.product_moq) === 0 || quantity <= Number(addproduct.product_moq)) {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          } else {
            showToast('error', "You can add maximum " + addproduct.product_moq + " quantity at a time!");
            return false;
          }
        } else {
          showToast('error', "Product is out of stock");
          return false;
        }
      }
    }

    localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
    cartSession = localStorage.getItem("CART_SESSION");
    cartSession = cartSession ? JSON.parse(cartSession) : [];
    contextValues.setCartSessionData(cartSession)
    contextValues.setcartCount(cartSession.length)
    contextValues.setCouponSession({})
    localStorage.removeItem("COUPON_SESSION");
    trackAddToCart(cartSession)

    if (purchaseType === 1) {
      navigate("/cart");
    }
  };

  const addtocartsession = (addproduct, purchaseType) => {
    const existingProductIndex = contextValues.cartSessionData.findIndex((item) => {
      return (
        item.product_id === addproduct.product_id &&
        JSON.stringify(item.product_variation) === JSON.stringify(selvararray) &&
        item.product_crazy_deal === addproduct.product_crazy_deal &&
        JSON.stringify(item.product_selected_products) === JSON.stringify(addproduct.product_selected_products)
      );
    });
    let quantityNew = 1;
    if (existingProductIndex !== -1) {
      quantityNew = contextValues.cartSessionData[existingProductIndex].quantity + Number(quantity);
    }
    const dataString = {
      product_id: Number(addproduct.product_id),
      product_name: addproduct.product_name,
      product_slug: addproduct.product_slug,
      product_image: addproduct.product_image
        ? addproduct.product_image
        : constants.DEFAULT_IMAGE,
      product_type: Number(addproduct.product_type),
      product_price: parseFloat(addproduct.product_price),
      product_selling_price: parseFloat(addproduct.product_selling_price),
      product_discount: parseFloat(addproduct.product_discount),
      product_variation: selvararray,
      product_moq: addproduct.product_moq,
      product_selected_products: addproduct.product_selected_products,
      product_crazy_deal: addproduct.product_crazy_deal,
      quantity: Number(quantityNew),
    };
    setSpinnerLoading(true);
    ApiService.postData("addtocartsession", dataString).then((res) => {
      if (res.data.status === "success") {
        showToast('success', res.data.message, 1000);
        localStorage.removeItem("COUPON_SESSION");
        contextValues.setcartCount(res.data.resCartData.length)
        contextValues.setCartSessionData(res.data.resCartData)
        setSpinnerLoading(false);
        if (purchaseType === 1) {
          navigate("/cart");
        }
      } else {
        showToast('error', res.data.message, 1000);
        setSpinnerLoading(false);
      }
    });

  };

  const ProductStockStatus = ({ productData }) => {
    if (Number(productData.product_type) === 0) {
      if (Number(productData.product_inventory) === 1) {
        if (Number(productData.product_backorder) !== 0) {
          if (Number(productData.product_stock) > 0) {
            return <span className="instock">In Stock</span>;
          } else {
            return <span className="outofdtock">Out of Stock</span>;
          }
        } else {
          return <span className="outofdtock">Out of Stock</span>;
        }
      } else {
        return <span className="instock">In Stock</span>;
      }
    } else if (Number(productData.product_stock) > 0) {
      return <span className="instock">In Stock</span>;
    } else {
      return <span className="outofdtock">Out of Stock</span>;
    }
  };

  return (
    <>
      <Helmet>
        <title>{productData.product_meta_title}</title>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": productData.product_name != null ? productData.product_name : "ByBv",
            "image": productData.product_image != null ? productData.product_image : constants.FRONT_URL + constants.DEFAULT_IMAGE,
            "description": productData.product_meta_desc != null ? productData.product_meta_desc : "ByBv",
            "brand": {
              "@type": "Brand",
              "name": "ByBv"
            },
            "sku": productData.product_sku != null ? productData.product_sku : "ByBv",
            "offers": {
              "@type": "AggregateOffer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "lowPrice": productData.product_selling_price != null ? productData.product_selling_price : "ByBv",
              "highPrice": productData.product_price != null ? productData.product_price : "ByBv",
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "34"
            }
          })}
        </script>
        <meta
          name="description"
          itemprop="description"
          content={
            productData.product_meta_desc != null
              ? productData.product_meta_desc
              : "ByBv"
          }
        />
        {productData.product_meta_keyword != null ? (
          <meta
            name="keywords"
            content={productData.product_meta_keyword}
          />
        ) : (
          ""
        )}
        <link rel="canonical" href={window.location.href} />
        <meta
          property="og:title"
          content={productData.product_meta_title}
        />
        <meta name="twitter:url" content={window.location.href} />
        <meta
          property="og:image"
          content={constants.FRONT_URL + "img/logo.png"}
        />
        <meta property="og:url" content={window.location.href} />

        <meta
          property="og:description"
          content={
            productData.product_meta_desc != null
              ? productData.product_meta_desc
              : "ByBv"
          }
        />

        <meta
          name="twitter:title"
          content={productData.product_meta_title}
        />

        <meta
          name="twitter:description"
          content={
            productData.product_meta_desc != null
              ? productData.product_meta_desc
              : "ByBv"
          }
        />
        <meta
          property="twitter:image"
          content={constants.FRONT_URL + "img/logo.png"}
        />
      </Helmet>
      <BrowserView>
        <Header />

        {
          loading1 === false ? (<>
            <section className="product-section spaced-section">
              <div className="product">
                <div className="product__outer container product__outer--desktop-order">
                  <div className="product__media-wrapper product__media-wrapper--desktop-order">
                    <div className="pss-slider">
                      <Swiper

                        loop={true}
                        ref={sliderRef}
                        spaceBetween={0}

                        thumbs={{
                          swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                              ? thumbsSwiper
                              : null,
                        }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        modules={[Autoplay, FreeMode, Thumbs]}
                        className="mySwiper2 gallery-top">
                        <SwiperSlide>
                          <div className="gallery-page__single">
                            <div className="gallery-page__video">
                              <img className="w-100"
                                src={productData?.variationdefault_image != null ? productData?.variationdefault_image : constants.DEFAULT_IMAGE}
                                autoPlay="autoplay" loop muted playsInline alt={productData.product_name}></img>
                            </div>
                          </div>
                        </SwiperSlide>
                        {productVariationDataGallery.length > 0 ?
                          productVariationDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <div className="gallery-page__single">
                                  <div className="gallery-page__video">
                                    <img className="w-100"
                                      src={value?.pvg_image != null ? VarImageUrl + value?.pvg_image : constants.DEFAULT_IMAGE}
                                      autoPlay="autoplay" loop muted playsInline alt=""></img>
                                  </div>
                                </div>
                              </SwiperSlide>
                            </>
                          }) : productDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <div className="gallery-page__single">
                                  <div className="gallery-page__video">
                                    <img className="w-100"
                                      src={value?.gallery_image != null ? value?.gallery_image : constants.DEFAULT_IMAGE}
                                      autoPlay="autoplay" loop muted playsInline alt=""></img>
                                  </div>
                                </div>
                              </SwiperSlide>
                            </>
                          })}

                        {/* {productDataGallery.length > 0 &&
                          productDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <div className="gallery-page__single">
                                  <div className="gallery-page__video">
                                    <img className="w-100"
                                      src={value?.gallery_image != null ? value?.gallery_image : constants.DEFAULT_IMAGE}
                                      autoPlay="autoplay" loop muted playsInline alt=""></img>
                                  </div>
                                </div>
                              </SwiperSlide>
                            </>
                          })
                        } */}

                      </Swiper>
                      <div className="pss-slider-arrow">
                        <div className="pss-slider-arrow-inner">
                          <div className="prev-arrow" onClick={handlePrev} >
                            <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                              <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                            </svg>
                            </span>
                          </div>
                          <div className="next-arrow" onClick={handleNext} >
                            <span><svg width="27" height="22" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 14L26 14" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                              <path d="M17.6514 3L29.6514 14L17.6514 25" stroke="currentColor" strokeWidth="3" strokeLinecap="square"></path>
                            </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Swiper
                        style={{

                          height: '500px'
                        }}
                        onSwiper={setThumbsSwiper}
                        direction="vertical"
                        loop={false}
                        spaceBetween={1}
                        slidesPerView={4}
                        freeMode={false}
                        watchSlidesProgress={false}

                        modules={[FreeMode, Thumbs]}
                        className="mySwiperv gallery-thumbs">
                        <SwiperSlide>
                          <img
                            src={productData?.variationdefault_image != null ? productData?.variationdefault_image : constants.DEFAULT_IMAGE}
                          />
                        </SwiperSlide>
                        {productVariationDataGallery.length > 0 ?
                          productVariationDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <img
                                  src={value?.pvg_image != null ? VarImageUrl + value?.pvg_image : constants.DEFAULT_IMAGE}
                                />
                              </SwiperSlide>
                            </>
                          }) : productDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <img
                                  src={value?.gallery_image != null ? value?.gallery_image : constants.DEFAULT_IMAGE}
                                />
                              </SwiperSlide>
                            </>
                          })}

                        {/* {productDataGallery.length > 0 &&
                          productDataGallery.map((value, index) => {
                            return <>
                              <SwiperSlide key={index}>
                                <img
                                  src={value?.gallery_image != null ? value?.gallery_image : constants.DEFAULT_IMAGE}
                                />
                              </SwiperSlide>
                            </>
                          })
                        } */}
                      </Swiper>



                    </div>
                  </div>
                  <div className="product__info-wrapper">
                    <div className="product__info-container">
                      <p className="subtitle product__text">{productData.product_category_name}</p>
                      <div className="product__title__wrapper">
                        <h1 className="product__title h3">{productData.product_name}</h1>
                      </div>
                      {Number(productData.product_rating) > 0 && Number(productData.product_review) > 0 && (
                        <span>
                          {"★".repeat(Math.floor(Number(productData.product_rating)))}
                          {"☆".repeat(5 - Math.floor(Number(productData.product_rating)))}
                          {" " + Number(productData.product_review) + " reviews"}
                        </span>
                      )}
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            {(() => {
                              const mrp = Number(productData.product_price);
                              const selling = Number(productData.product_selling_price);
                              const discount = mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0;

                              return (
                                <>
                                  <dd>
                                    <span className="price-item price-item--sale">₹{selling.toFixed(2)}</span>
                                  </dd>
                                  {discountPercentage > 0 ?
                                    <dd className="price__compare">
                                      <span className="price-item price-item--regular">MRP. ₹{mrp.toFixed(2)}</span>
                                      {discount > 0 && (<span className="price_discount"> {discount}% Off</span>)}
                                    </dd> : null}

                                </>
                              );
                            })()}
                          </dl>
                        </div>
                      </div>
                      <div className="stock-text">
                        Availability: <ProductStockStatus productData={productData} />
                        {/* {productData.product_type === 0 ? (
                          productData.product_inventory === 1 ? (
                            productData.product_stock == 0 ? (
                              productData.product_backorder === 0 ||
                                productData.product_backorder === 1 ? (
                                <span className="outofdtock">Out of Stock</span>
                              ) : (
                                <span className="instock">In Stock</span>
                              )
                            ) : (
                              <span className="instock">In Stock</span>
                            )
                          ) : (
                            <span className="instock">In Stock</span>
                          )
                        ) : productData.product_stock == 0 ? (
                          <span className="outofdtock">Out of Stock</span>
                        ) : (
                          <span className="instock">In Stock</span>
                        )} */}
                      </div>
                      {variationDataa.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constants.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,
                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${valueVariationAttr.variation_images !=
                                            null
                                            ? valueVariationAttr
                                              .variation_images.pti_image
                                            : constants.DEFAULT_IMAGE
                                            })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <img
                                          src={
                                            valueVariationAttr.variation_images !=
                                              null
                                              ? valueVariationAttr
                                                .variation_images.pti_image
                                              : constants.DEFAULT_IMAGE
                                          }
                                          alt={productData.product_name}
                                          width="100"
                                          height="100"
                                        />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>

                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        {valueVariationAttr.terms_name}
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="product-form">
                        <div className="product-form__buttons">
                          <div className="product-parameters__item product-parameters__quantity">
                            <p className="product-form__group-name">Quantity</p>
                            <div className="product-form__input product-form__quantity">
                              <div className="quantity">
                                <button className="quantity__button no-js-hidden" name="minus" type="button" onClick={handleDecrease}>
                                  <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                    <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                  </svg>
                                </button>
                                <input className="quantity__input" type="number" name="quantity" id="Quantity-template--18847832310041__main" min="1" value={quantity} />
                                <button className="quantity__button no-js-hidden" name="plus" type="button" onClick={handleIncrease}>
                                  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                    <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          {setSession ?
                            <>
                              <div className="product-form__checkout">
                                <button className="button button--primary" style={{ width: '100%' }} onClick={(e) => addtocartsession(productData, 1)}>Buy it now</button>
                              </div>
                              <div className="product-form__quantity__add__buttons">
                                <button type="submit" name="add" className="product-form__submit button button--secondary">
                                  <span className="add_to_cart_quantity" onClick={(e) => addtocartsession(productData, 0)}>Add to Cart</span>
                                </button>
                              </div>
                            </> :
                            <>
                              <div className="product-form__checkout">
                                <button className="button button--primary" style={{ width: '100%' }} onClick={(e) => addtocart(productData, 1)}>Buy it now</button>
                              </div>
                              <div className="product-form__quantity__add__buttons">
                                <button type="submit" name="add" className="product-form__submit button button--secondary">
                                  <span className="add_to_cart_quantity" onClick={(e) => addtocart(productData, 0)}>Add to Cart</span>
                                </button>
                              </div>
                            </>}
                        </div>
                      </div>
                      <div className="footer__payment">
                        <ul className="list list-payment">
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-visa"
                            >
                              <title id="pi-visa">Visa</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                                fill="#142688"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-master"
                            >
                              <title id="pi-master">Mastercard</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <circle
                                fill="#EB001B"
                                cx="15"
                                cy="12"
                                r="7"
                              ></circle>
                              <circle
                                fill="#F79E1B"
                                cx="23"
                                cy="12"
                                r="7"
                              ></circle>
                              <path
                                fill="#FF5F00"
                                d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 38 24"
                              width="38"
                              height="24"
                              aria-labelledby="pi-american_express"
                            >
                              <title id="pi-american_express">
                                American Express
                              </title>
                              <g fill="none">
                                <path
                                  fill="#000"
                                  d="M35,0 L3,0 C1.3,0 0,1.3 0,3 L0,21 C0,22.7 1.4,24 3,24 L35,24 C36.7,24 38,22.7 38,21 L38,3 C38,1.3 36.6,0 35,0 Z"
                                  opacity=".07"
                                ></path>
                                <path
                                  fill="#006FCF"
                                  d="M35,1 C36.1,1 37,1.9 37,3 L37,21 C37,22.1 36.1,23 35,23 L3,23 C1.9,23 1,22.1 1,21 L1,3 C1,1.9 1.9,1 3,1 L35,1"
                                ></path>
                                <path
                                  fill="#FFF"
                                  d="M8.971,10.268 L9.745,12.144 L8.203,12.144 L8.971,10.268 Z M25.046,10.346 L22.069,10.346 L22.069,11.173 L24.998,11.173 L24.998,12.412 L22.075,12.412 L22.075,13.334 L25.052,13.334 L25.052,14.073 L27.129,11.828 L25.052,9.488 L25.046,10.346 L25.046,10.346 Z M10.983,8.006 L14.978,8.006 L15.865,9.941 L16.687,8 L27.057,8 L28.135,9.19 L29.25,8 L34.013,8 L30.494,11.852 L33.977,15.68 L29.143,15.68 L28.065,14.49 L26.94,15.68 L10.03,15.68 L9.536,14.49 L8.406,14.49 L7.911,15.68 L4,15.68 L7.286,8 L10.716,8 L10.983,8.006 Z M19.646,9.084 L17.407,9.084 L15.907,12.62 L14.282,9.084 L12.06,9.084 L12.06,13.894 L10,9.084 L8.007,9.084 L5.625,14.596 L7.18,14.596 L7.674,13.406 L10.27,13.406 L10.764,14.596 L13.484,14.596 L13.484,10.661 L15.235,14.602 L16.425,14.602 L18.165,10.673 L18.165,14.603 L19.623,14.603 L19.647,9.083 L19.646,9.084 Z M28.986,11.852 L31.517,9.084 L29.695,9.084 L28.094,10.81 L26.546,9.084 L20.652,9.084 L20.652,14.602 L26.462,14.602 L28.076,12.864 L29.624,14.602 L31.499,14.602 L28.987,11.852 L28.986,11.852 Z"
                                ></path>
                              </g>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              width="38"
                              height="24"
                              role="img"
                              aria-labelledby="pi-paypal"
                            >
                              <title id="pi-paypal">PayPal</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                fill="#003087"
                                d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                              ></path>
                              <path
                                fill="#3086C8"
                                d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                              ></path>
                              <path
                                fill="#012169"
                                d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-diners_club"
                            >
                              <title id="pi-diners_club">Diners Club</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z"
                                fill="#3086C8"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              width="38"
                              height="24"
                              role="img"
                              aria-labelledby="pi-discover"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title id="pi-discover">Discover</title>
                              <path
                                fill="#000"
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z"
                                fill="#fff"
                              ></path>
                              <path
                                d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                                fill="url(#pi-paint0_linear)"
                              ></path>
                              <path
                                opacity=".65"
                                d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                                fill="url(#pi-paint1_linear)"
                              ></path>
                              <path
                                d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z"
                                fill="#F48120"
                              ></path>
                              <defs>
                                <linearGradient
                                  id="pi-paint0_linear"
                                  x1="21.657"
                                  y1="12.275"
                                  x2="19.632"
                                  y2="9.104"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#F89F20"></stop>
                                  <stop offset=".25" stopColor="#F79A20"></stop>
                                  <stop offset=".533" stopColor="#F68D20"></stop>
                                  <stop offset=".62" stopColor="#F58720"></stop>
                                  <stop offset=".723" stopColor="#F48120"></stop>
                                  <stop offset="1" stopColor="#F37521"></stop>
                                </linearGradient>
                                <linearGradient
                                  id="pi-paint1_linear"
                                  x1="21.338"
                                  y1="12.232"
                                  x2="18.378"
                                  y2="6.446"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#F58720"></stop>
                                  <stop offset=".359" stopColor="#E16F27"></stop>
                                  <stop offset=".703" stopColor="#D4602C"></stop>
                                  <stop offset=".982" stopColor="#D05B2E"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </li>
                        </ul>
                      </div>
                      {productData.product_description ?
                        <div className="product-about">
                          <div className="product-about__outer">
                            <div className="product-about__right">
                              <div className="product-about__wrapper">
                                <div className="product-about__accordion-item">
                                  <h2 className={`h5 product-about__accordion-title${descActive ? ' active' : ''}`} onClick={descToggle}>
                                    <span>Description</span>
                                    <div className="product-about__more-link-wrapper">
                                      <div className="product-about__more-link">
                                        <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </h2>
                                  <div className="product-about__accordion-description main-product-description" style={{ display: descActive ? 'block' : 'none' }}>
                                    <span dangerouslySetInnerHTML={{ __html: productData.product_description }}></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : null}
                      {productData.product_tabs &&
                        productData.product_tabs.length > 0 &&
                        productData.product_tabs.map((value, index) => (
                          <div className="product-about" key={index}>
                            <div className="product-about__outer">
                              <div className="product-about__right">
                                <div className="product-about__wrapper">
                                  <div className="product-about__accordion-item">
                                    <h2
                                      className={`h5 product-about__accordion-title${productTabsActive === value.tab_id ? ' active' : ''}`}
                                      onClick={() => productTabsToggle(value.tab_id)}
                                    >
                                      <span>{value.tab_name}</span>
                                      <div className="product-about__more-link-wrapper">
                                        <div className="product-about__more-link">
                                          <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </h2>
                                    <div className="product-about__accordion-description main-product-description" style={{ display: productTabsActive === value.tab_id ? 'block' : 'none' }}>
                                      <span dangerouslySetInnerHTML={{ __html: value.tab_description }}></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>) : <>

            {/* collection details skeleton start */}

            <section className="product-section spaced-section">
              <div className="product">
                <div className="product__outer container product__outer--desktop-order">
                  <div className="product__media-wrapper product__media-wrapper--desktop-order">
                    <div className="pss-slider">
                      <Swiper

                        loop={true}
                        ref={sliderRef}
                        spaceBetween={0}

                        thumbs={{
                          swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                              ? thumbsSwiper
                              : null,
                        }}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        modules={[Autoplay, FreeMode, Thumbs]}
                        className="mySwiper2 gallery-top">
                        <SwiperSlide>
                          <div className="gallery-page__single">
                            <div className="gallery-page__video">
                              <Skeleton width='100%' height={500} />
                            </div>
                          </div>
                        </SwiperSlide>
                      </Swiper>

                    </div>
                  </div>

                  <div className="product__info-wrapper">
                    <div className="product__info-container">
                      <p className="subtitle product__text"><Skeleton width={350} height={30} /></p>
                      <div className="product__title__wrapper">
                        <h1 className="product__title h3"></h1>
                      </div>
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            <dd><span className="price-item price-item--sale"><Skeleton width={350} height={30} /></span></dd>
                          </dl>
                        </div>
                      </div>
                      <div className="stock-text">
                        <Skeleton width={350} height={30} />
                        {productData.product_type === 0 ? (
                          productData.product_inventory === 1 ? (
                            productData.product_stock == 0 ? (
                              productData.product_backorder === 0 ||
                                productData.product_backorder === 1 ? (
                                <span className="outofdtock"><Skeleton width={350} height={30} /></span>
                              ) : (
                                <span className="instock"><Skeleton width={350} height={30} /></span>
                              )
                            ) : (
                              <span className="instock"><Skeleton width={350} height={30} /></span>
                            )
                          ) : (
                            <span className="instock"><Skeleton width={350} height={30} /></span>
                          )
                        ) : productData.product_stock == 0 ? (
                          <span className="outofdtock"><Skeleton width={350} height={30} /></span>
                        ) : (
                          <span className="instock"><Skeleton width={350} height={30} /></span>
                        )}
                      </div>
                      {variationDataa.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constants.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,
                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${valueVariationAttr.variation_images !=
                                            null
                                            ? valueVariationAttr
                                              .variation_images.pti_image
                                            : constants.DEFAULT_IMAGE
                                            })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <Skeleton width='100%' height={500} />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>

                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        <Skeleton width={350} height={30} />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="product-form">
                        <div className="product-form__buttons">
                          <div className="product-parameters__item product-parameters__quantity">
                            <p className="product-form__group-name"><Skeleton width={350} height={30} /></p>
                            <div className="product-form__input product-form__quantity">

                            </div>
                          </div>


                        </div>
                      </div>
                      {productData.product_description ?
                        <div className="product-about">
                          <div className="product-about__outer">
                            <div className="product-about__right">
                              <div className="product-about__wrapper">
                                <div className="product-about__accordion-item">
                                  <h2 className={`h5 product-about__accordion-title${descActive ? ' active' : ''}`} onClick={descToggle}>
                                    <span><Skeleton width={150} height={30} /></span>
                                    <div className="product-about__more-link-wrapper">
                                      <div className="product-about__more-link">
                                        <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </h2>
                                  <div className="product-about__accordion-description main-product-description" style={{ display: descActive ? 'block' : 'none' }}>
                                    <Skeleton width={450} height={30} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : null}
                      {productData.product_tabs &&
                        productData.product_tabs.length > 0 &&
                        productData.product_tabs.map((value, index) => (
                          <div className="product-about" key={index}>
                            <div className="product-about__outer">
                              <div className="product-about__right">
                                <div className="product-about__wrapper">
                                  <div className="product-about__accordion-item">
                                    <h2
                                      className={`h5 product-about__accordion-title${productTabsActive === value.tab_id ? ' active' : ''}`}
                                      onClick={() => productTabsToggle(value.tab_id)}
                                    >
                                      <span><Skeleton width={150} height={30} /></span>
                                      <div className="product-about__more-link-wrapper">
                                        <div className="product-about__more-link">
                                          <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </h2>
                                    <div className="product-about__accordion-description main-product-description" style={{ display: productTabsActive === value.tab_id ? 'block' : 'none' }}>
                                      <Skeleton width={450} height={30} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* collection details skeleton End */}
          </>
        }
        {
          loading2 === false ? <>
            <section className="section-product-recommendations spaced-section">
              <div className="product-recommendations">
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item">
                      {/* <div className="subtitle">subheading</div> */}
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">You May Also Like</h2>
                        <a href="/collections/all" className="button button--simple"><span className="button-simpl__label">Shop all</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                {relatedProducts.length > 0 ?
                  <div className="container">
                    <div className="product-recommendations__item">
                      <ul className="product-recommendations__list list-unstyled">
                        {relatedProducts.map((value, index) => {
                          return (
                            <li className="collection-product-card product-recommendations__product quickview--hover show" key={index}>
                              <div className="card-wrapper js-color-swatches-wrapper">
                                <div className="card card--product" tabIndex="-1">
                                  <div className="card__inner full-unstyled-link">
                                    <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "120%" }}>
                                      <img src={value.product_image != null ? value.product_image : constants.DEFAULT_IMAGE} className="motion-reduce media--first" style={{ objectFit: "cover" }} />
                                      {value.gallery.length > 0 ? (
                                        <img style={{ objectFit: 'cover' }} src={value.gallery[0].gallery_image ? value.gallery[0].gallery_image : constants.DEFAULT_IMAGE} alt={value.product_name} className='motion-reduce media--second' />
                                      ) : null}
                                    </div>
                                    <div className="quick-add no-js-hidden">
                                      <button type="button" name="add" className="card__link button button--primary button--full-width">
                                        <div className="quick-add__label"
                                          onClick={() => handleShowQuickModal(value.product_slug)}
                                        >Quick view</div>
                                        <span>
                                          <svg className="icon icon-button-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_2071_16434)">
                                              <path d="M2.24268 12.2427L12.1422 2.34326" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                              <path d="M4.36377 1.63617H12.8491V10.1215" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_2071_16434"><rect width="14" height="14" fill="currentColor"></rect></clipPath>
                                            </defs>
                                          </svg>
                                        </span>
                                        <div className="loading-overlay__spinner hidden">
                                          <svg aria-hidden="true" focusable="false" role="presentation" className="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                            <circle className="path" fill="none" strokeWidth="6" cx="33" cy="33" r="30"></circle>
                                          </svg>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="card-information">
                                  <div className="card-information__wrapper">
                                    <div className="caption-with-letter-spacing subtitle">{value.product_category_name}</div>
                                    <h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/" + value.product_slug}>{value.product_name}</a></h3>
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
                                    {Number(value.product_rating) > 0 && Number(value.product_review) > 0 && (
                                      <span>
                                        {"★".repeat(Math.floor(Number(value.product_rating)))}
                                        {"☆".repeat(5 - Math.floor(Number(value.product_rating)))}
                                        {" " + Number(value.product_review) + " reviews"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <a href={"/products/" + value.product_slug} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
                              </div>
                            </li>
                          )
                        })
                        }
                      </ul>
                    </div>
                  </div>
                  : null}
              </div>
            </section>
          </> : <>

            {/* Related products skeleton start */}

            <section className="section-product-recommendations spaced-section">
              <div className="product-recommendations">
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item">
                      <div className="subtitle"><Skeleton width={250} />
                      </div>
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">
                          <Skeleton width={250} /></h2>
                        <a href="/collections/all" className="button button--simple"><span className="button-simpl__label"><Skeleton width={250} /> </span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container">
                  <div className="product-recommendations__item">
                    <ul className="product-recommendations__list list-unstyled">
                      {[...Array(5)].map((_, index) => {
                        return (
                          <li className="collection-product-card product-recommendations__product quickview--hover show" key={index}>
                            <div className="card-wrapper js-color-swatches-wrapper">
                              <div className="card card--product" tabIndex="-1">
                                <div className="card__inner full-unstyled-link">
                                  <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "100%" }}>
                                    <Skeleton width='100%' height={400} />

                                  </div>

                                </div>
                              </div>
                              <div className="card-information">
                                <div className="card-information__wrapper">
                                  <div className="caption-with-letter-spacing subtitle"><Skeleton width={250} /></div>
                                  <h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/"} title="BCAA+EAA - watermelon"><Skeleton width={250} /></a></h3>
                                  <div className="price price--on-sale">
                                    <dl>
                                      <div className="price__sale">
                                        <dt><span className="visually-hidden visually-hidden--inline"><Skeleton width={250} /></span></dt>
                                        <dd><span className="price-item price-item--sale"><Skeleton width={250} /></span></dd>
                                        <dt className="price__compare"><span className="visually-hidden visually-hidden--inline"></span></dt>

                                      </div>

                                    </dl>
                                  </div>
                                </div>
                              </div>
                              <a href={"/products/"} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
                            </div>
                          </li>
                        )
                      })
                      }
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* Related products skeleton End */}

          </>
        }


        <Footer />


      </BrowserView>

      <MobileView>
        <Header></Header>
        {
          loading1 === false ? <>
            <Swiper
              spaceBetween={0}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              loop={true}
              slidesPerView={1}
              ref={MobsliderRef}
            >
              <SwiperSlide>
                <div className="gallery-page__single">
                  <div className="gallery-page__video">
                    <img className="w-100"
                      src={productData?.variationdefault_image != null ? productData?.variationdefault_image : constants.DEFAULT_IMAGE}
                      autoPlay="autoplay" loop muted playsInline alt={productData.product_name}></img>
                  </div>
                </div>
              </SwiperSlide>
              {productVariationDataGallery.length > 0 ?
                productVariationDataGallery.map((value, index) => {
                  return <>
                    <SwiperSlide key={index}>
                      <div className="gallery-page__single">
                        <div className="gallery-page__video">
                          <img className="w-100"
                            src={value?.pvg_image != null ? VarImageUrl + value?.pvg_image : constants.DEFAULT_IMAGE}
                            autoPlay="autoplay" loop muted playsInline alt=""></img>
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                }) : productDataGallery.map((value, index) => {
                  return <>
                    <SwiperSlide key={index}>
                      <div className="gallery-page__single">
                        <div className="gallery-page__video">
                          <img className="w-100"
                            src={value?.gallery_image != null ? value?.gallery_image : constants.DEFAULT_IMAGE}
                            autoPlay="autoplay" loop muted playsInline alt=""></img>
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                })}
            </Swiper>
            <section className="product-section spaced-section">
              <div className="product">
                <div className="product__outer container product__outer--desktop-order">
                  <div className="product__info-wrapper">
                    <div className="product__info-container">
                      <p className="subtitle product__text">{productData.product_category_name}</p>
                      <div className="product__title__wrapper">
                        <h1 className="product__title h3">{productData.product_name}</h1>
                      </div>
                      {Number(productData.product_rating) > 0 && Number(productData.product_review) > 0 && (
                        <span>
                          {"★".repeat(Math.floor(Number(productData.product_rating)))}
                          {"☆".repeat(5 - Math.floor(Number(productData.product_rating)))}
                          {" " + Number(productData.product_review) + " reviews"}
                        </span>
                      )}
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            {(() => {
                              const mrp = Number(productData.product_price);
                              const selling = Number(productData.product_selling_price);
                              const discount = mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0;

                              return (
                                <>
                                  <dd>
                                    <span className="price-item price-item--sale">₹{selling.toFixed(2)}</span>
                                  </dd>
                                  {discountPercentage > 0 ?
                                    <dd className="price__compare">
                                      <span className="price-item price-item--regular">MRP. ₹{mrp.toFixed(2)}</span>
                                      {discount > 0 && (<span className="price_discount"> {discount}% Off</span>)}
                                    </dd> : null}

                                </>
                              );
                            })()}
                          </dl>
                        </div>
                      </div>
                      <div className="stock-text">
                        Availability:
                        {productData.product_type === 0 ? (
                          productData.product_inventory === 1 ? (
                            productData.product_stock == 0 ? (
                              productData.product_backorder === 0 ||
                                productData.product_backorder === 1 ? (
                                <span className="outofdtock">Out of Stock</span>
                              ) : (
                                <span className="instock">In Stock</span>
                              )
                            ) : (
                              <span className="instock">In Stock</span>
                            )
                          ) : (
                            <span className="instock">In Stock</span>
                          )
                        ) : productData.product_stock == 0 ? (
                          <span className="outofdtock">Out of Stock</span>
                        ) : (
                          <span className="instock">In Stock</span>
                        )}
                      </div>
                      {variationDataa.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constants.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,
                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${valueVariationAttr.variation_images !=
                                            null
                                            ? valueVariationAttr
                                              .variation_images.pti_image
                                            : constants.DEFAULT_IMAGE
                                            })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <img
                                          src={
                                            valueVariationAttr.variation_images !=
                                              null
                                              ? valueVariationAttr
                                                .variation_images.pti_image
                                              : constants.DEFAULT_IMAGE
                                          }
                                          alt={productData.product_name}
                                          width="100"
                                          height="100"
                                        />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>

                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        {valueVariationAttr.terms_name}
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div className="product-form">
                        <div className="product-form__buttons">
                          <div className="product-parameters__item product-parameters__quantity">
                            <p className="product-form__group-name">Quantity</p>
                            <div className="product-form__input product-form__quantity">
                              <div className="quantity">
                                <button className="quantity__button no-js-hidden" name="minus" type="button" onClick={handleDecrease}>
                                  <svg viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-minus" width="10px" height="2px">
                                    <path d="M4.28571 0.285645L5.71429 0.298828V0.285645H10V1.71422H5.71429H4.28571H0V0.285645H4.28571Z" fill="currentColor"></path>
                                  </svg>
                                </button>
                                <input className="quantity__input" type="number" name="quantity" id="Quantity-template--18847832310041__main" min="1" value={quantity} />
                                <button className="quantity__button no-js-hidden" name="plus" type="button" onClick={handleIncrease}>
                                  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-plus" width="10px" height="10px">
                                    <path d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z" fill="currentColor"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          {setSession ?
                            <>
                              <div className="product-form__checkout">
                                <button className="button button--primary" style={{ width: '100%' }} onClick={(e) => addtocartsession(productData, 1)}>Buy it now</button>
                              </div>
                              <div className="product-form__quantity__add__buttons">
                                <button type="submit" name="add" className="product-form__submit button button--secondary">
                                  <span className="add_to_cart_quantity" onClick={(e) => addtocartsession(productData, 0)}>Add to Cart</span>
                                </button>
                              </div>
                            </> :
                            <>
                              <div className="product-form__checkout">
                                <button className="button button--primary" style={{ width: '100%' }} onClick={(e) => addtocart(productData, 1)}>Buy it now</button>
                              </div>
                              <div className="product-form__quantity__add__buttons">
                                <button type="submit" name="add" className="product-form__submit button button--secondary">
                                  <span className="add_to_cart_quantity" onClick={(e) => addtocart(productData, 0)}>Add to Cart</span>
                                </button>
                              </div>
                            </>}
                        </div>
                      </div>
                      <div className="footer__payment">
                        <ul className="list list-payment">
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-visa"
                            >
                              <title id="pi-visa">Visa</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                                fill="#142688"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-master"
                            >
                              <title id="pi-master">Mastercard</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <circle
                                fill="#EB001B"
                                cx="15"
                                cy="12"
                                r="7"
                              ></circle>
                              <circle
                                fill="#F79E1B"
                                cx="23"
                                cy="12"
                                r="7"
                              ></circle>
                              <path
                                fill="#FF5F00"
                                d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 38 24"
                              width="38"
                              height="24"
                              aria-labelledby="pi-american_express"
                            >
                              <title id="pi-american_express">
                                American Express
                              </title>
                              <g fill="none">
                                <path
                                  fill="#000"
                                  d="M35,0 L3,0 C1.3,0 0,1.3 0,3 L0,21 C0,22.7 1.4,24 3,24 L35,24 C36.7,24 38,22.7 38,21 L38,3 C38,1.3 36.6,0 35,0 Z"
                                  opacity=".07"
                                ></path>
                                <path
                                  fill="#006FCF"
                                  d="M35,1 C36.1,1 37,1.9 37,3 L37,21 C37,22.1 36.1,23 35,23 L3,23 C1.9,23 1,22.1 1,21 L1,3 C1,1.9 1.9,1 3,1 L35,1"
                                ></path>
                                <path
                                  fill="#FFF"
                                  d="M8.971,10.268 L9.745,12.144 L8.203,12.144 L8.971,10.268 Z M25.046,10.346 L22.069,10.346 L22.069,11.173 L24.998,11.173 L24.998,12.412 L22.075,12.412 L22.075,13.334 L25.052,13.334 L25.052,14.073 L27.129,11.828 L25.052,9.488 L25.046,10.346 L25.046,10.346 Z M10.983,8.006 L14.978,8.006 L15.865,9.941 L16.687,8 L27.057,8 L28.135,9.19 L29.25,8 L34.013,8 L30.494,11.852 L33.977,15.68 L29.143,15.68 L28.065,14.49 L26.94,15.68 L10.03,15.68 L9.536,14.49 L8.406,14.49 L7.911,15.68 L4,15.68 L7.286,8 L10.716,8 L10.983,8.006 Z M19.646,9.084 L17.407,9.084 L15.907,12.62 L14.282,9.084 L12.06,9.084 L12.06,13.894 L10,9.084 L8.007,9.084 L5.625,14.596 L7.18,14.596 L7.674,13.406 L10.27,13.406 L10.764,14.596 L13.484,14.596 L13.484,10.661 L15.235,14.602 L16.425,14.602 L18.165,10.673 L18.165,14.603 L19.623,14.603 L19.647,9.083 L19.646,9.084 Z M28.986,11.852 L31.517,9.084 L29.695,9.084 L28.094,10.81 L26.546,9.084 L20.652,9.084 L20.652,14.602 L26.462,14.602 L28.076,12.864 L29.624,14.602 L31.499,14.602 L28.987,11.852 L28.986,11.852 Z"
                                ></path>
                              </g>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              width="38"
                              height="24"
                              role="img"
                              aria-labelledby="pi-paypal"
                            >
                              <title id="pi-paypal">PayPal</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                fill="#003087"
                                d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                              ></path>
                              <path
                                fill="#3086C8"
                                d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                              ></path>
                              <path
                                fill="#012169"
                                d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              width="38"
                              height="24"
                              aria-labelledby="pi-diners_club"
                            >
                              <title id="pi-diners_club">Diners Club</title>
                              <path
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                              ></path>
                              <path
                                d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z"
                                fill="#3086C8"
                              ></path>
                            </svg>
                          </li>
                          <li className="list-payment__item">
                            <svg
                              className="icon icon--full-color"
                              viewBox="0 0 38 24"
                              width="38"
                              height="24"
                              role="img"
                              aria-labelledby="pi-discover"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title id="pi-discover">Discover</title>
                              <path
                                fill="#000"
                                opacity=".07"
                                d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                              ></path>
                              <path
                                d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z"
                                fill="#fff"
                              ></path>
                              <path
                                d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                                fill="url(#pi-paint0_linear)"
                              ></path>
                              <path
                                opacity=".65"
                                d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                                fill="url(#pi-paint1_linear)"
                              ></path>
                              <path
                                d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z"
                                fill="#231F20"
                              ></path>
                              <path
                                d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z"
                                fill="#F48120"
                              ></path>
                              <defs>
                                <linearGradient
                                  id="pi-paint0_linear"
                                  x1="21.657"
                                  y1="12.275"
                                  x2="19.632"
                                  y2="9.104"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#F89F20"></stop>
                                  <stop offset=".25" stopColor="#F79A20"></stop>
                                  <stop offset=".533" stopColor="#F68D20"></stop>
                                  <stop offset=".62" stopColor="#F58720"></stop>
                                  <stop offset=".723" stopColor="#F48120"></stop>
                                  <stop offset="1" stopColor="#F37521"></stop>
                                </linearGradient>
                                <linearGradient
                                  id="pi-paint1_linear"
                                  x1="21.338"
                                  y1="12.232"
                                  x2="18.378"
                                  y2="6.446"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#F58720"></stop>
                                  <stop offset=".359" stopColor="#E16F27"></stop>
                                  <stop offset=".703" stopColor="#D4602C"></stop>
                                  <stop offset=".982" stopColor="#D05B2E"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </li>
                        </ul>
                      </div>
                      {productData.product_description ?
                        <div className="product-about">
                          <div className="product-about__outer">
                            <div className="product-about__right">
                              <div className="product-about__wrapper">
                                <div className="product-about__accordion-item">
                                  <h2 className={`h5 product-about__accordion-title${descActive ? ' active' : ''}`} onClick={descToggle}>
                                    <span>Description</span>
                                    <div className="product-about__more-link-wrapper">
                                      <div className="product-about__more-link">
                                        <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </h2>
                                  <div className="product-about__accordion-description main-product-description" style={{ display: descActive ? 'block' : 'none' }}>
                                    <span dangerouslySetInnerHTML={{ __html: productData.product_description }}></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : null}
                      {productData.product_tabs &&
                        productData.product_tabs.length > 0 &&
                        productData.product_tabs.map((value, index) => (
                          <div className="product-about" key={index}>
                            <div className="product-about__outer">
                              <div className="product-about__right">
                                <div className="product-about__wrapper">
                                  <div className="product-about__accordion-item">
                                    <h2
                                      className={`h5 product-about__accordion-title${productTabsActive === value.tab_id ? ' active' : ''}`}
                                      onClick={() => productTabsToggle(value.tab_id)}
                                    >
                                      <span>{value.tab_name}</span>
                                      <div className="product-about__more-link-wrapper">
                                        <div className="product-about__more-link">
                                          <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </h2>
                                    <div className="product-about__accordion-description main-product-description" style={{ display: productTabsActive === value.tab_id ? 'block' : 'none' }}>
                                      <span dangerouslySetInnerHTML={{ __html: value.tab_description }}></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>


          </> : <>

            {/* collection details skeleton start */}

            <Swiper
              spaceBetween={0}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              loop={true}
              slidesPerView={1}
              ref={MobsliderRef}
            >

              <SwiperSlide>
                <div className="gallery-page__single">
                  <div className="gallery-page__video">
                    <Skeleton width='100%' height={500} />
                  </div>
                </div>
              </SwiperSlide>

            </Swiper>
            <section className="product-section spaced-section">
              <div className="product">
                <div className="product__outer container product__outer--desktop-order">
                  <div className="product__info-wrapper">
                    <div className="product__info-container">
                      <p className="subtitle product__text"><Skeleton width={250} height={30} /></p>
                      <div className="product__title__wrapper">
                        <h1 className="product__title h3"><Skeleton width={250} height={30} /></h1>
                      </div>
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            <dd><span className="price-item price-item--sale"><Skeleton width={250} height={30} /></span></dd>
                          </dl>
                        </div>
                      </div>

                      {variationDataa.map((valueVariation, indexVariation) => {
                        if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 1
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                {valueVariation.attributes.attribute_name}:
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "color active"
                                      : "color";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        data-src={constants.DEFAULT_IMAGE}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundColor:
                                            valueVariationAttr.terms_value,
                                          display: "block",
                                        }}
                                      ></a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 2
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                <Skeleton width={350} height={30} />
                              </label>
                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "swatch active"
                                      : "swatch";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        key={indexvalueVariationAttr}
                                        href="javascript:void(0)"
                                        style={{
                                          backgroundImage: `url(${valueVariationAttr.variation_images !=
                                            null
                                            ? valueVariationAttr
                                              .variation_images.pti_image
                                            : constants.DEFAULT_IMAGE
                                            })`,
                                          backgroundColor: "#c8c7ce",
                                        }}
                                      >
                                        <Skeleton width='100%' height={530} />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          valueVariation.attributes &&
                          valueVariation.attributes.attribute_type === 3
                        ) {
                          return (
                            <div className="dvariation" key={indexVariation}>
                              <label>
                                <Skeleton width={350} height={30} />
                              </label>

                              <div className="dvariation-list">
                                {valueVariation.attr_terms.map(
                                  (
                                    valueVariationAttr,
                                    indexvalueVariationAttr
                                  ) => {
                                    const stringIncluded = selvararray.includes(
                                      valueVariationAttr.terms_name
                                    );
                                    const className = stringIncluded
                                      ? "size active"
                                      : "size";
                                    return (
                                      <a
                                        onClick={() =>
                                          variationSelect(
                                            valueVariationAttr,
                                            indexVariation
                                          )
                                        }
                                        className={className}
                                        href="javascript:void(0)"
                                        key={indexvalueVariationAttr}
                                      >
                                        <Skeleton width={350} height={30} />
                                      </a>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}

                      {productData.product_description ?
                        <div className="product-about">
                          <div className="product-about__outer">
                            <div className="product-about__right">
                              <div className="product-about__wrapper">
                                <div className="product-about__accordion-item">
                                  <h2 className={`h5 product-about__accordion-title${descActive ? ' active' : ''}`} onClick={descToggle}>
                                    <span>                                        <Skeleton width={350} height={30} />
                                    </span>
                                    <div className="product-about__more-link-wrapper">
                                      <div className="product-about__more-link">
                                        <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </h2>
                                  <div className="product-about__accordion-description main-product-description" style={{ display: descActive ? 'block' : 'none' }}>
                                    <span><Skeleton width={350} height={30} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : null}
                      {productData.product_tabs &&
                        productData.product_tabs.length > 0 &&
                        productData.product_tabs.map((value, index) => (
                          <div className="product-about" key={index}>
                            <div className="product-about__outer">
                              <div className="product-about__right">
                                <div className="product-about__wrapper">
                                  <div className="product-about__accordion-item">
                                    <h2
                                      className={`h5 product-about__accordion-title${productTabsActive === value.tab_id ? ' active' : ''}`}
                                      onClick={() => productTabsToggle(value.tab_id)}
                                    >
                                      <span><Skeleton width={350} height={30} /></span>
                                      <div className="product-about__more-link-wrapper">
                                        <div className="product-about__more-link">
                                          <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </h2>
                                    <div className="product-about__accordion-description main-product-description" style={{ display: productTabsActive === value.tab_id ? 'block' : 'none' }}>
                                      <span><Skeleton width={350} height={30} /></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* collection details skeleton end */}

          </>
        }

        {
          loading2 === false ? <>
            <section className="section-product-recommendations spaced-section">
              <div className="product-recommendations">
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item">
                      <div className="subtitle">subheading</div>
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">You May Also Like</h2>
                        <a href="/collections/all" className="button button--simple"><span className="button-simpl__label">Shop all</span></a>
                      </div>
                    </div>
                  </div>
                </div>
                {relatedProducts.length > 0 ?
                  <div className="container">
                    <div className="product-recommendations__item">
                      <ul className="product-recommendations__list list-unstyled">
                        {relatedProducts.map((value, index) => {
                          return (
                            <li className="collection-product-card product-recommendations__product quickview--hover show" key={index}>
                              <div className="card-wrapper js-color-swatches-wrapper">
                                <div className="card card--product" tabIndex="-1">
                                  <div className="card__inner full-unstyled-link">
                                    <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "120%" }}>
                                      <img src={value.product_image != null ? value.product_image : constants.DEFAULT_IMAGE} className="motion-reduce media--first" style={{ objectFit: "cover" }} alt="" />
                                      {value.gallery.length > 0 ? (
                                        <img style={{ objectFit: 'cover' }} src={value.gallery[0].gallery_image ? value.gallery[0].gallery_image : constants.DEFAULT_IMAGE} alt={value.product_name} className='motion-reduce media--second' />
                                      ) : null}
                                    </div>
                                    <div className="quick-add no-js-hidden">
                                      <button type="button" name="add" className="card__link button button--primary button--full-width">
                                        <div className="quick-add__label"
                                          onClick={() => handleShowQuickModal(value.product_slug)}
                                        >Quick view</div>
                                        <span>
                                          <svg className="icon icon-button-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_2071_16434)">
                                              <path d="M2.24268 12.2427L12.1422 2.34326" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                              <path d="M4.36377 1.63617H12.8491V10.1215" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_2071_16434"><rect width="14" height="14" fill="currentColor"></rect></clipPath>
                                            </defs>
                                          </svg>
                                        </span>
                                        <div className="loading-overlay__spinner hidden">
                                          <svg aria-hidden="true" focusable="false" role="presentation" className="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                            <circle className="path" fill="none" strokeWidth="6" cx="33" cy="33" r="30"></circle>
                                          </svg>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="card-information">
                                  <div className="card-information__wrapper">
                                    <div className="caption-with-letter-spacing subtitle">{value.product_category_name}</div>
                                    <h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/" + value.product_slug} title="BCAA+EAA - watermelon">{value.product_name}</a></h3>
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
                                    {Number(value.product_rating) > 0 && Number(value.product_review) > 0 && (
                                      <span>
                                        {"★".repeat(Math.floor(Number(value.product_rating)))}
                                        {"☆".repeat(5 - Math.floor(Number(value.product_rating)))}
                                        {" " + Number(value.product_review) + " reviews"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <a href={"/products/" + value.product_slug} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
                              </div>
                            </li>
                          )
                        })
                        }
                      </ul>
                    </div>
                  </div>
                  : null}
              </div>
            </section>
          </> : <>

            {/* Related products skeleton start */}

            <section className="section-product-recommendations spaced-section">
              <div className="product-recommendations">
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item">
                      <div className="subtitle"> <Skeleton width={250} />
                      </div>
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">
                          <Skeleton width={250} /></h2>
                        <a href="/collections/all" className="button button--simple"><span className="button-simpl__label"><Skeleton width={250} /> </span></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container">
                  <div className="product-recommendations__item">
                    <ul className="product-recommendations__list list-unstyled">
                      {[...Array(9)].map((_, index) => {
                        return (
                          <li className="collection-product-card product-recommendations__product quickview--hover show" key={index}>
                            <div className="card-wrapper js-color-swatches-wrapper">
                              <div className="card card--product" tabIndex="-1">
                                <div className="card__inner full-unstyled-link">
                                  <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "100%" }}>
                                    <Skeleton width='100%' height={400} />

                                  </div>

                                </div>
                              </div>
                              <div className="card-information">
                                <div className="card-information__wrapper">
                                  <div className="caption-with-letter-spacing subtitle"><Skeleton width={250} /></div>
                                  <h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/"} title="BCAA+EAA - watermelon"><Skeleton width={250} /></a></h3>
                                  <div className="price price--on-sale">
                                    <dl>
                                      <div className="price__sale">
                                        <dt><span className="visually-hidden visually-hidden--inline"><Skeleton width={250} /></span></dt>
                                        <dd><span className="price-item price-item--sale"><Skeleton width={250} /></span></dd>
                                        <dt className="price__compare"><span className="visually-hidden visually-hidden--inline"></span></dt>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                              <a href={"/products/"} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
                            </div>
                          </li>
                        )
                      })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        }
        <Footer></Footer>
      </MobileView>
      {
        showModal ?
          <QuickviewModal showModal={showModal} handleClose={handleClose} slugData={slugData} />
          : null}
    </>
  );
}

export default CollectionsDetail;
