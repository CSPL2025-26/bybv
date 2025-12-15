import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../services/apiServices";
import constants from "../../services/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuickviewModal from "../Modals/quickview_modal";
import DataContext from "../context";
function Popularproducts() {
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const [popularProductData, setPopularProductData] = useState([]);
  const [slugData, setSlugData] = useState();

  const [loading, setLoading] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleShowQuickModal = (slug) => {
    setSlugData(slug)
    setShowModal(true);
  };


  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (contextValues.curretnLocationLoader) {
      getCategoryWiseData();
    }
    didMountRef.current = false;
  },[contextValues.curretnLocationLoader]);

  const getCategoryWiseData = async () => {
    setLoading(true);

    const payload = contextValues.currentLocation;

    ApiService.postData("featured-products-list", payload).then((res) => {
      if (res.status === "success") {
        setPopularProductData(res.products);
      }
      setLoading(false);
    });
  };

  return (
    <>
      <BrowserView>
        {popularProductData.length > 0 ? (
          <>
            <section className="popular-products-section spaced-section">
              <div className="popular-products">
                <div className="section-header__line">
                  <div className="container">
                    <div className="section-header__item">
                      {/* <div className="subtitle">best sellers</div> */}
                      <div className="section-header__title__block">
                        <h2 className="section-header__title title--section h2">
                          Popular Products
                        </h2>
                        <a href="/collections/popular" className="button button--simple">
                          <span className="button-simpl__label">View All</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <ul className="popular-products__wrapper list-unstyled">
                    {popularProductData.map((value, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li
                            className="collection-product-card collection-popular-card quickview--hover show">
                            <div className="card-wrapper  js-color-swatches-wrapper">
                              <div className="card card--product" tabIndex={-1}>
                                <div className="card__inner full-unstyled-link">
                                  <div
                                    className="media media--transparent media--portrait media--hover-effect"
                                    style={{ paddingBottom: "120%" }}
                                  >
                                    <img
                                      style={{ objectFit: "cover" }}
                                      src={
                                        value.product_image != null
                                          ? value.product_image
                                          : constants.DEFAULT_IMAGE
                                      }
                                      className="motion-reduce media--first"
                                    ></img>
                                    {value.gallery.length > 0 ? (
                                      <img
                                        style={{ objectFit: "cover" }}
                                        src={
                                          value.gallery[0].gallery_image
                                            ? value.gallery[0].gallery_image
                                            : constants.DEFAULT_IMAGE
                                        }
                                        alt={value.product_name}
                                        className="motion-reduce media--second"
                                      />
                                    ) : null}
                                  </div>
                                  <div className="quick-add no-js-hidden">
                                    <button
                                      type="button"
                                      name="add"
                                      className="card__link button button--primary button--full-width"
                                      onClick={() => handleShowQuickModal(value.product_slug)}
                                    >
                                      <div className="quick-add__label">
                                        Quick view
                                      </div>
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
                                      <div className="loading-overlay__spinner hidden">
                                        <svg
                                          aria-hidden="true"
                                          focusable="false"
                                          role="presentation"
                                          className="spinner"
                                          viewBox="0 0 66 66"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            className="path"
                                            fill="none"
                                            strokeWidth="6"
                                            cx="33"
                                            cy="33"
                                            r="30"
                                          ></circle>
                                        </svg>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="card-information">
                                <div className="card-information__wrapper">
                                  <div className="caption-with-letter-spacing subtitle">
                                    {value.product_category_name}
                                  </div>
                                  <h3 className="card__title h5">
                                    <a
                                      className="full-unstyled-link"
                                      href={"/products/" + value.product_slug}
                                      title="BCAA+EAA - watermelon"
                                    >
                                      {value.product_name}
                                    </a>
                                  </h3>
                                  <div className="price  price--on-sale ">
                                    <dl>
                                      <div className="price__sale">
                                        <dt>
                                          <span className="visually-hidden visually-hidden--inline">
                                            Sale price
                                          </span>
                                        </dt>
                                        <dd>
                                          <span className="price-item price-item--sale">
                                            ₹{Number(value.product_selling_price).toFixed(2)}
                                          </span>
                                        </dd>
                                        <dt className="price__compare">
                                          <span className="visually-hidden visually-hidden--inline">
                                            Regular price
                                          </span>
                                        </dt>
                                        <dd className="price__compare">
                                          <span className="price-item price-item--regular">
                                            MRP. ₹{Number(value.product_price).toFixed(2)}
                                          </span>
                                        </dd>
                                        <dd className="card__badge"></dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={"/products/" + value.product_slug}
                                className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                aria-label="Product link"
                              ></a>
                            </div>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>

                </div>
              </div>
            </section>
          </>
        ) :

          loading == true ? (
            <>
              <section className="popular-products-section spaced-section">
                <div className="popular-products">
                  <div className="section-header__line">
                    <div className="container">
                      <div className="section-header__item">
                        {/* <div className="subtitle">best sellers</div> */}
                        <div className="section-header__title__block">
                          <h2 className="section-header__title title--section h2">
                            Popular Products
                          </h2>
                          <a href="/collections/popular" className="button button--simple">
                            <span className="button-simpl__label">View All</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <ul className="popular-products__wrapper list-unstyled">
                      {
                        [...Array(4)].map((_, index) => {
                          return (
                            <React.Fragment key={index}>
                              <li className="collection-product-card collection-popular-card quickview--hover show">
                                <div className="card-wrapper  js-color-swatches-wrapper">
                                  <div className="card card--product" tabIndex={-1}>
                                    <div className="card__inner full-unstyled-link">
                                      <div
                                        className="media media--transparent media--portrait media--hover-effect"
                                        style={{ paddingBottom: "100%" }}
                                      >
                                        <Skeleton width={600} height={600} />
                                      </div>
                                      <div className="card-information">
                                        <div className="card-information__wrapper">
                                          <div className="caption-with-letter-spacing subtitle">
                                            <Skeleton width={250} />
                                          </div>
                                          <h3 className="card__title h5">
                                            <a
                                              className="full-unstyled-link"
                                              href={"/products/"}
                                              title="BCAA+EAA - watermelon"
                                            >
                                              <Skeleton width={250} />
                                            </a>
                                          </h3>
                                          <div className="price  price--on-sale ">
                                            <dl>
                                              <div className="price__sale">

                                                <dd>
                                                  <span className="price-item price-item--sale">
                                                    <Skeleton width={250} />
                                                  </span>
                                                </dd>
                                                <dd className="card__badge"></dd>
                                              </div>
                                            </dl>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </React.Fragment>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              </section>
            </>
          ) : null
        }
      </BrowserView>

      <MobileView>
        <section className="popular-products-section spaced-section">
          <div className="popular-products">
            <div className="section-header__line">
              <div className="container">
                <div className="section-header__item">
                  {/* <div className="subtitle">best sellers</div> */}
                  <div className="section-header__title__block">
                    <h2 className="section-header__title title--section h2">
                      Popular Products
                    </h2>
                    <a href="/collections/popular" className="button button--simple">
                      <span className="button-simpl__label">View All</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              {popularProductData.length > 0 ? (
                <>
                  <ul className="popular-products__wrapper list-unstyled">
                    {popularProductData.map((value, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li
                            className="collection-product-card collection-popular-card quickview--hover show"

                          >
                            <div className="card-wrapper  js-color-swatches-wrapper">
                              <div className="card card--product" tabIndex={-1}>
                                <div className="card__inner full-unstyled-link">
                                  <div
                                    className="media media--transparent media--portrait media--hover-effect"
                                    style={{ paddingBottom: "120%" }}
                                  >
                                    <img
                                      style={{ objectFit: "cover" }}
                                      src={
                                        value.product_image != null
                                          ? value.product_image
                                          : constants.DEFAULT_IMAGE
                                      }
                                      className="motion-reduce media--first"
                                    ></img>
                                    {value.gallery.length > 0 ? (
                                      <img
                                        style={{ objectFit: "cover" }}
                                        src={
                                          value.gallery[0].gallery_image
                                            ? value.gallery[0].gallery_image
                                            : constants.DEFAULT_IMAGE
                                        }
                                        alt={value.product_name}
                                        className="motion-reduce media--second"
                                      />
                                    ) : null}
                                  </div>
                                  <div className="quick-add no-js-hidden">
                                    <button
                                      type="button"
                                      name="add"
                                      className="card__link button button--primary button--full-width"
                                      onClick={() => handleShowQuickModal(value.product_slug)}
                                    >
                                      <div className="quick-add__label">
                                        Quick view
                                      </div>
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
                                      <div className="loading-overlay__spinner hidden">
                                        <svg
                                          aria-hidden="true"
                                          focusable="false"
                                          role="presentation"
                                          className="spinner"
                                          viewBox="0 0 66 66"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            className="path"
                                            fill="none"
                                            strokeWidth="6"
                                            cx="33"
                                            cy="33"
                                            r="30"
                                          ></circle>
                                        </svg>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="card-information">
                                <div className="card-information__wrapper">
                                  <div className="caption-with-letter-spacing subtitle">
                                    {value.product_category_name}
                                  </div>
                                  <h3 className="card__title h5">
                                    <a
                                      className="full-unstyled-link"
                                      href={"/products/" + value.product_slug}
                                      title="BCAA+EAA - watermelon"
                                    >
                                      {value.product_name}
                                    </a>
                                  </h3>
                                  <div className="price  price--on-sale ">
                                    <dl>
                                      <div className="price__sale">
                                        <dt>
                                          <span className="visually-hidden visually-hidden--inline">
                                            Sale price
                                          </span>
                                        </dt>
                                        <dd>
                                          <span className="price-item price-item--sale">
                                            ₹{Number(value.product_selling_price).toFixed(2)}
                                          </span>
                                        </dd>
                                        <dt className="price__compare">
                                          <span className="visually-hidden visually-hidden--inline">
                                            Regular price
                                          </span>
                                        </dt>
                                        <dd className="price__compare">
                                          <span className="price-item price-item--regular">
                                            MRP. ₹{Number(value.product_price).toFixed(2)}
                                          </span>
                                        </dd>
                                        <dd className="card__badge"></dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={"/products/" + value.product_slug}
                                className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                aria-label="Product link"
                              ></a>
                            </div>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <ul className="popular-products__wrapper list-unstyled">
                    {
                      [...Array(3)].map((_, index) => {
                        return (
                          <React.Fragment key={index}>
                            <li className="collection-product-card collection-popular-card quickview--hover show">
                              <div className="card-wrapper  js-color-swatches-wrapper">
                                <div className="card card--product" tabIndex={-1}>
                                  <div className="card__inner full-unstyled-link">
                                    <div
                                      className="media media--transparent media--portrait media--hover-effect"
                                      style={{ paddingBottom: "120%" }}
                                    >
                                      <Skeleton width={500} height={600} />
                                    </div>
                                    <div className="card-information">
                                      <div className="card-information__wrapper">
                                        <div className="caption-with-letter-spacing subtitle">
                                          <Skeleton width={250} />
                                        </div>
                                        <h3 className="card__title h5">
                                          <a
                                            className="full-unstyled-link"
                                            href={"/products/"}
                                            title="BCAA+EAA - watermelon"
                                          >
                                            <Skeleton width={250} />
                                          </a>
                                        </h3>
                                        <div className="price  price--on-sale ">
                                          <dl>
                                            <div className="price__sale">
                                              <dd>
                                                <span className="price-item price-item--sale">
                                                  <Skeleton width={250} />
                                                </span>
                                              </dd>
                                              <dd className="card__badge"></dd>
                                            </div>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </React.Fragment>
                        )
                      })
                    }
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      </MobileView>
      {
        showModal ?
          <QuickviewModal showModal={showModal} handleClose={handleClose} slugData={slugData} />
          : null}
    </>
  );
}

export default Popularproducts;
