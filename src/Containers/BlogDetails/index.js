import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { ApiService } from '../../Components/services/apiServices'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import constants from '../../Components/services/constants'
import HomeBlogs from '../../Components/Elements/sections/home_blogs'
import { Helmet } from "react-helmet";
function BlogDetails() {
  const didMountRef = useRef(true)
  const { slug } = useParams();

  const [blogData, setBlogData] = useState({})
  const [blogImagePath, setBlogImagePath] = useState('')

  useEffect(() => {
    if (didMountRef.current) {

      getBlogData();

    }
    didMountRef.current = false

  })

  const getBlogData = () => {

    const blogs = {
      blog_slug: slug

    }

    ApiService.postData("blog-details", blogs).then((res) => {
      if (res.status == "success") {
        setBlogData(res.data)
        setBlogImagePath(res.blog_image_path)

      }
    })
  }


  return (
    <>
      <Helmet>
        <title>{blogData.blog_meta_title}</title>
        <meta name="description" itemprop="description" content={blogData.blog_meta_desc != null ? blogData.blog_meta_desc : "ByBv"} />
        {blogData.blog_meta_keyword != null ? <meta name="keywords" content={blogData.blog_meta_keyword} /> : "ByBv"}
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={blogData?.blog_meta_title != null ? blogData.blog_meta_title : "ByBv"} />
        <meta name="twitter:url" content={window.location.href} />
        {blogData?.blog_image ? (
                    <meta property="og:image" content={blogImagePath + blogData.blog_image} />
                ) : (
                    <meta
                        property="og:image"
                        content={constants.FRONT_URL + 'img/logo.png'}
                    />
                )}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content={blogData.blog_meta_desc != null ? blogData.blog_meta_desc : "ByBv"} />
        <meta property="twitter:title" content={blogData?.blog_meta_title != null ? blogData.blog_meta_title : "ByBv"} />
        <meta name="twitter:description" content={blogData.blog_meta_desc != null ? blogData.blog_meta_desc : "ByBv"} />
        {blogData?.blog_image ? (
                    <meta property="twitter:image" content={blogImagePath + blogData.blog_image} />
                ) : (
                    <meta
                        property="twitter:image"
                        content={constants.FRONT_URL + 'img/logo.png'}
                    />
                )}
      </Helmet>
      <Header />
      <section className='spaced-section section-main-article sectionlarge'>
        <article className="article-template in_container">
          <header className='article-header color-border-1'>
            <div className='article-header__wrapper'>
              <div className='article-header__content'>
                <div className="container">
                  <nav className="breadcrumb" role="navigation" aria-label="breadcrumbs">
                    <a href="/" title="Home" className="link-hover-line">
                      Home
                    </a>
                    <div className="breadcrumb__delimiter">
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
                        <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"></path>
                      </svg>
                    </div>
                    <a href="/blogs" title="News" className="link-hover-line">
                      News
                    </a>
                    <div className="breadcrumb__delimiter">
                      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon icon-breadcrumbs">
                        <path d="M1.25 1.5L4.75 5L1.25 8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"></path>
                      </svg>
                    </div>
                    <span>{blogData.blog_name}</span>
                  </nav>
                </div>
                <div className='article-template__container'>
                  <div className="article-header__text">
                    <div className="article-header__info subtitle">
                      <div className="article-header__date"><time datetime="2023-05-19T07:03:24Z">{moment(blogData.created_at).format("MMMM DD, YYYY")}</time></div>
                      <div className="article-header__author">by <span>{blogData.blog_admin_name}</span></div>
                    </div>
                    <h1 className="article-header__title h2">{blogData.blog_name}</h1>
                    {/* <ul className="article-header__share-buttons share-buttons-simple"><li className="share-buttons-simple__item">
                <a href="https://www.facebook.com/sharer.php?u=https://berlin-marble.myshopify.com/blogs/news/hair-care-101-essential-tips-for-mens-healthy-and-stylish-hair" className="share-buttons-simple__button facebook-btn" target="_blank">
                          <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-facebook" viewBox="0 0 18 18">
<path d="M18 9.05482C18 4.05345 13.9711 0 9 0C4.02891 0 0 4.05345 0 9.05482C0 13.5752 3.29062 17.3209 7.59375 18V11.6722H5.30859V9.05482H7.59375V7.05993C7.59375 4.79092 8.93672 3.53704 10.9934 3.53704C11.9777 3.53704 13.0078 3.71389 13.0078 3.71389V5.94223H11.8723C10.7543 5.94223 10.4062 6.64079 10.4062 7.35704V9.05482H12.9023L12.5033 11.6722H10.4062V18C14.7094 17.3209 18 13.5752 18 9.05482Z" fill="currentColor"></path>
<path d="M12.5033 11.6016L12.9023 9H10.4062V7.3125C10.4062 6.60058 10.7543 5.90625 11.8723 5.90625H13.0078V3.69141C13.0078 3.69141 11.9777 3.51562 10.9934 3.51562C8.93672 3.51562 7.59375 4.76191 7.59375 7.01719V9H5.30859V11.6016H7.59375V17.891C8.52562 18.0363 9.47438 18.0363 10.4062 17.891V11.6016H12.5033Z" fill="transparent"></path>
</svg>
</a>
                      </li>
                      <li className="share-buttons-simple__item">
                        <a href="https://twitter.com/share?url=https://berlin-marble.myshopify.com/blogs/news/hair-care-101-essential-tips-for-mens-healthy-and-stylish-hair&amp;text=Hair Care 101: Essential Tips for Men's Healthy and Stylish Hair" className="share-buttons-simple__button twitter-btn" target="_blank">
                          <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-twitter" viewBox="0 0 512 512">
<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="currentColor"></path>
</svg>

                        </a>
                      </li>
                      <li className="share-buttons-simple__item">
                        <a href="https://pinterest.com/pin/create/bookmarklet/?media=//berlin-marble.myshopify.com/cdn/shop/articles/pexels-obsahovka-obsahovka-4449799_1_1100x1100.jpg?v=1684480294&amp;url=https://berlin-marble.myshopify.com/blogs/news/hair-care-101-essential-tips-for-mens-healthy-and-stylish-hair&amp;description=Hair Care 101: Essential Tips for Men's Healthy and Stylish Hair" className="share-buttons-simple__button pinterest-btn" target="_blank">
                          <svg viewBox="0 0 18 18" className="icon icon-pinterest" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.1398 0.814115C8.14585 0.539827 6.12 0.996242 4.43632 2.09908C2.75263 3.20192 1.52483 4.8767 0.979626 6.81417C0.434421 8.75164 0.608634 10.8209 1.4701 12.64C2.33156 14.459 3.82209 15.905 5.66646 16.7108C5.61658 16.0706 5.66236 15.4266 5.80229 14.7999C5.95646 14.1008 6.88229 10.2474 6.88229 10.2474C6.69793 9.8342 6.6058 9.38575 6.61229 8.93328C6.61229 7.69578 7.32646 6.77245 8.21479 6.77245C8.37438 6.77013 8.5326 6.80219 8.67869 6.86647C8.82478 6.93075 8.95531 7.02574 9.06142 7.14497C9.16752 7.2642 9.24671 7.40488 9.29359 7.55744C9.34048 7.71 9.35396 7.87088 9.33313 8.02912C9.33313 8.77911 8.85146 9.91411 8.59979 10.9791C8.55006 11.1744 8.5469 11.3787 8.59058 11.5755C8.63426 11.7722 8.72355 11.956 8.85126 12.1119C8.97897 12.2678 9.14152 12.3916 9.32582 12.4732C9.51012 12.5547 9.71101 12.5919 9.91229 12.5816C11.494 12.5816 12.554 10.5558 12.554 8.16411C12.554 6.33078 11.3398 4.95745 9.10146 4.95745C8.56594 4.93664 8.03178 5.02488 7.5314 5.21683C7.03103 5.40877 6.57489 5.7004 6.19067 6.07402C5.80645 6.44764 5.50217 6.89545 5.29631 7.39026C5.09045 7.88507 4.9873 8.41656 4.99313 8.95245C4.96927 9.54688 5.16105 10.1299 5.53313 10.5941C5.60265 10.646 5.65342 10.7191 5.67777 10.8024C5.70212 10.8857 5.69874 10.9746 5.66813 11.0558C5.62979 11.2091 5.53313 11.5749 5.49479 11.7091C5.48682 11.7546 5.46827 11.7976 5.44065 11.8346C5.41302 11.8716 5.37708 11.9017 5.33574 11.9223C5.29439 11.9428 5.24878 11.9534 5.20259 11.9532C5.1564 11.9529 5.11091 11.9418 5.06979 11.9208C3.91646 11.4591 3.37313 10.1899 3.37313 8.74078C3.37313 6.36828 5.35979 3.52828 9.33479 3.52828C12.4981 3.52828 14.6015 5.84245 14.6015 8.31745C14.6015 11.5749 12.7873 14.0241 10.1065 14.0241C9.70578 14.0369 9.30835 13.9485 8.9509 13.767C8.59346 13.5855 8.28755 13.3168 8.06146 12.9858C8.06146 12.9858 7.57979 14.9158 7.48479 15.2808C7.29087 15.9114 7.00472 16.5098 6.63563 17.0566C7.40479 17.2899 8.20396 17.4066 9.00729 17.4033C10.1019 17.4042 11.186 17.1891 12.1974 16.7704C13.2089 16.3518 14.1278 15.7377 14.9015 14.9634C15.6753 14.1891 16.2887 13.2697 16.7067 12.258C17.1246 11.2463 17.3389 10.1621 17.3373 9.06745C17.3363 7.05495 16.6071 5.11078 15.2845 3.59393C13.9619 2.07708 12.1351 1.09 10.1415 0.814949L10.1398 0.814115Z" fill="currentColor"></path>
</svg>

                        </a>
                      </li>
                      <li className="share-buttons-simple__item">
                        <a href="https://berlin-marble.myshopify.com" className="share-buttons-simple__button copy-btn">
                          <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        </a>
                      </li>
                      </ul> */}
                  </div>
                  <div className='article-header__img'>
                    <img src={blogData.blog_image != null ? blogImagePath + blogData.blog_image : constants.DEFAULT_IMAGE} sizes='100vw'></img>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className='article-content'>
            <div className='article-content__wrapper rte' dangerouslySetInnerHTML={{ __html: blogData.blog_desc }}>
            </div>
          </div>
        </article>
      </section>
      <HomeBlogs />
      <Footer />
    </>

  )
}

export default BlogDetails