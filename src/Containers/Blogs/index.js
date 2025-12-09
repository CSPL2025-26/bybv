import React, { useEffect, useRef, useState } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { ApiService } from "../../Components/services/apiServices";
import constants from "../../Components/services/constants";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet";
function Blog() {
  const didMountRef = useRef(true);
  const [firstData, setFirstData] = useState("");
  const [pageData, setPageData] = useState({});
  const [blogData, setBlogData] = useState([]);
  const [blogImagePath, setBlogImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [headerImageUrl, setHeaderImageUrl] = useState("")
  useEffect(() => {
    if (didMountRef.current) {
      getBlogList();

      const getPageData = {
        slug: "blogs",
      };
      ApiService.postData("page-content", getPageData).then(
        (res) => {
          if (res.status === "success") {
            setPageData(res.data);
            setHeaderImageUrl(res.page_header_image_path);
          }
        }
      );


    }
    didMountRef.current = false;
  });


  const getBlogList = () => {
    setLoading(true);
    ApiService.fetchData("blogs-list").then((res) => {
      if (res.status == "success") {
        setBlogData(res.blogsData);
        setFirstData(res.firstBlog);
        setBlogImagePath(res.blog_image_path);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

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
      <section className="spaced-section">
        <div className="container">
          <nav
            className="breadcrumb"
            role="navigation"
            aria-label="breadcrumbs"
            style={{ justifyContent: "flex-start" }}
          >
            <a href="/" title="Home" className="link-hover-line">
              Home
            </a>
            <div className="breadcrumb__delimiter">
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-breadcrumbs"
              >
                <path
                  d="M1.25 1.5L4.75 5L1.25 8.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="square"
                ></path>
              </svg>
            </div>
            <span>News</span>
          </nav>
        </div>


        {
          loading == true ? <>
            <section className="section-main-blog">
              <div className="container my-5">
                <div className="row">
                  <div className="col-lg-6">
                    <Skeleton width='100%' height={600} />
                  </div>
                  <div className="col-lg-6 d-flex justify-content-center align-items-center">
                    <div className="text-center">
                      <Skeleton width={150} />
                      <Skeleton width={350} height={20} />
                      <Skeleton width={150} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="container my-5">
                <div className="row">
                  {
                    [...Array(5)].map((_, index) => (
                      <div className="col-lg-4" key={index}>
                        <Skeleton width='100%' height={400} />
                        <div className="my-2">
                          <Skeleton width={250} />
                          <Skeleton width={200} />
                        </div>
                      </div>
                    ))
                  }

                </div>
              </div>
            </section>
          </> : blogData.length > 0 && (
            <>
              <section className="section-main-blog">
                <div className="main-blog">
                  <div className="container">
                    <div className="main-blog__header">
                      <h1 className="main-blog__title main-page-title page-title title--page h2">
                        News
                      </h1>
                    </div>
                  </div>
                  <div className="blog-articles">
                    <div className="blog-articles__hero">
                      <article className="article-hero color-background-4">
                        <div className="article-hero__img">
                          <img
                            src={
                              firstData.blog_image != null
                                ? blogImagePath + firstData.blog_image
                                : constants.DEFAULT_IMAGE
                            }
                            sizes="100vw"
                          ></img>
                        </div>
                        <div className="article-hero__text">
                          <div className="article-hero__text-wrapper">
                            <div className="article__info subtitle">
                              <div className="article__date">
                                <time dateTime="2023-05-19T07:03:24Z">
                                  {moment(firstData.created_at).format(
                                    "MMM D, YYYY"
                                  )}
                                </time>
                              </div>

                              {/* <div className="article__author"> by <span>Jacob Smith</span></div> */}
                            </div>
                            <h2 className="article-hero__title">
                              <a
                                href={`/blogs/${firstData.blog_slug}`}
                                className="full-unstyled-link"
                              >
                                {firstData.blog_name}
                              </a>
                            </h2>
                            <a
                              href={`/blogs/${firstData.blog_slug}`}
                              className="button button--primary button--primary-size"
                            >
                              Read now
                              <span>
                                <svg
                                  className="icon icon-button-arrow"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_2071_16434)">
                                    <path
                                      d="M2.24268 12.2427L12.1422 2.34326"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="square"
                                    ></path>
                                    <path
                                      d="M4.36377 1.63617H12.8491V10.1215"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="square"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_2071_16434">
                                      <rect
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                      ></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
                              </span>
                            </a>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="container">
                      <ul className="blog-articles__list list-unstyled load-more-grid">
                        {blogData.map((value, index) => {
                          return (
                            <React.Fragment key={index}>
                              <li className="blog-articles__list-article">
                                <article className="article__wrapper article__border article">
                                  <div className="article__block">
                                    <a
                                      href={`/blogs/${value.blog_slug}`}
                                      className="article_img have-overlay color-background-4 color-border-1"
                                      style={{ paddingBottom: "70%" }}
                                    >
                                      <img
                                        src={
                                          value.blog_image != null
                                            ? blogImagePath + value.blog_image
                                            : constants.DEFAULT_IMAGE
                                        }
                                        sizes="100vw"
                                        style={{ objectFit: "cover" }}
                                      ></img>
                                    </a>
                                    <div className="article__text">
                                      <div className="article__info subtitle">
                                        <div className="article__date">
                                          <time dateTime="2023-05-19T07:02:24Z">
                                            {moment(value.created_at).format(
                                              "MMM D, YYYY"
                                            )}
                                          </time>
                                        </div>
                                        {/* <div className="article__author">by <span>Jacob Smith</span></div> */}
                                      </div>
                                      <h2 className="article__title h4">
                                        <a
                                          href={`/blogs/${value.blog_slug}`}
                                          className="full-unstyled-link"
                                        >
                                          {value.blog_name}
                                        </a>
                                      </h2>
                                    </div>
                                  </div>
                                </article>
                              </li>
                            </React.Fragment>

                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )
        }


      </section>
      <Footer />
    </>
  );
}

export default Blog;
