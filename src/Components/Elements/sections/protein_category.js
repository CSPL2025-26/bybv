import React, { useEffect, useRef, useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { ApiService } from '../../services/apiServices'
import constants from '../../services/constants'
import Skeleton from 'react-loading-skeleton'

function Category() {

  const didMountRef = useRef(true)
  const [categoryData, setCategoryData] = useState([])
  const [categoryImageUrl, setCategoryImageUrl] = useState([])
  const [loading, setLoading] = useState();


  useEffect(() => {
    if (didMountRef.current) {
      setLoading(true)
      getCategory()
    }
    didMountRef.current = false

  })


  const getCategory = () => {
    ApiService.fetchData("products-category").then((res) => {
      if (res.status == "success") {
        setCategoryData(res.procat)
        setCategoryImageUrl(res.categoryImageUrl)
        setLoading(false)

      }
    })
  }

  return (
    <>
      <BrowserView>
        {
          loading == true ? <>
            <section className='categories-list-section spaced-section'>
              <div className='categories-list color-background-4 sectionlarge have-overlay'>
                <div className='container'>
                  <div className='categories-list__wrapper'>
                    <ul className='category-list__list'>

                      <li className={"active"}>
                        <h2 className="category-list__title h1">

                        </h2>
                        <div className="category-list__img">
                          <Skeleton width='100%' height='100%' />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </> : categoryData.length > 0 && (
            <section className='categories-list-section spaced-section'>
              <div className='categories-list color-background-4 sectionlarge have-overlay'>
                <div className='container'>
                  <div className='categories-list__wrapper'>
                    <div className="category-list__subtitle subtitle">Categories</div>
                    <ul className='category-list__list'>
                      {categoryData.map((category, index) => (
                        <li key={index} className={index === 0 ? "active" : "opacity"}>
                          <h2 className="category-list__title h1">
                            <a href={`/collections/category/${category.cat_slug}`}>{category.cat_name}</a>
                          </h2>
                          <div className="category-list__img">
                            <img src={category.cat_banner_image != null ? categoryImageUrl + category.cat_banner_image : constants.DEFAULT_IMAGE} alt={category.cat_name} sizes='100vw' />
                          </div>
                        </li>
                      ))}

                    </ul>
                  </div>
                </div>
              </div>
            </section>)
      }

      </BrowserView>

      <MobileView>
      {
        loading ==true ? <>
        <section className='categories-list-section spaced-section'>
            <div className='categories-list color-background-4 sectionlarge have-overlay'>
              <div className='container'>
                <div className='categories-list__wrapper'>
                  <ul className='category-list__list'>

                    <li className={"active"}>
                      <h2 className="category-list__title h1">

                      </h2>
                      <div className="category-list__img">
                        <Skeleton width='100%' height='100%' />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>:categoryData.length > 0 && (
          <section className='categories-list-section spaced-section'>
            <div className='categories-list color-background-4 sectionlarge have-overlay'>
              <div className='container'>
                <div className='categories-list__wrapper'>
                  <div className="category-list__subtitle subtitle">Categories</div>
                  <ul className='category-list__list'>
                    {categoryData.map((category, index) => (
                      <li key={index} className={index === 0 ? "active" : "opacity"}>
                        <h2 className="category-list__title h2">
                          <a href={`/collections/${category.cat_slug}`}>{category.cat_name}</a>
                        </h2>
                        <div className="category-list__img">
                          <img src={category.cat_banner_image != null ? categoryImageUrl + category.cat_banner_image : constants.DEFAULT_IMAGE} alt={category.cat_name} sizes='100vw' />
                        </div>
                      </li>
                    ))}

                  </ul>
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

export default Category