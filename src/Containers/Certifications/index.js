import React, { useState,useRef } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useEffect } from 'react'
import { ApiService } from '../../Components/services/apiServices'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import constants from '../../Components/services/constants'

function Certifications() {
  const [certifieddata,setcertifieddata]=useState("")
  const [certifiedImg,setcertifiedImg]=useState("")

  const navigate=useNavigate()
  const didMountRef = useRef(true);
  const [pageData, setPageData] = useState({})
  const [headerImageUrl, setHeaderImageUrl] = useState("")

  useEffect(() => {
    if (didMountRef.current) {
      getPagesData()
      fetchcertificate()

    }
    didMountRef.current = false
  }, [])

  const getPagesData = () => {
    const dataString = {
      slug: "certifications"
    }
    ApiService.postData('page-content', dataString).then(res => {
      if (res.status === 'success') {
        setPageData(res.pageData)
        setHeaderImageUrl(res.page_header_image_path);
      } else {
        navigate('/error_404')
      }
    })

  }
  const fetchcertificate=()=>{
    ApiService.fetchData("featured-certificate").then((res) => {
      if (res?.status == "success") {
        setcertifieddata(res?.resCertificate)
        setcertifiedImg(res?.certificate_image_path)

      }  
    })
  }
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
    <Header/>
    <section className='spaced-section'>
        <div className="container ">
          <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
            <a href="/" title="Home" className="link-hover-line">Home</a>
            <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg></div>
            <span>{pageData.page_name}</span>

          </nav>
        </div>

        <div className="shopify-policy__container">
          <div style={{ textAlign: 'center' }}>
            <h1>{pageData.page_name}</h1>
          </div>
        </div>
        </section>

        <section className='sectionlarge'>
        <div className="container">
          <div className='row justify-content-center'>
          {certifieddata?.length>0?<>
        {certifieddata?.map((value,index)=>{
          return(<>
              <div className='col-lg-4' key={index}>
                <div className='labbox'>
                <img src={certifiedImg + value.partner_image}></img>
                  <h2 className='mt-5'>{value.partner_name}</h2>
                  <div>
                  </div>
                </div>
              </div>
              </>)
        })}
        </>:""}
          </div>


        </div>
      </section>
        {/* {certifieddata?.length>0?<>
        {certifieddata?.map((items,index)=>{
          return(<>
          
          <div>Certificate</div>
          
          </>)
        })}
        </>:""} */}
   

      
    <Footer/>
    </>
 
  )
}

export default Certifications