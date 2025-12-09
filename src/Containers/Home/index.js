import React, { useEffect, useState, useRef } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import TopSlider from '../../Components/Elements/sections/topSlider'
import Popularproducts from '../../Components/Elements/sections/popular_products'
import Category from '../../Components/Elements/sections/protein_category'
import HomeAbout from '../../Components/Elements/sections/home_about'
import HomeBlogs from '../../Components/Elements/sections/home_blogs'
import HomeTestimonial from '../../Components/Elements/sections/home_testimonial'
import HomeFaq from '../../Components/Elements/sections/home_faq'
import HomeCategory from '../../Components/Elements/sections/home_category'
import TagProducts from '../../Components/Elements/sections/tag_products'
import Deals from '../../Components/Elements/sections/deals'
import RecommendedProduct from '../../Components/Elements/sections/recommendedproduct'
import constants from '../../Components/services/constants'
import { Helmet } from 'react-helmet'
import { ApiService } from '../../Components/services/apiServices'
import { useNavigate } from 'react-router-dom'
import HomeInstagram from '../HomeInstagram'
import ProductsVedio from '../../Components/Elements/sections/products_video'
import CrazyDealsProducts from '../../Components/Elements/sections/cazy_deals'

function Home() {
  const didMountRef = useRef(true);
  const navigate = useNavigate()
  const [pageData, setPageData] = useState({})
  const [headerImageUrl, setHeaderImageUrl] = useState("")
  useEffect(() => {
    if (didMountRef.current) {
      getPagesData()

    }
    didMountRef.current = false
  }, [])
  const getPagesData = () => {
    const dataString = {
      slug: "home"
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
      <TopSlider />
      <ProductsVedio></ProductsVedio>
      <Popularproducts />
      <Category />
      <TagProducts />
      <CrazyDealsProducts/>
      <HomeCategory />
      <Deals />
      <RecommendedProduct />
      <HomeAbout />
      <HomeTestimonial />
      <HomeBlogs />
      <HomeFaq />
      {/* <HomeInstagram/> */}
      <Footer />

    </>

  )
}

export default Home