import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import { BrowserView, MobileView } from "react-device-detect";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import QuickviewModal from "../../Components/Elements/Modals/quickview_modal";
import FilterModal from "../../Components/Elements/Modals/filter_modal";
import constants from "../../Components/services/constants";
import { Helmet } from "react-helmet";
import DataContext from "../../Components/Elements/context";

function Collections() {
	const contextValues = useContext(DataContext)
	const { type, slug } = useParams();
	const navigate = useNavigate()
	const didMountRef = useRef(true);
	const [productData, setProductData] = useState([]);
	const [Productcat, setProductcat] = useState([]);
	const [productcount, setproductcount] = useState("")
	const [show, setShow] = useState(false);
	const [sortfilter, setsortfilter] = useState("");
	const [categoryId, setCategoryId] = useState("")
	const [selectedItems, setSelectedItems] = useState([]);
	const [maxpricecount, setmaxpricecount] = useState()
	const [multipleselectitem, setmultipleselectitem] = useState([])
	const [productCategory, setProductCategory] = useState("");
	const [categoryImagePath, setCategoryImagePath] = useState("");
	const [Prizerange, setPrizerange] = useState({ minvalue: "", maxvalue: "" })
	const [loading1, setLoading1] = useState()
	const [loading2, setLoading2] = useState()
	const [showModal, setShowModal] = useState(false)
	const [slugData, setSlugData] = useState()
	const [filterModalActive, setfilterModalActive] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const MAX_LENGTH = 300;
	const description = productCategory?.cat_desc ?? '';

	const truncatedDescription = isExpanded ? description : `${description.slice(0, MAX_LENGTH)}...`;

	const handleShowQuickModal = (slug) => {
		setShowModal(true)
		setSlugData(slug)
	}
	const handleClose = () => {
		setShowModal(false)
	}
	const handleCheckboxChange = (e, catslug, type) => {
		e.preventDefault()
		const selectedIndex = selectedItems.indexOf(catslug);

		if (selectedIndex === -1) {
			// Item doesn't exist, add it
			setSelectedItems([catslug]);
		} else {
			// Item exists, remove it
			setSelectedItems([]);
		}
	};
	useEffect(() => {
		if (didMountRef.current) {
			setLoading1(true)
			setLoading2(true)
			ApiService.fetchData("products-category").then((res) => {
				if (res?.status == "success") {
					setProductcat(res?.procat)
					setLoading2(false)
				}
			})
		}
		didMountRef.current = false;

		if (multipleselectitem?.length > 0 || Prizerange?.maxvalue !== "" || Prizerange?.minvalue !== "") {
			setProductData([])
			setproductcount("")
			setProductCategory("")
			filterProductlist()
		} else {
			if (contextValues.curretnLocationLoader) {
				getProductList()
			}
		}
	}, [sortfilter, selectedItems, Prizerange, multipleselectitem, contextValues.curretnLocationLoader])


	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	const [typeName, setTypeName] = useState(capitalizeFirstLetter(type))


	const filterModalToggle = () => {
		setfilterModalActive(!filterModalActive);
	};


	const getProductList = () => {
		const dataString = {
			slug: selectedItems.length > 0 ? selectedItems[0] : slug,
			type: selectedItems.length > 0 ? "category" : type,
			sort_filter: sortfilter,
			location: contextValues.currentLocation
		}

		ApiService.postData('product-list', dataString).then((res) => {

			if (res.status == "success") {
				setmaxpricecount(res?.maxProductPrice)
				setProductData(res?.products)
				setproductcount(res?.totalProductCount)
				setProductCategory(res?.productCategory)
				setCategoryImagePath(res?.category_img_path)
				setLoading1(false)

			}
		})
	}
	const filterProductlist = () => {
		const dataString = {
			priceRange: { 0: Prizerange?.minvalue, 1: Prizerange?.maxvalue },
			filterarray: multipleselectitem?.length > 0 ? multipleselectitem : [categoryId],
			location: contextValues.currentLocation
		}

		ApiService.postData('getfilterproductsdata ', dataString).then((res) => {
			if (res.status == "success") {
				setProductData(res?.products)
				setproductcount(res?.totalProductCount)
				setProductCategory(res?.productCategory)
				setCategoryImagePath(res?.category_img_path)
				setLoading1(false)

			}
		})
	}

	let formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	const receiveDataFromChild = (catedata, minvalue, maxvalue, categoryid) => {
		setmultipleselectitem(catedata)
		setCategoryId(categoryid)
		// if(catedata?.length>0){

		// }

		setPrizerange({ minvalue: minvalue, maxvalue: maxvalue })

	};


	return (
		<>
			<Helmet>
				<title>{productCategory?.cat_meta_title != null ? productCategory.cat_meta_title : "ByBv"}</title>
				<meta name="description" itemprop="description" content={productCategory?.cat_meta_desc != null ? productCategory?.cat_meta_desc : "ByBv"} />
				{productCategory?.cat_meta_keyword != null ? <meta name="keywords" content={productCategory?.cat_meta_keyword} /> : "ByBv"}
				<link rel="canonical" href={window.location.href} />
				<meta property="og:title" content={productCategory?.cat_meta_title != null ? productCategory?.cat_meta_title : "ByBv"} />
				<meta name="twitter:url" content={window.location.href} />

				<meta
					property="og:image"
					content={constants.FRONT_URL + 'img/logo.png'}
				/>

				<meta property="og:url" content={window.location.href} />
				{productCategory?.cat_meta_desc != null ? (
					<meta property="og:description" content={productCategory?.cat_meta_desc} />
				) : (
					<meta property="og:description" content="ByBv" />
				)}

				<meta name="twitter:title" content={productCategory?.cat_meta_title != null ? productCategory.cat_meta_title : "ByBv"} />
				{productCategory?.cat_meta_desc != null ? (
					<meta property="twitter:description" content={productCategory?.cat_meta_desc} />
				) : (
					<meta property="twitter:description" content="ByBv" />
				)}

				<meta
					property="twitter:image"
					content={constants.FRONT_URL + 'img/logo.png'}
				/>
			</Helmet>
			<Header />
			<BrowserView>
				{Productcat.length > 0 ?
					<>
						<div className="collection-banner-section spaced-section spaced-section--full-width section-template--overlay">
							<div className="container">
								<nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
									<a href="/" title="Home" className="link-hover-line">Home</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
									</div>
									<a href="/collections/all" title="Collections" className="link-hover-line">Collections</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg></div>
									{productCategory && productCategory.cat_name != null ? <span>{productCategory.cat_name}</span> : typeName}
								</nav>
							</div>
							<div className="collection-banner">
								<div className="collection-banner__body color-background-4 overlay-enable show_img">
									<div className="container">
										<div className="collection-banner__wrapper">
											<div className="collection-banner__img">

												{productCategory && productCategory.cat_banner_image != null ?
													<img src={categoryImagePath + productCategory.cat_banner_image} sizes="100vw" alt="Category Banner" />
													: null}
											</div>
											<div className="collection-banner__text">
												{productCategory && productCategory.cat_name != null ? <h1 className="collection-banner__title">{productCategory.cat_name}</h1>
													: null}

												<div className={`banner_description ${isExpanded ? 'banner_description_scroll' : ''}`} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
												{description.length > MAX_LENGTH && (
													<button onClick={() => setIsExpanded(!isExpanded)}
														className="button button--primary"
													>
														{isExpanded ? 'Read Less' : 'Read More'}
													</button>
												)}
												{/* {productCategory && productCategory.cat_desc != null ? <p>{productCategory.cat_desc}</p>: null} */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</> :
					<>

						{/* skeleton start */}

						<div className="collection-banner-section spaced-section--full-width section-template--overlay">
							<div className="container">
								<nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
									<a href="/" title="Home" className="link-hover-line">
										<Skeleton width={150} />

									</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
									</div>
									<a href="/collections/all" title="Collections" className="link-hover-line">
										<Skeleton width={150} />

									</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg></div>
									<Skeleton width={250} />

								</nav>
							</div>
							<div className="collection-banner">
								<div className="collection-banner__body color-background-4 overlay-enable show_img">
									<div className="container">
										<div className="collection-banner__wrapper">
											<div className="collection-banner__img">

												<Skeleton width='100%' height={600} />
											</div>

										</div>
									</div>
								</div>
							</div>
						</div>
						{/* skeleton start */}
					</>
				}

				{
					productData.length > 0 ? <>
						<section className="spaced-section collection-grid-section">
							<div className="facets__main">
								<div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
									<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
									<div className="facets-menu">
										<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
											<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
												<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
											</svg>

										</a>
									</div>
								</div>
								<div>
									<facet-filters-form>
										{Productcat?.length > 0 ? <>
											<div className="container type-filter__container">
												<ul className="type-filter__list">
													{Productcat?.map((items, index) => {
														return (<>
															<li
																key={items.cat_id}
																onClick={(e) => handleCheckboxChange(e, items.cat_slug)}
															// style={{
															// 	backgroundColor: selectedItems.includes(items.cat_id) ? 'yellow' : 'transparent',
															// }}

															// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}


															>
																<label className="type-filter__label" >
																	<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																	<span className="type-filter__title">{items?.cat_name}</span>
																</label>
															</li>
														</>)
													})}
												</ul>
											</div>
										</> : ""}
										<div className="facets">
											<div className="container">
												<div className="facets__wrapper">
													<a className="button open_filters no_submit" onClick={filterModalToggle}>
														<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
														</svg>
														Filter
													</a>
													<div className="facets__product-count">Showing {productData?.length} of {productcount !== "" ? productcount : 0} products</div>
													<div className="facets__sort-by">
														<div className="facets__select-label">Sort by:</div>
														<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
															<option value="">Select </option>
															<option value="1">Featured</option>
															<option value="2">Best Selling</option>
															<option value="3">Price-High to Low</option>
															<option value="4">Price-Low to High</option>
															<option value="5">Date-Old to New</option>
															<option value="6">Date-New to Old</option>

														</select>
														<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
														</svg>
													</div>
												</div>
											</div>
										</div>
									</facet-filters-form>
								</div>
							</div>
							<div className="collection__main-wrapper">
								<div className="collection collection-product container">
									<div className="collection-product-list load-more-grid">
										{productData.map((value, index) => (
											<div className="collection-product-card quickview--hover" key={index}>
												<div className="card-wrapper js-color-swatches-wrapper">
													<div className="card card--product" tabIndex={-1}>
														<div className="card__inner full-unstyled-link">
															<div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: '120%' }}>
																{/* {value.product_label_name && value.product_label_name !== "" && value.product_label_color ? (
															<div className="product-label-group">
																{value.product_label_name
																.split(", ")
																.map((tagvalue, indextag) => {
																	var color = value.product_label_color.split(",") || [];
																	return (
																	<label
																		className="product-label label-new"
																		style={{ background: color[indextag] || 'transparent' }}
																		key={indextag}
																	>
																		{tagvalue}
																	</label>
																	);
																})}
															</div>
															) : null} */}
																<img className="motion-reduce media--first" src={value.product_image ? value.product_image : constants.DEFAULT_IMAGE} style={{ objectFit: 'cover' }} alt={value.product_name}></img>

																{value.gallery && value.gallery.length > 0 && (
																	<img className="motion-reduce media--second" src={value.gallery[0].gallery_image} style={{ objectFit: 'cover' }}></img>
																)}
															</div>



															<div className="quick-add no-js-hidden">
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
													<div className="card-information" key={index}>
														<div className="card-information__wrapper">
															<div className="caption-with-letter-spacing subtitle">{value?.product_category_name}</div>
															<h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/" + value.product_slug} title="">{value?.product_name}</a></h3>
															<div className="price price--on-sale">
																<dl>
																	<div className="price__sale">
																		{(() => {
																			const mrp = Number(value.product_price);
																			const selling = Number(value.product_selling_price);
																			const discount = mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0;
																			return (
																				<>
																					<dd><span className="price-item price-item--sale">₹{selling.toFixed(2)}</span></dd>
																					<dd className="price__compare"><span className="price-item price-item--regular">MRP. ₹{mrp.toFixed(2)}</span></dd>
																					{discount > 0 && (<span className="price_discount">{discount}% Off</span>)}
																				</>
																			);
																		})()}
																	</div>
																</dl>
															</div>
														</div>
													</div>
													<a href={"/products/" + value?.product_slug} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
												</div>
											</div>
										))}

									</div>
								</div>
							</div>
						</section>
					</> : <>
						{/* skeleton start */}
						{
							loading1 == true ? <>
								<section className="collection-grid-section">
									<div className="facets__main">
										{/* <div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
									<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
									<div className="facets-menu">
										<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
											<svg aria-hidden="true" focusable="false" class="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
												<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
											</svg>

										</a>
									</div>
								</div> */}
										<div>
											<facet-filters-form>

												<div className="container type-filter__container">
													<ul className="type-filter__list">
														{[...Array(3)].map((items, index) => {
															return (<>
																<li
																	key={index}
																	onClick={(e) => handleCheckboxChange(e, index)}


																// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}


																>
																	<label className="type-filter__label" >
																		<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																		<span className="type-filter__title h4"><Skeleton width={150} /></span>
																	</label>
																</li>
															</>)
														})}
													</ul>
												</div>

												<div className="facets">
													<div className="container">
														<div className="facets__wrapper">
															<a className="button open_filters no_submit" onClick={filterModalToggle}>
																<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																</svg>
																<Skeleton width={150} />
															</a>
															<div className="facets__product-count"><Skeleton width={150} /></div>
															<div className="facets__sort-by">
																<div className="facets__select-label"><Skeleton width={150} /></div>
																<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
																	<option value=""><Skeleton width={150} /> </option>
																	<option value="1"><Skeleton width={150} /></option>
																	<option value="2"><Skeleton width={150} /></option>
																	<option value="3"><Skeleton width={150} /></option>
																	<option value="4"><Skeleton width={150} /></option>
																	<option value="5"><Skeleton width={150} /></option>
																	<option value="6"><Skeleton width={150} /></option>

																</select>
																<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
																</svg>
															</div>
														</div>
													</div>
												</div>
											</facet-filters-form>
										</div>
									</div>
									<div className="collection__main-wrapper">
										<div className="collection collection-product container">
											<div className="collection-product-list load-more-grid">
												{[...Array(9)].map((_, index) => (
													<div className="collection-product-card quickview--hover" key={index}>
														<div className="card-wrapper js-color-swatches-wrapper">
															<div className="card card--product" tabIndex={-1}>
																<div className="card__inner full-unstyled-link">
																	<div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: '50%' }}>
																		<Skeleton width='100%' height={600} />


																	</div>

																</div>
															</div>
															<div className="card-information" key={index}>
																<div className="card-information__wrapper">
																	<div className="caption-with-letter-spacing subtitle"><Skeleton width={150} /></div>
																	<h3 className="card__title h5"><a className="full-unstyled-link" href="#" title=""><Skeleton width={150} /></a></h3>
																	<div className="price  price--on-sale ">
																		<dl>
																			<div className="price__sale">
																				<dt>
																					<span className="visually-hidden visually-hidden--inline"><Skeleton width={150} /></span>
																				</dt>
																				<dd>
																					<span className="price-item price-item--sale">
																						<Skeleton width={150} />
																					</span>
																				</dd>
																				<dt className="price__compare">
																					<span className="visually-hidden visually-hidden--inline"><Skeleton width={150} /></span>
																				</dt>
																				<dd className="price__compare">
																					<span className="price-item price-item--regular">
																					</span>
																				</dd>
																				<dd className="card__badge">
																				</dd>
																			</div>
																		</dl>
																	</div>
																</div>
															</div>
															<a href={"/products/"} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</section>
							</> : <>
								<section className="spaced-section collection-grid-section">
									<div className="facets__main">
										<div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
											<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
											<div className="facets-menu">
												<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
													<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
														<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
													</svg>

												</a>
											</div>
										</div>
										<div>
											<facet-filters-form>
												{Productcat?.length > 0 ? <>
													<div className="container type-filter__container">
														<ul className="type-filter__list">
															{Productcat?.map((items, index) => {
																return (<>
																	<li
																		key={items.cat_id}
																		onClick={(e) => handleCheckboxChange(e, items.cat_slug)}
																	// style={{
																	// 	backgroundColor: selectedItems.includes(items.cat_id) ? 'yellow' : 'transparent',
																	// }}

																	// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}


																	>
																		<label className="type-filter__label" >
																			<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																			<span className="type-filter__title h4">{items?.cat_name}</span>
																		</label>
																	</li>
																</>)
															})}
														</ul>
													</div>
												</> : ""}
												<div className="facets">
													<div className="container">
														<div className="facets__wrapper">
															<a className="button open_filters no_submit" onClick={filterModalToggle}>
																<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																</svg>
																Filter
															</a>
															<div className="facets__product-count">Showing {productData?.length} of {productcount !== "" ? productcount : 0} products</div>
															<div className="facets__sort-by">
																<div className="facets__select-label">Sort by:</div>
																<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
																	<option value="">Select </option>
																	<option value="1">Featured</option>
																	<option value="2">Best Selling</option>
																	<option value="3">Price-High to Low</option>
																	<option value="4">Price-Low to High</option>
																	<option value="5">Date-Old to New</option>
																	<option value="6">Date-New to Old</option>

																</select>
																<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
																</svg>
															</div>
														</div>
													</div>
												</div>
											</facet-filters-form>
										</div>
									</div>
									<div className="container mb-5">
										<div className="row">
											<div className="col">
												<h4 className="text-center">No Result Found</h4>
											</div>
										</div>
									</div>
								</section>

							</>
						}
						{/* skeleton start */}
					</>
				}

			</BrowserView>
			<MobileView>
				{
					Productcat.length > 0 ? <>
						<div className="collection-banner-section spaced-section spaced-section--full-width section-template--overlay">
							<div className="container">
								<nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
									<a href="/" title="Home" className="link-hover-line">Home</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
									</div>
									<a href="/collections/all" title="Collections" className="link-hover-line">Collections</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg></div>
									{productCategory && productCategory.cat_name != null ? <span>{productCategory.cat_name}</span> : typeName}
								</nav>
							</div>
							<div className="collection-banner">
								<div className="collection-banner__body color-background-4 overlay-enable show_img">
									<div className="container">
										<div className="collection-banner__wrapper">
											<div className="collection-banner__img">

												{productCategory && productCategory.cat_banner_image != null ?
													<img src={categoryImagePath + productCategory.cat_banner_image} sizes="100vw" alt="Category Banner" />
													: null}
											</div>
											<div className="collection-banner__text">
												{productCategory && productCategory.cat_name != null ? <h1 className="collection-banner__title">{productCategory.cat_name}</h1>
													: null}
												<div className={`banner_description ${isExpanded ? 'banner_description_scroll' : ''}`} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
												{description.length > MAX_LENGTH && (
													<button onClick={() => setIsExpanded(!isExpanded)}
														className="button button--primary"
													>
														{isExpanded ? 'Read Less' : 'Read More'}
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</> : <>

						{/* skeleton start */}

						<div className="collection-banner-section spaced-section--full-width section-template--overlay">
							<div className="container">
								<nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
									<a href="/" title="Home" className="link-hover-line">
										<Skeleton width={150} />

									</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg>
									</div>
									<a href="/collections/all" title="Collections" className="link-hover-line">
										<Skeleton width={150} />

									</a>
									<div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
										<path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
									</svg></div>
									<Skeleton width={250} />

								</nav>
							</div>
							<div className="collection-banner">
								<div className="collection-banner__body color-background-4 overlay-enable show_img">
									<div className="container">
										<div className="collection-banner__wrapper">
											<div className="collection-banner__img">

												<Skeleton width='100%' height={600} />
											</div>

										</div>
									</div>
								</div>
							</div>
						</div>
						{/* skeleton end */}
					</>
				}

				{
					productData.length > 0 ?
						<>
							<section className="spaced-section collection-grid-section">
								<div className="facets__main">
									<div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
										<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
										<div className="facets-menu">
											<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
												<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
													<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
												</svg>

											</a>
										</div>
									</div>
									<div>
										<facet-filters-form>
											{Productcat?.length > 0 ? <>
												<div className="container type-filter__container">
													<ul className="type-filter__list">
														{Productcat?.map((items, index) => {
															return (<>
																<li
																	key={items.cat_id}
																	onClick={(e) => handleCheckboxChange(e, items.cat_slug)}
																	style={{
																		backgroundColor: selectedItems.includes(items.cat_id) ? 'yellow' : 'transparent',
																	}}

																// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}


																>
																	<label className="type-filter__label" >
																		<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																		<span className="type-filter__title h4">{items?.cat_name}</span>
																	</label>
																</li>
															</>)
														})}
													</ul>
												</div>
											</> : ""}
											<div className="facets">
												<div className="container">
													<div className="facets__wrapper">
														<a className="button open_filters no_submit" onClick={filterModalToggle}>
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
															</svg>
															Filter
														</a>
														<div className="facets__product-count">Showing {productData?.length} of {productcount !== "" ? productcount : 0} products</div>
														<div className="facets__sort-by">
															<div className="facets__select-label">Sort by:</div>
															<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
																<option value="">Select </option>
																<option value="1">Featured</option>
																<option value="2">Best Selling</option>
																<option value="3">Price-High to Low</option>
																<option value="4">Price-Low to High</option>
																<option value="5">Date-Old to New</option>
																<option value="6">Date-New to Old</option>

															</select>
															<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
															</svg>
														</div>
													</div>
												</div>
											</div>
										</facet-filters-form>
									</div>
								</div>
								<div className="collection__main-wrapper">
									<div className="collection collection-product container">
										<div className="collection-product-list load-more-grid">
											{productData.map((value, index) => (
												<div className="collection-product-card quickview--hover" key={index}>
													<div className="card-wrapper js-color-swatches-wrapper">
														<div className="card card--product" tabIndex={-1}>
															<div className="card__inner full-unstyled-link">
																<div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: '120%' }}>
																	<img className="motion-reduce media--first" src={value.product_image ? value.product_image : constants.DEFAULT_IMAGE} style={{ objectFit: 'cover' }}></img>

																	{value.gallery && value.gallery.length > 0 && (
																		<img className="motion-reduce media--second" src={value.gallery[0].gallery_image} style={{ objectFit: 'cover' }}></img>
																	)}
																</div>
																<div className="quick-add no-js-hidden">
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
														<div className="card-information" key={index}>
															<div className="card-information__wrapper">
																<div className="caption-with-letter-spacing subtitle">{value.product_category_name}</div>
																<h3 className="card__title h5"><a className="full-unstyled-link" href={"/products/" + value.product_slug} title="">{value.product_name}</a></h3>
																<div className="price price--on-sale">
																<dl>
																	<div className="price__sale">
																		{(() => {
																			const mrp = Number(value.product_price);
																			const selling = Number(value.product_selling_price);
																			const discount = mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0;
																			return (
																				<>
																					<dd><span className="price-item price-item--sale">₹{selling.toFixed(2)}</span></dd>
																					<dd className="price__compare"><span className="price-item price-item--regular">MRP. ₹{mrp.toFixed(2)}</span></dd>
																					{discount > 0 && (<span className="price_discount">{discount}% Off</span>)}
																				</>
																			);
																		})()}
																	</div>
																</dl>
															</div>
															</div>
														</div>
														<a href={"/products/" + value.product_slug} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>
						</> :
						<>
							{/* skeleton start */}
							{
								loading1 == true ? <>
									<section className="collection-grid-section">
										<div className="facets__main">
											{/* <div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
									<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
									<div className="facets-menu">
										<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
											<svg aria-hidden="true" focusable="false" class="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
												<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
											</svg>

										</a>
									</div>
								</div> */}
											<div>
												<facet-filters-form>

													<div className="container type-filter__container">
														<ul className="type-filter__list">
															{[...Array(3)].map((items, index) => {
																return (<>
																	<li
																		key={index}
																		onClick={(e) => handleCheckboxChange(e, index)}
																	// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}
																	>
																		<label className="type-filter__label" >
																			<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																			<span className="type-filter__title h4"><Skeleton width={150} /></span>
																		</label>
																	</li>
																</>)
															})}
														</ul>
													</div>

													<div className="facets">
														<div className="container">
															<div className="facets__wrapper">
																<a className="button open_filters no_submit" onClick={filterModalToggle}>
																	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	</svg>
																	<Skeleton width={150} />
																</a>
																<div className="facets__product-count"><Skeleton width={150} /></div>
																<div className="facets__sort-by">
																	<div className="facets__select-label"><Skeleton width={150} /></div>
																	<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
																		<option value=""><Skeleton width={150} /> </option>
																		<option value="1"><Skeleton width={150} /></option>
																		<option value="2"><Skeleton width={150} /></option>
																		<option value="3"><Skeleton width={150} /></option>
																		<option value="4"><Skeleton width={150} /></option>
																		<option value="5"><Skeleton width={150} /></option>
																		<option value="6"><Skeleton width={150} /></option>
																	</select>
																	<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
																	</svg>
																</div>
															</div>
														</div>
													</div>
												</facet-filters-form>
											</div>
										</div>
										<div className="collection__main-wrapper">
											<div className="collection collection-product container">
												<div className="collection-product-list load-more-grid">
													{[...Array(9)].map((_, index) => (
														<div className="collection-product-card quickview--hover" key={index}>
															<div className="card-wrapper js-color-swatches-wrapper">
																<div className="card card--product" tabIndex={-1}>
																	<div className="card__inner full-unstyled-link">
																		<div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: '50%' }}>
																			<Skeleton width='100%' height={600} />
																		</div>
																	</div>
																</div>
																<div className="card-information" key={index}>
																	<div className="card-information__wrapper">
																		<div className="caption-with-letter-spacing subtitle"><Skeleton width={150} /></div>
																		<h3 className="card__title h5"><a className="full-unstyled-link" href="#" title=""><Skeleton width={150} /></a></h3>
																		<div className="price  price--on-sale ">
																			<dl>
																				<div className="price__sale">
																					<dt>
																						<span className="visually-hidden visually-hidden--inline"><Skeleton width={150} /></span>
																					</dt>
																					<dd>
																						<span className="price-item price-item--sale">
																							<Skeleton width={150} />
																						</span>
																					</dd>
																					<dt className="price__compare">
																						<span className="visually-hidden visually-hidden--inline"><Skeleton width={150} /></span>
																					</dt>
																					<dd className="price__compare">
																						<span className="price-item price-item--regular">
																						</span>
																					</dd>
																					<dd className="card__badge">
																					</dd>
																				</div>
																			</dl>
																		</div>
																	</div>
																</div>
																<a href={"/products/"} className="link link--overlay card-wrapper__link--overlay js-color-swatches-link" aria-label="Product link"></a>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									</section>
								</> : <>
									<section className="spaced-section collection-grid-section">
										<div className="facets__main">
											<div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
												<a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={filterModalToggle}></a>
												<div className="facets-menu">
													<a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={filterModalToggle}>
														<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
															<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
														</svg>

													</a>
												</div>
											</div>
											<div>
												<facet-filters-form>
													{Productcat?.length > 0 ? <>
														<div className="container type-filter__container">
															<ul className="type-filter__list">
																{Productcat?.map((items, index) => {
																	return (<>
																		<li
																			key={items.cat_id}
																			onClick={(e) => handleCheckboxChange(e, items.cat_slug)}
																		// style={{
																		// 	backgroundColor: selectedItems.includes(items.cat_id) ? 'yellow' : 'transparent',
																		// }}

																		// onClick={() => { navigate(`/products/${items?.cat_slug}`) }}


																		>
																			<label className="type-filter__label" >
																				<input type="checkbox" name="filter.p.product_type" value="accessories" className="type-filter__input" />
																				<span className="type-filter__title h4">{items?.cat_name}</span>
																			</label>
																		</li>
																	</>)
																})}
															</ul>
														</div>
													</> : ""}
													<div className="facets">
														<div className="container">
															<div className="facets__wrapper">
																<a className="button open_filters no_submit" onClick={filterModalToggle}>
																	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M12.75 16.125H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M20.25 16.125H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M6.75 7.875H3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path d="M20.25 7.875H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path className="animate-in-hover animate-right" d="M9.75 5.625V10.125" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																		<path className="animate-in-hover animate-left" d="M15.75 18.375V13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"></path>
																	</svg>
																	Filter
																</a>
																<div className="facets__product-count">Showing {productData?.length} of {productcount !== "" ? productcount : 0} products</div>
																<div className="facets__sort-by">
																	<div className="facets__select-label">Sort by:</div>
																	<select name="sort_by" className="select__sort_by" id="SortBy" aria-describedby="a11y-refresh-page-message" onChange={(e) => { setsortfilter(e.target.value) }}>
																		<option value="">Select </option>
																		<option value="1">Featured</option>
																		<option value="2">Best Selling</option>
																		<option value="3">Price-High to Low</option>
																		<option value="4">Price-Low to High</option>
																		<option value="5">Date-Old to New</option>
																		<option value="6">Date-New to Old</option>

																	</select>
																	<svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
																	</svg>
																</div>
															</div>
														</div>
													</div>
												</facet-filters-form>
											</div>
										</div>
										<div className="container mb-5">
											<div className="row">
												<div className="col">
													<h4 className="text-center">No Result Found</h4>
												</div>
											</div>
										</div>
									</section>

								</>
							}
							{/* skeleton start */}
						</>
				}
			</MobileView>
			<Footer />
			{showModal ? (
				<QuickviewModal
					showModal={showModal}
					handleClose={handleClose}
					slugData={slugData}

				/>
			) : null
			}
			{filterModalActive == true ? (
				<>
					<FilterModal
						filterModalActive={filterModalActive}
						filterModalToggle={filterModalToggle}
						productData={productData}
						sendDataToParent={receiveDataFromChild}
						Prizerange={Prizerange}
						maxpricecount={maxpricecount}
						multipleselectitem={multipleselectitem}
						slug={slug}

					/>
				</>
			) : (
				""
			)}
		</>
	);
}

export default Collections;
