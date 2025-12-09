import React, { useEffect, useRef, useState } from 'react'
import { ApiService } from '../../services/apiServices'
import Skeleton from 'react-loading-skeleton';
import { BrowserView, MobileView } from 'react-device-detect';


function HomeFaq() {

    const didMountRef = useRef(true)
    const [faqData, setFaqData] = useState([])
    const [loading, setLoading] = useState();
    useEffect(() => {
        if (didMountRef.current) {
            setLoading(true)
            ApiService.fetchData('faqsData').then(res => {
                if (res.status === 'success') {
                    setFaqData(res.faqData)
                    setLoading(false)
                }
            })
        }
        didMountRef.current = false
    }, [])

    return (
        <>
            <BrowserView>
                {
                    loading == true ? (<section className='spaced-section sectionlarge blockqoute-section'>
                        <div className="faq color-background-1">
                            <div className="faq-header center">
                                <div className="container">
                                    <div className="faq__subtitle subtitle"><Skeleton width={150} /></div>
                                    <h2 className="faq__title"><Skeleton width={350} /></h2>
                                </div>
                            </div>
                            <div className="container">
                                <div className="faq-box">
                                    {
                                        [...Array(3)].map((_, index) => {
                                            return <React.Fragment key={index}>
                                                <div className="faq-block">
                                                    <div className="accordion faq-item">
                                                        <details>
                                                            <summary>
                                                                <h3 className="faq-block__heading"><Skeleton width={750} /></h3>
                                                                <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                </svg>
                                                            </summary>
                                                            <div className="faq-block__description">
                                                                {/* <p>{value.faq_description}</p> */}
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        })
                                    }

                                </div>
                            </div>
                        </div>
                    </section>) : 
                    faqData != null && faqData.length > 0 && (
                        <section className='spaced-section sectionlarge blockqoute-section'>
                            <div className="faq color-background-1">
                                <div className="faq-header center">
                                    <div className="container">
                                        <div className="faq__subtitle subtitle">FAQ</div>
                                        <h2 className="faq__title">Questions &amp; Answers</h2>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="faq-box">
                                        {
                                            faqData.map((value, index) => {
                                                return <React.Fragment key={index}>
                                                    <div className="faq-block">
                                                        <div className="accordion faq-item">
                                                            <details>
                                                                <summary>
                                                                    <h3 className="faq-block__heading">{value.faq_title}</h3>
                                                                    <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                    </svg>
                                                                </summary>
                                                                <div className="faq-block__description">
                                                                    {/* <p>{value.faq_description}</p> */}
                                                                    <p dangerouslySetInnerHTML={{ __html: value.faq_description }}></p>
                                                                </div>
                                                            </details>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }

            </BrowserView>
            <MobileView>
            {
                loading == true ? (<section className='spaced-section sectionlarge blockqoute-section'>
                        <div className="faq color-background-1">
                            <div className="faq-header center">
                                <div className="container">
                                    <div className="faq__subtitle subtitle"><Skeleton width={150} /></div>
                                    <h2 className="faq__title"><Skeleton width={350} /></h2>
                                </div>
                            </div>
                            <div className="container">
                                <div className="faq-box">
                                    {
                                        [...Array(3)].map((_, index) => {
                                            return <React.Fragment key={index}>
                                                <div className="faq-block">
                                                    <div className="accordion faq-item">
                                                        <details>
                                                            <summary>
                                                                <h3 className="faq-block__heading"><Skeleton width={300} /></h3>
                                                                <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                </svg>
                                                            </summary>
                                                            <div className="faq-block__description">
                                                                {/* <p>{value.faq_description}</p> */}
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        })
                                    }

                                </div>
                            </div>
                        </div>
                    </section>) : faqData != null && faqData.length > 0 && (
                    <section className='spaced-section sectionlarge blockqoute-section'>
                        <div className="faq color-background-1">
                            <div className="faq-header center">
                                <div className="container">
                                    <div className="faq__subtitle subtitle">FAQ</div>
                                    <h2 className="faq__title">Questions &amp; Answers</h2>
                                </div>
                            </div>
                            <div className="container">
                                <div className="faq-box">
                                    {
                                        faqData.map((value, index) => {
                                            return <React.Fragment key={index}>
                                                <div className="faq-block">
                                                    <div className="accordion faq-item">
                                                        <details>
                                                            <summary>
                                                                <h3 className="faq-block__heading">{value.faq_title}</h3>
                                                                <svg className="icon icon-filter-two" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 1.5L6 5.5L2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square"></path>
                                                                </svg>
                                                            </summary>
                                                            <div className="faq-block__description">
                                                                {/* <p>{value.faq_description}</p> */}
                                                                <p dangerouslySetInnerHTML={{ __html: value.faq_description }}></p>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                    )
            }
               
            </MobileView>
        </>

    )
}

export default HomeFaq