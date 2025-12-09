import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiService } from '../../Components/services/apiServices'
import Skeleton from 'react-loading-skeleton'
import constants from '../../Components/services/constants'
import { Helmet } from "react-helmet";
function About() {

  const navigate = useNavigate();
  const didMountRef = useRef(true)
  const [pageData, setPageData] = useState({})
  const { slug } = useParams();
  const [loading, setloading] = useState();
  const [headerImageUrl, setHeaderImageUrl] = useState("")

  useEffect(() => {
    if (didMountRef.current) {
      setloading(true)
      const dataString = {
        slug: 'about-us'
      }
      ApiService.postData('page-content', dataString).then(res => {
        if (res.status === 'success') {
          setPageData(res.pageData)
          setHeaderImageUrl(res.page_header_image_path);
          
          setloading(false)
        } else {
          setloading(false)
        }
      })
    }
    didMountRef.current = false
  }, [])
  return (
    <>
          <Helmet>
        <title>{pageData?.page_meta_title ?? "ByBv"}</title>
        <meta name="description" itemprop="description"content={pageData?.page_meta_desc ?? "ByBv"}/>
        {pageData?.page_meta_keyword && (
        <meta name="keywords" content={pageData.page_meta_keyword} />
        )}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData?.page_meta_title ?? "ByBv"}/>
        <meta name="twitter:url" content={window.location.href} />
        {pageData?.page_header_image ? (
          <meta property="og:image" content={headerImageUrl + pageData.page_header_image} />
        ) : (
          <meta property="og:image" content={constants.FRONT_URL + 'img/logo.png'} />
        )}
        <meta property="og:url" content={window.location.href} />
        {pageData?.page_meta_desc ? (
          <meta property="og:description" content={pageData.page_meta_desc} />
        ) : (
          <meta property="og:description" content="ByBv" />
        )}
        <meta name="twitter:title" content={pageData?.page_meta_title ?? "ByBv"}
        />
        {pageData?.page_meta_desc ? (
          <meta property="twitter:description" content={pageData.page_meta_desc} />
        ) : (
          <meta property="twitter:description" content="ByBv" />
        )}
        {pageData?.page_header_image ? (
          <meta property="twitter:image" content={headerImageUrl + pageData.page_header_image}
          />
        ) : (
          <meta property="twitter:image" content={constants.FRONT_URL + 'img/logo.png'}
          />
        )}
      </Helmet>
      <Header />
      <section className='spaced-section'>
        <div className='container'>
          <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
            <a href="/" title="Home" className="link-hover-line">Home</a>
            <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg></div>
            <span>{pageData?.page_name}
            </span>
          </nav>
        </div>
      </section>
      {
        loading == true ? <>
          <section className='page-hero-section spaced-section'>
            <div className="container">
              <div className="row my-5">
                <div className="col">
                  <Skeleton width='100%' height={500} />
                </div>
              </div>
              <div className="row my-5">
                <div className="col-lg-7">
                  <div>
                    <Skeleton width={300} height={25} />
                    <Skeleton width={250} />
                    <Skeleton width={250} />
                    <Skeleton width={250} />
                  </div>
                  <div className='mt-5'>
                    <Skeleton width={300} height={25} />
                    <Skeleton width={250} />
                    <Skeleton width={250} />
                    <Skeleton width={250} />
                  </div>
                </div>
                <div className="col-lg-5"><Skeleton width='100%' height={300} /></div>
              </div>
            </div>
          </section>
        </> : <>
          <section dangerouslySetInnerHTML={{ __html: pageData.page_content }}>
          </section>
        </>
      }




      <Footer />

    </>

  )
}

export default About