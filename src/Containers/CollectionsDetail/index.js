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
      slug: slug
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
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            <dd><span className="price-item price-item--sale">₹{formatter.format(productData.product_selling_price)}</span></dd>
                            {discountPercentage > 0 ? <dd className="price__compare"><span className="price-item price-item--regular">MRP. ₹{formatter.format(productData.product_price)}</span></dd> : null}
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
                                    <h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/" + value.product_slug} title="BCAA+EAA - watermelon">{value.product_name}</a></h3>
                                    <div className="price price--on-sale">
                                      <dl>
                                        <div className="price__sale">
                                          <dt><span className="visually-hidden visually-hidden--inline">Sale price</span></dt>
                                          <dd><span className="price-item price-item--sale">₹{formatter.format(value.product_selling_price)}</span></dd>
                                          <dt className="price__compare"><span className="visually-hidden visually-hidden--inline">Regular price</span></dt>
                                          <dd className="price__compare"><span className="price-item price-item--regular">MRP. ₹{formatter.format(value.product_price)}</span></dd>
                                          <dd className="card__badge"></dd>
                                        </div>
                                        <dl className="unit-price caption hidden">
                                          <dt className="visually-hidden">Unit price</dt>
                                          <dd><span></span><span aria-hidden="true">/</span><span className="visually-hidden">&nbsp;per&nbsp;</span><span></span></dd>
                                        </dl>
                                      </dl>
                                    </div>
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
                      <div className="price-wrapper">
                        <div className="price  price--on-sale">
                          <dl>
                            <dd><span className="price-item price-item--sale">₹{formatter.format(productData.product_selling_price)}</span></dd>
                            {discountPercentage > 0 ? <dd className="price__compare"><span className="price-item price-item--regular">MRP.  ₹{formatter.format(productData.product_price)}</span></dd> : null}
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
                                          <dt><span className="visually-hidden visually-hidden--inline">Sale price</span></dt>
                                          <dd><span className="price-item price-item--sale">₹{formatter.format(value.product_selling_price)}</span></dd>
                                          <dt className="price__compare"><span className="visually-hidden visually-hidden--inline">Regular price</span></dt>
                                          <dd className="price__compare"><span className="price-item price-item--regular">₹{formatter.format(value.product_price)}</span></dd>
                                          <dd className="card__badge"></dd>
                                        </div>
                                        <dl className="unit-price caption hidden">
                                          <dt className="visually-hidden">Unit price</dt>
                                          <dd><span></span><span aria-hidden="true">/</span><span className="visually-hidden">&nbsp;per&nbsp;</span><span></span></dd>
                                        </dl>
                                      </dl>
                                    </div>
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
