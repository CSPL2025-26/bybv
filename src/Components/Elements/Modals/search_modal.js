import React, { useState, useEffect, useRef, useContext } from 'react'
import { ApiService } from '../../services/apiServices';
import constants from '../../services/constants';
import DataContext from '../context';

function SearchModal({ searchModalActive, searchModalToggle }) {
	const contextValues = useContext(DataContext);
	const [searchdata, setsearchdata] = useState([]);
	const [baseImg, setbaseImg] = useState("")
	const [showcontent, setshowcontent] = useState(true)
	const [category, setcategory] = useState([])
	const [sliderData, setSliderData] = useState("");
	const [sliderCategoryData, setSliderCategoryData] = useState("");

	const [sliderImagePath, setSliderImagePath] = useState("");
	const didMountRef = useRef(true);

	useEffect(() => {
		if (didMountRef.current) {
			ApiService.fetchData("products-category").then((res) => {
				if (res?.status == "success") {
					setcategory(res?.procat)

				}
			})
			getSliderData()
		}
		didMountRef.current = false;

	}, [])

	const getSliderData = () => {
		const payload = contextValues.currentLocation;
		ApiService.postData("dashboard", payload).then((res) => {
			if (res.status == "success") {
				setSliderData(res?.homeSearchSliderData);
				setSliderCategoryData(res?.homeSearchSliderData.category);
				setSliderImagePath(res.slider_img_path);
			}
		});
	};
	const handlesearch = (e) => {

		let value = e.target.value;
		console.log(value, "valuevalue")
		if (value?.length >= 1 && value !== "") {
			setshowcontent(false)
		}
		else {
			setshowcontent(true)
		}

		if (value == "" || value.length < 2) {
			setsearchdata([]);
			return;
		}
		if (value.length > 2 || value.length == 2) {
			let dataString = {
				query: value,
			};
			ApiService.postData("get-search-data", dataString).then((result) => {
				if (result.status == "success") {
					setsearchdata(result.data);
					setbaseImg(result?.data?.img)
				}
			});
		}
	};


	const handleemptysearch = (e) => {
		e.preventDefault();
		if (searchdata == "" || searchdata == null) {
			// toast.info("Please Enter atleast 2 character  before search ");
		} else {
		}
	};
	return (
		<>
			<div id='search-modal' className={`search-modal color-background-1${searchModalActive ? ' active' : ''}`}>
				<div className='search-modal__wrapper'>
					<h2 className="search-modal__title"><p>Search</p></h2>
					<div className='search-modal__search-form'>
						<form className='search'>
							<div className='search__form-inner'>
								<div className="field">
									<div className="search__input-wrapper">
										<input className="search__input field__input" type="search" name="q" placeholder=" " onChange={(e) => { handlesearch(e) }} />
										<label className="field__label" for="Search-In-Template">Search</label>
										<button type="reset" className="reser-search" onClick={() => { setsearchdata([]); setshowcontent(true) }}><svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
											<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
											<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
										</svg>
										</button>

									</div>

									<button className="button button--primary" aria-label="Search" onClick={(e) => { handleemptysearch(e) }}>
										Search
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
						</form>
						{searchdata && searchdata.length > 0 ? (
							<div className="header-search-list" id="search_input">
								<ul className="">
									{searchdata?.map((items, index) => {
										return (
											<li key={index}>
												<a href={items?.url}>


													{items?.name}
												</a>
											</li>
										);
									})}
								</ul>
							</div>
						) : (
							""
						)}
					</div>
					{showcontent ? <>

						{category?.length > 0 ? <>

							<div className='search-modal__collections'>
								<div className="search-modal__subtitle subtitle"><p>Categories</p></div>
								<ul className="search-modal__collections-list list-unstyled">
									{category?.map((items, index) => {
										return (<>

											<li><a href={`/collections/category/${items?.cat_slug}`} className="h3 unstyled-link">{items?.cat_name}</a></li>
										</>)
									})}

								</ul>
							</div>


						</> : ""}
						{sliderData && sliderData.category ?
							<div id='searchcard' className='search-modal__colection color-background-4'>
								<a className="card-wrapper__link--overlay collection-grid__link" href={`/collections/category/${sliderCategoryData?.cat_slug}`}></a>
								<div className='collection-grid__item'>
									<div className='collection-grid__image-wrapper'>
										<div className='collection-grid__image-block'>
											<h3 className="collection-grid__title "><a className="full-unstyled-link" href="#">{sliderCategoryData?.cat_name}</a></h3>
											{sliderData && sliderData?.slider_image ?
												<div className='collection-grid__image-item'>
													<img src={sliderData?.slider_image != null ? sliderImagePath + sliderData?.slider_image : constants.DEFAULT_IMAGE} sizes='100vw' style={{ objectFit: 'cover' }} alt='slider_image'></img>
												</div>
												: null}
										</div>
									</div>
								</div>
							</div>
							: null}
						<button type="button" className="search-modal__close modal__close-button link focus-inset modal-close-button" onClick={searchModalToggle}>
							<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
								<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
							</svg>
						</button>
					</> : <>
						<button type="button" className="search-modal__close modal__close-button link focus-inset modal-close-button" onClick={searchModalToggle}>
							<svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 2L26 26" stroke="currentColor" strokeWidth="3.3"></path>
								<path d="M26 2L2 26" stroke="currentColor" strokeWidth="3.3"></path>
							</svg>
						</button>
						<div></div>
						<div></div>
					</>}
				</div>
			</div>
			<div className={`search-modal__mask color-inverse${searchModalActive ? ' active' : ''}`} onClick={searchModalToggle}></div>
		</>
	)
}

export default SearchModal