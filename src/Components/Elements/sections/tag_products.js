import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { ApiService } from "../../services/apiServices";
import constants from "../../services/constants";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import QuickviewModal from "../Modals/quickview_modal";

function TagProducts() {
  const didMountRef = useRef(true);
  const [tagProductsData, setTagProductsData] = useState([]);
  const [loading, setLoading] = useState()
  const [showModal, setShowModal] = useState(false)
  const [slugData, setSlugData] = useState(false)

  const handleShowQuickModal = (slug) => {
    setShowModal(true)
    setSlugData(slug)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const getTagProduct = useCallback(() => {
    setLoading(true)
    ApiService.fetchData("products-tags").then((res) => {
      if (res.status == "success") {
        setTagProductsData(res.tagdetails);
        setLoading(false)
      }
    });
  });

  useEffect(() => {
    if (didMountRef.current) {
      getTagProduct();
    }
    didMountRef.current = false;
  }, [getTagProduct]); 

  let formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <BrowserView>
        <>
          {tagProductsData && tagProductsData.length > 0 ? (
            <>
              {tagProductsData.map((value, index) => {
                return value.products.length > 0 ? (
                  <section className="featured-products-section spaced-section sectionlarge" key={index}>
                    <div className="featured-products">
                      <div className="container">
                        <div className="featured-products__wrapper">
                          <div className="featured-products__text">
                            <h2 className="featured-products__title">
                              {value.tag_name}
                            </h2>
                            <div className="featured-products__desc richtext__content">
                              <p>Everyone has goals, let us help you with yours. </p>
                            </div>
                            <a href={"/collections/tag/" + value.tag_slug} className="button button--primary button--primary-size ">
                              View all
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
                            </a>
                          </div>
                          <ul className="featured-products__list">
                            {value.products.map((subvalue, indexProduct) => {
                              return (
                                <li className="featured-products__products quickview--hover show collection-product-card" key={indexProduct}>
                                  <div className="card-wrapper  js-color-swatches-wrapper">
                                    <div className="card card--product" tabIndex={-1}>
                                      <div className="card__inner full-unstyled-link">
                                        <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "120%" }}>
                                          <img style={{ objectFit: "cover" }} src={subvalue.product_image != null ? subvalue.product_image : constants.DEFAULT_IMAGE} className="motion-reduce media--first"></img>
                                          {subvalue.gallery.length > 0 ? (
                                            <img style={{ objectFit: "cover" }} src={subvalue.gallery[0].gallery_image ? subvalue.gallery[0].gallery_image : constants.DEFAULT_IMAGE} alt={subvalue.product_name} className="motion-reduce media--second" />
                                          ) : null}
                                        </div>
                                        <div className="quick-add no-js-hidden">
                                          <button type="button" name="add" className="card__link button button--primary button--full-width" onClick={() => handleShowQuickModal(subvalue.product_slug)}>
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
                                        <div className="caption-with-letter-spacing subtitle">
                                          {subvalue.product_category_name}
                                        </div>
                                        <h3 className="card__title h5">
                                          <a className="full-unstyled-link" href={"/products/" + subvalue.product_slug} title="BCAA+EAA - watermelon">
                                            {subvalue.product_name}
                                          </a>
                                        </h3>
                                        <div className="price  price--on-sale ">
                                          <dl>
                                            <div className="price__sale">
                                              <dd>
                                                <span className="price-item price-item--sale">
                                                  ₹{formatter.format(subvalue.product_selling_price)}
                                                </span>
                                              </dd>
                                              <dd className="price__compare">
                                                <span className="price-item price-item--regular">
                                                  MRP. ₹{formatter.format(subvalue.product_price)}
                                                </span>
                                              </dd>
                                              <dd className="card__badge"></dd>
                                            </div>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                    <a href={"/products/" + subvalue.product_slug} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null
              })}
            </>
          ) : <>
            {
              loading == true ? <>
                {[...Array(1)].map((_, index) => {
                  return (
                    <section className="featured-products-section spaced-section sectionlarge" key={index}>
                      <div className="featured-products">
                        <div className="container">
                          <div className="featured-products__wrapper">
                            <div className="featured-products__text">
                              <h2 className="featured-products__title">
                                <Skeleton variant="text" width={150} />
                              </h2>
                              <div className="featured-products__desc richtext__content">
                                <Skeleton variant="text" width={150} />
                              </div>
                            </div>
                            <ul className="featured-products__list">
                              {[...Array(3)].map((_, indexProduct) => {
                                return (
                                  <li className="featured-products__products quickview--hover show collection-product-card" key={indexProduct}>
                                    <div className="card-wrapper  js-color-swatches-wrapper">
                                      <div className="card card--product" tabIndex={-1}>
                                        <div className="card__inner full-unstyled-link">
                                          <div
                                            className="media media--transparent media--portrait media--hover-effect"
                                            style={{ paddingBottom: "120%" }}
                                          >
                                            <Skeleton variant="text" width={500} height={500} />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card-information">
                                        <div className="card-information__wrapper">
                                          <div className="caption-with-letter-spacing subtitle">
                                            <Skeleton variant="text" width={150} />
                                          </div>
                                          <h3 className="card__title h5">
                                            <a
                                              className="full-unstyled-link"
                                              href={"/products/"}
                                              title="BCAA+EAA - watermelon"
                                            >
                                              <Skeleton variant="text" width={150} />
                                            </a>
                                          </h3>
                                          <div className="price  price--on-sale ">
                                            <dl>
                                              <div className="price__sale">
                                                <dt>
                                                  <span className="visually-hidden visually-hidden--inline">
                                                    <Skeleton variant="text" width={150} />
                                                  </span>
                                                </dt>
                                                <dd>
                                                  <span className="price-item price-item--sale">
                                                    <Skeleton variant="text" width={150} />
                                                  </span>
                                                </dd>
                                                <dt className="price__compare">
                                                  <span className="visually-hidden visually-hidden--inline">
                                                    <Skeleton variant="text" width={150} />
                                                  </span>
                                                </dt>
                                                <dd className="price__compare">
                                                  <span className="price-item price-item--regular">
                                                    <Skeleton variant="text" width={150} />
                                                  </span>
                                                </dd>
                                                <dd className="card__badge"></dd>
                                              </div>
                                              <dl className="unit-price caption hidden">
                                                <dt className="visually-hidden">
                                                  <Skeleton variant="text" width={150} />
                                                </dt>
                                                <dd>
                                                  <span></span>
                                                  <span aria-hidden="true">/</span>
                                                  <span className="visually-hidden">
                                                    &nbsp;per&nbsp;
                                                  </span>
                                                  <span></span>
                                                </dd>
                                              </dl>
                                            </dl>
                                          </div>
                                        </div>
                                      </div>
                                      <a
                                        href={"/products/"}
                                        className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                        aria-label="Product link"
                                      ></a>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                  )
                })
                }
              </> : null
            }
          </>}
        </>
      </BrowserView>

      <MobileView>
        {
          loading == true ? <>
            {[...Array(1)].map((_, index) => {
              return (
                <section className="featured-products-section spaced-section sectionlarge" key={index}>
                  <div className="featured-products">
                    <div className="container">
                      <div className="featured-products__wrapper">
                        <div className="featured-products__text">
                          <h2 className="featured-products__title">
                            <Skeleton variant="text" width={150} />
                          </h2>
                          <div className="featured-products__desc richtext__content">
                            <Skeleton variant="text" width={150} />
                          </div>
                        </div>
                        <ul className="featured-products__list">
                          {[...Array(3)].map((_, indexProduct) => {
                            return (
                              <li className="featured-products__products quickview--hover show collection-product-card" key={indexProduct}>
                                <div className="card-wrapper  js-color-swatches-wrapper">
                                  <div className="card card--product" tabIndex={-1}>
                                    <div className="card__inner full-unstyled-link">
                                      <div
                                        className="media media--transparent media--portrait media--hover-effect"
                                        style={{ paddingBottom: "120%" }}
                                      >
                                        <Skeleton variant="text" width={500} height={500} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="card-information">
                                    <div className="card-information__wrapper">
                                      <div className="caption-with-letter-spacing subtitle">
                                        <Skeleton variant="text" width={150} />
                                      </div>
                                      <h3 className="card__title h5">
                                        <a
                                          className="full-unstyled-link"
                                          href={"/products/"}
                                          title="BCAA+EAA - watermelon"
                                        >
                                          <Skeleton variant="text" width={150} />
                                        </a>
                                      </h3>
                                      <div className="price  price--on-sale ">
                                        <dl>
                                          <div className="price__sale">
                                            <dt>
                                              <span className="visually-hidden visually-hidden--inline">
                                                <Skeleton variant="text" width={150} />
                                              </span>
                                            </dt>
                                            <dd>
                                              <span className="price-item price-item--sale">
                                                <Skeleton variant="text" width={150} />
                                              </span>
                                            </dd>
                                            <dt className="price__compare">
                                              <span className="visually-hidden visually-hidden--inline">
                                                <Skeleton variant="text" width={150} />
                                              </span>
                                            </dt>

                                            <dd className="card__badge"></dd>
                                          </div>

                                        </dl>
                                      </div>
                                    </div>
                                  </div>
                                  <a
                                    href={"/products/"}
                                    className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                    aria-label="Product link"
                                  ></a>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </> : tagProductsData && tagProductsData.length > 0 && (
            <>
              {tagProductsData.map((value, index) => {
                return value.products.length > 0 ? (
                  <section className="featured-products-section spaced-section sectionlarge" key={index}>
                    <div className="featured-products">
                      <div className="container">
                        <div className="featured-products__wrapper">
                          <div className="featured-products__text">
                            <h2 className="featured-products__title">
                              {value.tag_name}
                            </h2>
                            <div className="featured-products__desc richtext__content">
                              <p>Everyone has goals, let us help you with yours. </p>
                            </div>
                            <a href={"/collections/tag/" + value.tag_slug}
                              className="button button--primary button--primary-size "
                            >
                              View all
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
                          </div>
                          <ul className="featured-products__list">
                            {value.products.map((subvalue, indexProduct) => {
                              return (
                                <li className="featured-products__products quickview--hover show collection-product-card" key={indexProduct}>
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
                                            href={"/products/" + subvalue.product_slug}
                                            title="BCAA+EAA - watermelon"
                                          >
                                            {subvalue.product_name}
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
                                                  ₹{formatter.format(subvalue.product_selling_price)}
                                                </span>
                                              </dd>
                                              <dt className="price__compare">
                                                <span className="visually-hidden visually-hidden--inline">
                                                  Regular price
                                                </span>
                                              </dt>
                                              <dd className="price__compare">
                                                <span className="price-item price-item--regular">
                                                  MRP. ₹{formatter.format(subvalue.product_price)}
                                                </span>
                                              </dd>
                                              <dd className="card__badge"></dd>
                                            </div>
                                            <dl className="unit-price caption hidden">
                                              <dt className="visually-hidden">
                                                Unit price
                                              </dt>
                                              <dd>
                                                <span></span>
                                                <span aria-hidden="true">/</span>
                                                <span className="visually-hidden">
                                                  &nbsp;per&nbsp;
                                                </span>
                                                <span></span>
                                              </dd>
                                            </dl>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                    <a
                                      href={"/products/" + subvalue.product_slug}
                                      className="link link--overlay card-wrapper__link--overlay js-color-swatches-link"
                                      aria-label="Product link"
                                    ></a>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null
              })}
            </>
          )
        }


      </MobileView>
      {
        showModal ?
          <QuickviewModal showModal={showModal} handleClose={handleClose} slugData={slugData} />
          : null}

    </>
  );
}

export default TagProducts;
