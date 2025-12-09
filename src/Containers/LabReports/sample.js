import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiService } from '../../Components/services/apiServices'
import constants from '../../Components/services/constants'
import { Helmet } from "react-helmet";
function LabReports() {

  const navigate = useNavigate();
  const didMountRef = useRef(true)
  const [pageData, setPageData] = useState({})
  const [headerImageUrl, setHeaderImageUrl] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([])
  const [imagePath, setImagePath] = useState([])
  const [hideShow, setHideShow] = useState(0)
  const [categoryImg, setCategoryImg] = useState("")

  

  useEffect(() => {
    if (didMountRef.current) {
      getPagesContent()
      categoryreports()
    }
    didMountRef.current = false
  })

  const getPagesContent = () => {
    const pagevalue = {
      slug: "lab-reports"
    }
    ApiService.postData('page-content', pagevalue).then(res => {
      if (res.status === 'success') {
        setPageData(res.pageData)
        setHeaderImageUrl(res.page_header_image_path);
      } else {
        navigate('/error_404')
      }
    })
  }

  const categoryreports = () => {
    ApiService.fetchData("category-wise-reports").then((res) => {
      if (res.status === "success") {
        setCategoryData(res.categoryData)
        setCategoryImg(res.category_img_path)
        setImagePath(res.reportsImagePath)
      }
    })
  }
  const handleCategorySelect = (category) => {
    setHideShow(category.cat_id)
    setSelectedCategory(category.cat_name);
  }
  const handleReportSelect = (reportImage) => {
    if (reportImage !== "#") {
      window.location.href = imagePath + reportImage;
      console.log("handleReportSelect", reportImage);
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageData?.page_meta_title ?? "ByBv"}</title>
        <meta name="description" itemprop="description" content={pageData?.page_meta_desc ?? "ByBv"} />
        {pageData?.page_meta_keyword && (
          <meta name="keywords" content={pageData.page_meta_keyword} />
        )}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={pageData?.page_meta_title ?? "ByBv"} />
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
        <div className="container ">
          <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
            <a href="/" title="Home" className="link-hover-line">Home</a>

            <div className="breadcrumb__delimiter"><svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
              <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"></path>
            </svg></div>
            <span>{pageData.page_name}
            </span>

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
            {categoryData.map((value, index) => (
              <div className='col-lg-4'>
                <div className='labbox'>
                <img src={categoryImg + value.cat_image}></img>
                  <h2 className='mb-5'>{value.cat_name}</h2>
                  <div>
                    <select onChange={(e) => handleReportSelect(e.target.value)}>
                      <option value="#">Click Here to choose your purchased flavour</option>
                      {value.lab_reports.map((report, index) => (
                        <option key={index} value={report.lr_image}>{report.lr_title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>


      <Footer />

    </>

  )
}

export default LabReports