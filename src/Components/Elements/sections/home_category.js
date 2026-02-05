import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../services/apiServices";
import constants from "../../services/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuickviewModal from "../Modals/quickview_modal";
import DataContext from "../context";
function HomeCategory() {
  const didMountRef = useRef(true);
  const contextValues = useContext(DataContext);
  const [categoryWiseData, setCategoryWiseData] = useState([]);
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
      getCategoryWiseData();
    }
    didMountRef.current = false;
  }, [contextValues.currentLocation]);

  const getCategoryWiseData = () => {
    setLoading(true);
    const payload = contextValues.currentLocation;

    ApiService.postData("category-wise-products", payload).then((res) => {
      if (res.status == "success") {
        setCategoryWiseData(res.categoryData);
        setLoading(false);
      }
    });
  };
  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <BrowserView>
        {
          loading == true ? <>
            <section className="popular-products-section spaced-section">
              <div className="popular-products">
                <div className="section-header__line">
                  <div className="container">
                    <ul className="popular-products__wrapper list-unstyled">
                      {
                        [...Array(3)].map((_, index) => {
                          return (
                            <li className="collection-product-card collection-popular-card quickview--hover show " key={index}>
                              <div className="card-wrapper  js-color-swatches-wrapper">
                                <div className="card card--product" tabIndex={-1}>
                                  <div className="card__inner full-unstyled-link">
                                    <div
                                      className="media media--transparent media--portrait media--hover-effect"
                                      style={{ paddingBottom: "120%" }}
                                    >
                                      <Skeleton width={700} height={700} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-information">
                                <div className="card-information__wrapper">
                                  <div className="caption-with-letter-spacing subtitle">
                                    <Skeleton width={250} />
                                  </div>
                                  <h3 className="card__title h5">
                                    <a
                                      className="full-unstyled-link"
                                      href={
                                        "/products/"}
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
                                        <dt className="price__compare">
                                          <span className="visually-hidden visually-hidden--inline">
                                            <Skeleton width={250} />
                                          </span>
                                        </dt>
                                        <dd className="card__badge"></dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
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
          </> :
            categoryWiseData.length > 0 && (
              <>
                {categoryWiseData.map((value, index) => (
                  <section
                    className="popular-products-section spaced-section"
                    key={index}
                  >
                    <div className="popular-products">
                      <div className="section-header__line">
                        <div className="container">
                          <div className="section-header__item">
                            {/* <div className="subtitle">best sellers</div> */}
                            <div className="section-header__title__block">
                              <h2 className="section-header__title title--section h2">
                                {value.cat_name}
                              </h2>
                              <a
                                href={"/collections/category/" + value.cat_slug}
                                className="button button--simple"
                              >
                                <span className="button-simpl__label">
                                  View All
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="container">
                        <ul className="popular-products__wrapper list-unstyled">
                          {value.products.map((subvalue, indexProduct) => {
                            return (
                              <li
                                className="collection-product-card collection-popular-card quickview--hover show "
                                key={indexProduct}
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
                                            subvalue.product_image != null
                                              ? subvalue.product_image
                                              : constants.DEFAULT_IMAGE
                                          }
                                          className="motion-reduce media--first"
                                        ></img>
                                        {subvalue.gallery.length > 0 ? (
                                          <img
                                            style={{ objectFit: "cover" }}
                                            src={
                                              subvalue.gallery[0].gallery_image
                                                ? subvalue.gallery[0].gallery_image
                                                : constants.DEFAULT_IMAGE
                                            }
                                            alt={subvalue.product_name}
                                            className="motion-reduce media--second"
                                          />
                                        ) : null}
                                      </div>
                                      <div className="quick-add no-js-hidden">
                                        <button
                                          type="button"
                                          name="add"
                                          className="card__link button button--primary button--full-width"
                                          onClick={() => handleShowQuickModal(subvalue.product_slug)}
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
                                        {subvalue.product_category_name}
                                      </div>
                                      <h3 className="card__title h5">
                                        <a
                                          className="full-unstyled-link"
                                          href={
                                            "/products/" + subvalue.product_slug
                                          }
                                        >
                                          {subvalue.product_name}
                                        </a>
                                      </h3>
                                      <div className="price price--on-sale">
                                        <dl>
                                          <div className="price__sale">
                                            {(() => {
                                              const mrp = Number(subvalue.product_price);
                                              const selling = Number(subvalue.product_selling_price);

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
                                      {Number(subvalue.product_rating) > 0 && Number(subvalue.product_review) > 0 && (
                                        <span>
                                          {"★".repeat(Math.floor(Number(subvalue.product_rating)))}
                                          {"☆".repeat(5 - Math.floor(Number(subvalue.product_rating)))}
                                          {" " + Number(subvalue.product_review) + " reviews"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <a
                                    href={"/products/" + subvalue.product_slug}
                                    className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                    aria-label="Product link"
                                  ></a>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </section>
                ))}
              </>
            )
        }

      </BrowserView>
      <MobileView>
        {
          loading == true ? <>
            <section className="popular-products-section spaced-section">
              <div className="popular-products">
                <div className="section-header__line">
                  <div className="container">
                    <ul className="popular-products__wrapper list-unstyled">
                      {
                        [...Array(3)].map((_, index) => {
                          return (

                            <li className="collection-product-card collection-popular-card quickview--hover show " key={index}>
                              <div className="card-wrapper  js-color-swatches-wrapper">
                                <div className="card card--product" tabIndex={-1}>
                                  <div className="card__inner full-unstyled-link">
                                    <div
                                      className="media media--transparent media--portrait media--hover-effect"
                                      style={{ paddingBottom: "120%" }}
                                    >
                                      <Skeleton width={500} height={580} />
                                    </div>
                                    <Skeleton width={150} />
                                    <Skeleton width={150} />
                                    <Skeleton width={150} />
                                  </div>
                                </div>
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
          </> : categoryWiseData.length > 0 && (
            <>
              {categoryWiseData.map((value, index) => (
                <section
                  className="popular-products-section spaced-section"
                  key={index}
                >
                  <div className="popular-products">
                    <div className="section-header__line">
                      <div className="container">
                        <div className="section-header__item">
                          {/* <div className="subtitle">best sellers</div> */}
                          <div className="section-header__title__block">
                            <h2 className="section-header__title title--section h2">
                              {value.cat_name}
                            </h2>
                            <a
                              href={"/collections/category/" + value.cat_slug}
                              className="button button--simple"
                            >
                              <span className="button-simpl__label">
                                View All
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <ul className="popular-products__wrapper list-unstyled">
                        {value.products.map((subvalue, indexProduct) => {
                          return (
                            <li
                              className="collection-product-card collection-popular-card quickview--hover show "
                              key={indexProduct}
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
                                          subvalue.product_image != null
                                            ? subvalue.product_image
                                            : constants.DEFAULT_IMAGE
                                        }
                                        className="motion-reduce media--first"
                                      ></img>
                                      {subvalue.gallery.length > 0 ? (
                                        <img
                                          style={{ objectFit: "cover" }}
                                          src={
                                            subvalue.gallery[0].gallery_image
                                              ? subvalue.gallery[0].gallery_image
                                              : constants.DEFAULT_IMAGE
                                          }
                                          alt={subvalue.product_name}
                                          className="motion-reduce media--second"
                                        />
                                      ) : null}
                                    </div>
                                    <div className="quick-add no-js-hidden">
                                      <button
                                        type="button"
                                        name="add"
                                        className="card__link button button--primary button--full-width"
                                        onClick={() => handleShowQuickModal(subvalue.product_slug)}
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
                                      {subvalue.product_category_name}
                                    </div>
                                    <h3 className="card__title h5">
                                      <a
                                        className="full-unstyled-link"
                                        href={
                                          "/products/" + subvalue.product_slug
                                        }
                                      >
                                        {subvalue.product_name}
                                      </a>
                                    </h3>
                                    <div className="price price--on-sale">
                                      <dl>
                                        <div className="price__sale">
                                          {(() => {
                                            const mrp = Number(subvalue.product_price);
                                            const selling = Number(subvalue.product_selling_price);

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
                                    {Number(subvalue.product_rating) > 0 && Number(subvalue.product_review) > 0 && (
                                        <span>
                                          {"★".repeat(Math.floor(Number(subvalue.product_rating)))}
                                          {"☆".repeat(5 - Math.floor(Number(subvalue.product_rating)))}
                                          {" " + Number(subvalue.product_review) + " reviews"}
                                        </span>
                                      )}
                                  </div>
                                </div>
                                <a
                                  href={"/products/" + subvalue.product_slug}
                                  className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                  aria-label="Product link"
                                ></a>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
              ))}
            </>
          )

        }

      </MobileView>
      {showModal ?
        <QuickviewModal
          showModal={showModal}
          handleClose={handleClose}
          slugData={slugData}
        />
        : null}
    </>
  );
}

export default HomeCategory;
