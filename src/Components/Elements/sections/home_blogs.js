import React, { useEffect, useRef, useState } from 'react'
import { ApiService } from '../../services/apiServices'
import moment from 'moment';
import constants from '../../services/constants';
import Skeleton from 'react-loading-skeleton';


function HomeBlogs() {
    const didMountRef = useRef(true)
    const [blogData, setBlogData] = useState([])
    const [blogImagePath, setBlogImagePath] = useState([]);
    const [firstBlogData, setfirstBlogData] = useState("")
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (didMountRef.current) {
            setLoading(true)
            ApiService.fetchData('featured-blogs-list').then(res => {
                console.log(res)
                if (res.status === 'success') {
                    setBlogData(res.blogsData)
                    setBlogImagePath(res.blog_image_path)
                    setfirstBlogData(res.firstBlog)
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            })
        }
        didMountRef.current = false
    }, [])


    return (
        <>
            {
                loading == true ? <>
                    <section className='spaced-section mt-5 section-featured-blog'>
                        <div className="container">
                            <div className="row">
                                <Skeleton width={100} />
                                <Skeleton width={220} />
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <Skeleton width='100%' height='100%' />
                                    <Skeleton width={300} />
                                    <Skeleton width={280} />
                                </div>
                                <div className="col-lg-6">
                                    <div className="row">
                                        {
                                            [...Array(4)].map((_, index) => (
                                                <div className="col-lg-6" key={index}>
                                                    <Skeleton width='100%' height={250} />
                                                    <Skeleton width={150} />
                                                    <Skeleton width={120} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </section>
                </> : blogData.length > 0 && (
                    <section className='spaced-section section-featured-blog'>
                        <div className='featured_blog-padding section_border_top section_border_bottom'>
                            <div className="section-header__line">
                                <div className="container">
                                    <div className="section-header__item">
                                        <div className="subtitle">Journal</div>
                                        <div className="section-header__title__block">
                                            <h2 className="section-header__title title--section h2">Latest News & Blogs</h2>
                                            <a href={`/blogs`} className="button button--simple"><span className="button-simpl__label">Read All</span></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='container'>
                                <div className='featured-blog'>
                                    <div className='featured-blog__wrapper'>
                                        {firstBlogData !== "" ? <>

                                            <article className="article__wrapper article-wrapper__big article__border article">
                                                <div className="article__block color-background-4 have-overlay color-border-1">
                                                    <a href={`/blogs/${firstBlogData.blog_slug}`} className="article_img">
                                                        <img src={firstBlogData.blog_image != null ? blogImagePath + '/' + firstBlogData.blog_image : constants.DEFAULT_IMAGE} alt={firstBlogData.blog_name}></img>
                                                    </a>
                                                    <div className="article__text">
                                                        <div className="article__info subtitle">
                                                            <div className="article__date"><time dateTime="2023-05-19T07:03:24Z">{moment(firstBlogData.created_at).format('MMM D, YYYY')}</time></div>
                                                            <div className="article__author">by <span>{firstBlogData.blog_admin_name}</span></div>

                                                        </div>

                                                        <h2 className="article__title"><a href={`/blogs/${firstBlogData.blog_slug}`} className="full-unstyled-link">{firstBlogData.blog_name}</a></h2>
                                                    </div>
                                                </div>
                                            </article>
                                        </> : ""}

                                        {blogData?.length > 0 ? <>

                                            <div className="article-wrapper__small article__wrapper ">
                                                {
                                                    blogData.map((value, index) => {
                                                        return <React.Fragment key={index}>
                                                            <article className="article__wrapper article__border article">
                                                                <div className="article__block">
                                                                    <a href={`/blogs/${value.blog_slug}`} className="article_img have-overlay color-background-4 color-border-1" style={{ paddingBottom: '70%' }}>
                                                                        <img src={value.blog_image != null ? blogImagePath + "/" + value.blog_image : ''} alt='' sizes='100vw' />
                                                                    </a>
                                                                    <div className="article__text">
                                                                        <div className="article__info subtitle">
                                                                            <div className="article__date"><time dateTime="2023-05-19T07:03:24Z">{moment(value.created_at).format('MMM D, YYYY')}</time></div>
                                                                            <div className="article__author">by <span>{value.blog_admin_name}</span></div>
                                                                        </div>
                                                                        <h2 className="article__title h4"><a href={`/blogs/${value.blog_slug}`} className="full-unstyled-link">{value.blog_name}</a></h2>
                                                                    </div>
                                                                </div>
                                                            </article>
                                                        </React.Fragment>
                                                    })
                                                }
                                            </div>
                                        </> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

        </>
    )
}

export default HomeBlogs