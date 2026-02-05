import React, { useContext, useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { ApiService } from '../../services/apiServices';
import constants from '../../services/constants';
import { showToast } from '../utils/toastUtils';
import { trackAddToCart } from '../../services/facebookTracking';
import ReactPixel from '../../services/FacebookPixel';
import DataContext from '../context';
import Loader from "react-js-loader";

function QuickviewModal({ showModal, handleClose, slugData }) {

  const navigate = useNavigate()
  const { slug } = useParams();
  const didMountRef = useRef(true)
  const contextValues = useContext(DataContext)
  const [productData, setProductData] = useState("")
  const [productDataGallery, setProductDataGallery] = useState([])
  const [productVariationDataGallery, setproductVariationDataGallery] = useState([])
  const [VarImageUrl, setVarImageUrl] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [variationDataa, setVariationData] = useState([]);
  const [descActive, setdescActive] = useState(false);
  const [selvararray, setSelvararray] = useState([]);
  const [arySelectedData, setArySelectedData] = useState([]);
  const [adminData, setAdminData] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [setSession, SetSession] = useState("");
  const [spinnerLoading, setSpinnerLoading] = useState(false);

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

  const [productTabsActive, setProductTabsActive] = useState(null);

  const productTabsToggle = (tabId) => {
    setProductTabsActive((prevActiveTab) => (prevActiveTab === tabId ? null : tabId));
  };
  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  useEffect(() => {
    if (didMountRef.current) {
      SetSession(localStorage.getItem("USER_SESSION"));
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
      slug: slugData,
      location: contextValues.currentLocation
    };
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
      setProductData(productData);
      setproductVariationDataGallery(res.data.productvariationsgallery)
      if (MobsliderRef.current && MobsliderRef.current.swiper) {
        // Slide to the first tab (index 0)
        MobsliderRef.current.swiper.slideTo(0);
      }
      mrpValue = parseFloat(res.data.pv_price);
      sellingPriceValue = parseFloat(res.data.pv_sellingprice);
      if (!isNaN(mrpValue) && !isNaN(sellingPriceValue)) {
        discount = ((mrpValue - sellingPriceValue) / mrpValue) * 100;
      }
      setDiscountPercentage(discount.toFixed(2));
      setQuantity(1);
    });
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
    // contextValues.setSpinnerCubLoader(addproduct.product_id+purchaseType)
    setSpinnerLoading(true);
    ApiService.postData("addtocartsession", dataString).then((res) => {
      if (res.data.status === "success") {
        showToast('success', res.data.message, 1000);
        localStorage.removeItem("COUPON_SESSION");
        contextValues.setcartCount(res.data.resCartData.length)
        contextValues.setCartSessionData(res.data.resCartData)
        // contextValues.setToggleQuickViewModal(false)

        // contextValues.setSpinnerCubLoader(0)
        setSpinnerLoading(false);
        if (purchaseType === 1) {
          navigate("/cart");
        } else {
          window.location.reload();
        }
        // if (purchaseType === 1) {
        //   contextValues.setToggleCheckoutModal(true)
        // } else {
        //   contextValues.setToggleCartModal(true)
        // }
      } else {
        showToast('error', res.data.message, 1000);
        setSpinnerLoading(false);
      }
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
        JSON.stringify(item.product_variation) === JSON.stringify(product.product_variation)
      );
    });

    if (addproduct.product_type === 0) {
      if (addproduct.product_inventory === 1) {
        if (Number(addproduct.product_stock) > 0) {
          // if (addproduct.product_backorder !== 0) {
          if (existingProductIndex !== -1) {
            if (
              cartSession[existingProductIndex].quantity + quantity <=
              Number(addproduct.product_stock)
            ) {
              if (
                Number(addproduct.product_moq) === 0 ||
                cartSession[existingProductIndex].quantity + quantity <=
                Number(addproduct.product_moq)
              ) {
                cartSession[existingProductIndex].quantity += quantity;
                showToast('success', "Quantity updated Successfully");
              } else {
                showToast('error',
                  "You can add maximum " +
                  addproduct.product_moq +
                  " quantity at a time!"
                );
                return false;
              }
            } else {
              showToast('error', "Product is out of stock");
              return false;
            }
          } else {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          }
        } else {
          if (addproduct.product_backorder === 0) {
            showToast('error', "Product is out of stock");
            return false;
          } else if (addproduct.product_backorder === 1) {
            if (existingProductIndex !== -1) {
              if (
                Number(addproduct.product_moq) === 0 ||
                cartSession[existingProductIndex].quantity + quantity <=
                Number(addproduct.product_moq)
              ) {
                cartSession[existingProductIndex].quantity += quantity;
                showToast('success', "Quantity updated Successfully");
              } else {
                showToast('error',
                  "You can add maximum " +
                  addproduct.product_moq +
                  " quantity at a time!"
                );
                return false;
              }
            } else {
              cartSession.push({ ...product, quantity: quantity });
              showToast('success', "Product Added in cart Successfully");
            }
          } else {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          }
        }
      } else {
        if (existingProductIndex !== -1) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + quantity <=
            Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += quantity;
            showToast('success', "Quantity updated Successfully");
          } else {
            showToast('error',
              "You can add maximum " +
              addproduct.product_moq +
              " quantity at a time!"
            );
            return false;
          }
        } else {
          if (
            Number(addproduct.product_moq) === 0 ||
            1 <= Number(addproduct.product_moq)
          ) {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          } else {
            showToast('error',
              "You can add maximum " +
              addproduct.product_moq +
              " quantity at a time!"
            );
            return false;
          }
        }
      }
    } else {
      if (existingProductIndex !== -1) {
        if (
          cartSession[existingProductIndex].quantity + quantity <=
          Number(addproduct.product_stock)
        ) {
          if (
            Number(addproduct.product_moq) === 0 ||
            cartSession[existingProductIndex].quantity + quantity <=
            Number(addproduct.product_moq)
          ) {
            cartSession[existingProductIndex].quantity += quantity;
            showToast('success', "Quantity updated Successfully");
          } else {
            showToast('error',
              "You can add maximum " +
              addproduct.product_moq +
              " quantity at a time!"
            );
            return false;
          }
        } else {
          showToast('error', "Product is out of stock");
          return false;
        }
      } else {
        if (1 <= Number(addproduct.product_stock)) {
          if (
            Number(addproduct.product_moq) === 0 ||
            1 <= Number(addproduct.product_moq)
          ) {
            cartSession.push({ ...product, quantity: quantity });
            showToast('success', "Product Added in cart Successfully");
          } else {
            showToast('error',
              "You can add maximum " +
              addproduct.product_moq +
              " quantity at a time!"
            );
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
    console.log("cartSession", cartSession);
    contextValues.setCartSessionData(cartSession)
    contextValues.setcartCount(cartSession.length)
    contextValues.setCouponSession({})

    localStorage.removeItem("COUPON_SESSION");
    trackAddToCart(cartSession)

    if (purchaseType === 1) {
      navigate("/cart");
    } else {
      window.location.reload();
    }

  };

  return (
    <>
      <Modal show={showModal} className='quickviewmodal' >
        <Modal.Body style={{ padding: '0px' }}>
          <button className="pop-close" onClick={() => { handleClose() }}></button>
          <section className="spaced-section product-section">
            <div className="product">
              <div className="product__outer container product__outer--desktop-order" style={{ gap: '4rem' }}>
                <div className='product__media-wrapper product__media-wrapper--desktop-order'>
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
                </div>
                <div className="product__info-wrapper" style={{ maxWidth: '100%' }}>
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
                          <React.Fragment key={indexVariation}>
                            <div className="dvariation" >
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
                          </React.Fragment>
                        );
                      } else if (
                        valueVariation.attributes &&
                        valueVariation.attributes.attribute_type === 2
                      ) {
                        return (
                          <React.Fragment key={indexVariation}>
                            <div className="dvariation" >
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
                          </React.Fragment>
                        );
                      } else if (
                        valueVariation.attributes &&
                        valueVariation.attributes.attribute_type === 3
                      ) {
                        return (
                          <React.Fragment key={indexVariation}>
                            <div className="dvariation" >
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
                                      <React.Fragment key={indexvalueVariationAttr}>
                                        <a
                                          onClick={() =>
                                            variationSelect(
                                              valueVariationAttr,
                                              indexVariation
                                            )
                                          }
                                          className={className}
                                          href="javascript:void(0)"
                                        >
                                          {valueVariationAttr.terms_name}
                                        </a>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </React.Fragment>
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
                      {spinnerLoading ? <Loader type="spinner-cub" bgColor={'#2e3192'} color={'#2e3192'} size={50} /> : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default QuickviewModal;
