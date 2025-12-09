import React from 'react'
import { BrowserView, MobileView } from 'react-device-detect'

function HomeAbout() {
return (
<>
<BrowserView>
<section className='image-banner-section'>
<div className='color-inverse image-banner'>
<div className='image-banner__img'>
<img src='/img/ourmission.jpg' sizes='100vw' alt='ourmission_image'></img>
</div>
<div className='container image-banner__wrapper'>
<div className='image-banner__block'>
<div className="image-banner__block-header">
<div className="image-banner__block-header-subheading subtitle">about us</div>
<h2 className="image-with-description__block-heading">our mission</h2>
</div>
<div className="image-banner__block-info">
<div className="image-banner__block-info__text">
We envision a World where people are continuously 
striving to unlock their full potential. We believe that 
each person has the capacity for growth, and by fostering
self-awareness and providing the essential & best 
nutritional supplements, we aim to help you transform to 
your full potential.</div>
<div className="image-banner-author__block">
{/* <div className="image-banner-author__position subtitle">
co-founder
</div>
<div className="image-banner-author__name">
Jacob Smith
</div> */}
</div>
</div>
<div className="image-banner__button-wrapper">
<a href="/about-us" className="button button--primary button--primary-size ">
About us
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
</div>
</div>
</div>
</section>

</BrowserView>


<MobileView>
<section className='image-banner-section'>
<div className='color-inverse image-banner'>
<div className='image-banner__img'>
<img src='/img/ourmission.jpg' sizes='100vw' alt='ourmission_image'></img>
</div>
<div className='container image-banner__wrapper'>
<div className='image-banner__block'>
<div className="image-banner__block-header">
<div className="image-banner__block-header-subheading subtitle">about us</div>
<h2 className="image-with-description__block-heading">our mission</h2>
</div>
<div className="image-banner__block-info">
<div className="image-banner__block-info__text">
We envision a World where people are continuously 
striving to unlock their full potential. We believe that 
each person has the capacity for growth, and by fostering
self-awareness and providing the essential & best 
nutritional supplements, we aim to help you transform to 
your full potential.</div>
<div className="image-banner-author__block">
{/* <div className="image-banner-author__position subtitle">
co-founder
</div>
<div className="image-banner-author__name">
Jacob Smith
</div> */}
</div>
</div>
<div className="image-banner__button-wrapper">
<a href="/about-us" className="button button--primary button--primary-size ">
About us
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
</div>
</div>
</div>
</section>

</MobileView>

</>


)
}

export default HomeAbout