import React from 'react'
import { BrowserView, MobileView } from 'react-device-detect'

function Countdown() {
  return (
    <>
<BrowserView>

<section className='countdown-section'>
    <div className='countdown js-countdown color-background-4 countdown-content-left' style={{textAlign:'left'}}>
    <div className='countdown__img'>
    <img src='/img/countdown.jpg' sizes='100vw' alt='countdown_image'></img>
    </div>
    <div className='container'>
    <div className='countdown__wrapper'>
    <div className='countdown__header'>
    {/* <h2 className="countdown__header-title h1">Last Call for Savings</h2> */}
    <div className="countdown__desc richtext__content">
    <p>Don't miss out on amazing discounts. Shop now and snag unbeatable deals on protein products. </p>
    </div>
    {/* <div className="countdown__body">
    <div className="countdown__main">
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__days h1">03</div>
    <p>days</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__hours h1">08</div>
    <p>hours</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__minutes h1">29</div>
    <p>minutes</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__seconds h1">59</div>
    <p>seconds</p>
    </div>
    </div>
    </div>
    </div> */}
    <div className="countdown__button-wrapper"><a href="/collections/category" className="button button--primary button--primary-size ">shop sale<span>
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
    </div>
    </div>
    </div>
    </div>
    </section>
</BrowserView>
<MobileView>

<section className='countdown-section'>
    <div className='countdown js-countdown color-background-4 countdown-content-left' style={{textAlign:'left'}}>
    <div className='countdown__img'>
    <img src='/img/countdown.jpg' sizes='100vw' alt='countdown_image'></img>
    </div>
    <div className='container'>
    <div className='countdown__wrapper'>
    <div className='countdown__header'>
    <h2 className="countdown__header-title h1">Last Call for Savings</h2>
    <div className="countdown__desc richtext__content">
    <p>Don't miss out on amazing discounts. Shop now and snag unbeatable deals on protein products. </p>
    </div>
    <div className="countdown__body">
    <div className="countdown__main">
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__days h1">03</div>
    <p>days</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__hours h1">08</div>
    <p>hours</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__minutes h1">29</div>
    <p>minutes</p>
    </div>
    </div>
    <div className="countdown__block">
    <div className="countdown__block__num richtext__content">
    <div className="countdown__block__seconds h1">59</div>
    <p>seconds</p>
    </div>
    </div>
    </div>
    </div>
    <div className="countdown__button-wrapper"><a href="/collections/category" className="button button--primary button--primary-size ">shop sale<span>
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
    </div>
    </div>
    </div>
    </div>
    </section>
    
</MobileView>
</>


  )
}

export default Countdown