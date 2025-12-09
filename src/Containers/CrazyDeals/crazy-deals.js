import React, { useEffect, useState, useRef, useCallback } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { ApiService } from '../../Components/services/apiServices'
import { useNavigate } from 'react-router-dom';
import constants from '../../Components/services/constants';

function CrazyDeals() {
    const didMountRef = useRef(true);
    const navigate = useNavigate()
    const [crazyDeals, setCrazyDeals] = useState([])
    const [crazyDealsCategory, setCrazyDealsCategory] = useState({})
    const [categoryImagePath, setCategoryImagePath] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 300;

    const description = crazyDealsCategory?.cat_desc ?? '';
    const truncatedDescription = isExpanded ? description : `${description.slice(0, MAX_LENGTH)}...`;
    const getCrazyDeals = useCallback(() => {
        ApiService.fetchData('crazyDeals').then(res => {
            if (res.status === 'success') {
                setCrazyDeals(res.crazyDeals)
                setCrazyDealsCategory(res.crazyDealsCategory)
                setCategoryImagePath(res.crazyDealsCategoryImagePath)
            }
        })
    }, [])

    useEffect(() => {
        if (didMountRef.current) {
            getCrazyDeals()
        }
        didMountRef.current = false
    }, [getCrazyDeals])
    let formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return (
        <>
            <Header />
            <div className="collection-banner-section spaced-section spaced-section--full-width section-template--overlay">
                <div className="container">
                    <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
                        <a href="/" title="Home" className="link-hover-line">Home</a>
                        <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
                            <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
                        </svg>
                        </div>
                        {crazyDealsCategory && crazyDealsCategory.cat_name != null ? <span>{crazyDealsCategory.cat_name}</span> : ''}
                    </nav>
                </div>
                <div className="collection-banner">
                    <div className="collection-banner__body color-background-4 overlay-enable show_img">
                        <div className="container">
                            <div className="collection-banner__wrapper">
                                <div className="collection-banner__img">

                                    {crazyDealsCategory && crazyDealsCategory.cat_banner_image != null ?
                                        <img src={categoryImagePath + crazyDealsCategory.cat_banner_image} sizes="100vw" alt="Category Banner" />
                                        : null}
                                </div>
                                <div className="collection-banner__text">
                                    {crazyDealsCategory && crazyDealsCategory.cat_name != null ? <h1 className="collection-banner__title">{crazyDealsCategory.cat_name}</h1>
                                        : null}

                                    <div className={`banner_description ${isExpanded ? 'banner_description_scroll' : ''}`} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
                                    {description && description.length > MAX_LENGTH && (
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
            <section className='crazy-deals-section'>
                <div className='container'>
                    {crazyDeals.map((items, index) => {
                        return (
                            <div className='crazy-deals-product' key={index}>
                                <div className='row align-items-center justify-content-center'>
                                    <div className='col-lg-5'>
                                        <div className='crazy-deals-product-media'>
                                            <img src={items.product_image ? items.product_image : constants.DEFAULT_IMAGE} sizes="100vw" alt="Category Banner" />
                                        </div>
                                    </div>
                                    <div className='col-lg-5'>
                                        <div className='crazy-deals-product-details'>
                                            <h2 className='title'>{items.product_name}</h2>
                                            <div className='cp-price'>
                                                <ins class="new-price">₹{formatter.format(items.product_selling_price)}</ins>
                                                {items.product_discount > 0 && <del class="old-price">₹{formatter.format(items.product_price)}</del>}
                                            </div>
                                            {items.product_content != null ? (
                                                <div dangerouslySetInnerHTML={{ __html: items.product_content }}></div>
                                            ) : null
                                            }
                                            {items.product_highlight != ''  ? (
                                                <ul className='highlightlist'>
                                                    {items.product_highlight.split('##').map((highlight, index) => (
                                                        <li key={index}><img src='/img/check-mark.png'></img><span>{highlight}</span></li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                            <div className="product-form__checkout">
                                                <button className="button button--primary mt-5" onClick={(e) => navigate('/crazy-deals-detail/' + items.product_slug)}>
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
            <Footer />
        </>
    )
}

export default CrazyDeals