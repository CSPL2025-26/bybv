import React, { useEffect, useRef, useState } from "react";
import { ApiService } from "../../services/apiServices";
import MultiRangeSlider from "multi-range-slider-react";
// import Slider from 'react-rangeslider';
// import 'react-rangeslider/lib/index.css'


function FilterModal({ filterModalToggle,maxpricecount,slug, productData, filterModalActive, sendDataToParent,multipleselectitem,Prizerange }) {
  const [Productcat, setProductcat] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);

  const [showtabs1, setshowstatetabs1] = useState(true)
  const [showtabs2, setshowstatetabs2] = useState(true)
  const [filteredcate, setfiteredcate] = useState("")
  const didMountRef = useRef(true);
  // const minimumPriceItem = productData.reduce((min, item) => (item.product_price < min.product_price ? item : min), productData[0]);
  // const maximumPriceItem = productData.reduce((max, item) => (item.product_price > max.product_price ? item : max), productData[0]);
  const [minValue, setminValue] = useState(0)
  const [maxValue, setmaxValue] = useState(Number(maxpricecount))

  useEffect(() => {
    if (didMountRef.current) {

      ApiService.fetchData("products-category").then((res) => {
        if (res?.status == "success") {
          setProductcat(res?.procat)
        }
      })

    }
    didMountRef.current = false;
if(multipleselectitem?.length>0){
setSelectedItem(multipleselectitem)
}

if(Prizerange?.minvalue!=="" && Prizerange?.maxvalue!==""){
  setminValue(Number(Prizerange?.minvalue))
  setmaxValue(Number(Prizerange?.maxvalue))
}

  }, [multipleselectitem,Prizerange])



  const handleInput = (e) => {
    const newMinValue = parseInt(e.minValue);
    const newMaxValue = parseInt(e.maxValue);
   
    setminValue(newMinValue);
    setmaxValue(newMaxValue);
  };
  function findIdBySlug() {
    for (var i = 0; i < Productcat.length; i++) {
      if (Productcat[i].cat_slug === slug) {
        return Productcat[i].cat_id;
      }
    }
    // If no match is found
    return null;
  }
const categoryid=findIdBySlug()

  const rangeStep = (Number(maxpricecount) - 0) / 100;


  const handleCheckboxChange = (e, catslug, type) => {
    e.preventDefault();

    const selectedIndex = selectedItem.indexOf(catslug);
    const updatedSelectedItems = [...selectedItem];

    if (selectedIndex === -1) {
      // Item doesn't exist, add it
      updatedSelectedItems.push(catslug);
    } else {
      // Item exists, remove it
      updatedSelectedItems.splice(selectedIndex, 1);
    }

    setSelectedItem(updatedSelectedItems);
  };

  const sendData = (e) => {
    e.preventDefault()

    sendDataToParent(selectedItem, minValue, maxValue,categoryid);
    filterModalToggle()
  };



  const clearall = (e) => {
    e.preventDefault();
    setSelectedItem([])
    setminValue(0)
    setmaxValue(Number(maxpricecount))
    // Clear all filters by sending an empty array to the parent component
    sendDataToParent([], "", "");
  };


  return (
    <div id="open_filters_menu" className={`${filterModalActive ? 'show_menu' : ''}`}>
      <a href="javascript:void(0)" className="form-menu__mask no_submit" onClick={() => { filterModalToggle() }}></a>
      <div className="facets-menu">
        <a href="javascript:void(0)" className="facets-menu__close no_submit" onClick={() => { filterModalToggle() }}>
          <svg aria-hidden="true" focusable="false" className="icon icon-close" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L26 26" stroke="currentColor" stroke-width="3.3"></path>
            <path d="M26 2L2 26" stroke="currentColor" stroke-width="3.3"></path>
          </svg>
        </a>
        <h2 className="facets-menu__title mobile-facets__open">Filter</h2>

        <div className='facets__details__wrapper'>
          <details id="Details-1-template--18847831818521__product-grid" className="facets__details js-filter  " data-index="1" open={showtabs1} >
            <summary role="button" aria-expanded="false">
              <h4 className="facets__details-title">Categories</h4>
              <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="square"></path>
              </svg>
            </summary>
            {Productcat?.length > 0 ? <>
              <fieldset className="facets-wrap parent-wrap">

                <ul className="facets__list ">
                  {Productcat?.map((items, index) => {
                    return (<>

                      <li className="list-menu__item facets__item" key={index}>
                        <label className="facets-checkbox" onClick={(e) => { handleCheckboxChange(e, items?.cat_id) }}>
                          <input type="checkbox" name="filter.v.availability" value={items?.cat_id} className="facets-checkbox__hide"
                            checked={selectedItem.includes(items?.cat_id)}


                          />
                          <span className="facets-checkbox__marker">
                            <svg width="12" height="10" className="icon icon-facets-checkmark" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 4.82353L4.76923 8L10 2" stroke="currentColor" stroke-width="2" stroke-linecap="square"></path>
                            </svg>
                          </span>
                          <span className="facets-checkbox__label">{items?.cat_name}</span>

                        </label>
                      </li>


                    </>)
                  })}

                </ul>
              </fieldset>
            </> : ""}

          </details>
          <details id="Details-2-template--18847831818521__product-grid" className="facets__details js-filter  facets__details-last  " data-index="2" open={showtabs2} >
            <summary role="button" aria-expanded="false">
              <h4 className="facets__details-title">Price</h4>
              <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="square"></path>
              </svg>
            </summary>
            <div className='slider custom-labels'>
              <MultiRangeSlider
                min={0}
                max={Number(maxpricecount)}
                // min={Number(minimumPriceItem?.product_price)}
                // max={Number(maximumPriceItem?.product_price)}
                step={rangeStep}
                ruler={false}
                style={{ border: "none", boxShadow: "none", padding: "15px 10px" }}
                // minValue={Number(minimumPriceItem?.product_price)}
                // maxValue={Number(maximumPriceItem?.product_price)}
                minValue={minValue}
                maxValue={maxValue}
                onInput={(e) => {
                  handleInput(e);
                }}
                barLeftColor="white"
                barRightColor="white"
                barInnerColor="black"
                thumbLeftColor="white"
                thumbRightColor="white"
              />
            </div>
          </details>

        </div>
        <div className='facets-menu__buttons active-facets-mobile'>
          <button type="submit" className="button button--primary button--full-width no_submit facets__submit" onClick={(e) => { sendData(e) }}>Apply</button>
          <a className="fs-3 fw-bold" onClick={(e) => { clearall(e) }}>clear all</a>

        </div>
      </div>
    </div>
  )
}

export default FilterModal