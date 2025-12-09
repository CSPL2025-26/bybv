import React from 'react'

function Deals() {
  return (
    <section className='image-with-text-section spaced-section'>
      <div className='image-with-text color-background-4'>
        <div className='image-with-text__block image-with-text__block-text image-larger border-position-right have_border'>
          <div className='image-with-text__block-text__wrapper center-center'>
            <div className="image-with-text__subtitle subtitle">exclusive deals</div>
            <h2 className="image-with-text__title h1">Ready for the Big Sale Upto 68% Off</h2>
            <div className="image-with-text__text richtext__content">
              <p>It's time to level up your muscle with our exciting new arrivals. Upgrade your routine and enjoy a fantastic  discount on all the latest protein essentials.</p>
            </div>
            <a href="/collections/category" className="button button--primary button--primary-size ">shop sale
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
        <div className='image-with-text__block image-with-text__block-image  image-larger border-position-right'>
          <div className='image-with-text__img'>
            <img src='/img/sale.jpeg' sizes='100vw, (min-width: 1023px) 50vw' alt='sale_image'></img>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Deals