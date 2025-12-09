import React from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { BrowserView, MobileView } from 'react-device-detect'

function Error404() {
  
    return (
   <>
    <Header/>
    <BrowserView>
         <section className="text-center spaced-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mt-5 mb-5">
                <h2>404. PAGE NOT FOUND</h2>
                <p>The page you were looking for could not be found. It might have been removed, renamed, or did not exist in the first place.</p>
              </div>
            </div>
          </div>
        </section>
       </BrowserView>
       <MobileView>
       <section className="text-center spaced-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mt-5 mb-5">
                <h2>404. PAGE NOT FOUND</h2>
                <p>The page you were looking for could not be found. It might have been removed, renamed, or did not exist in the first place.</p>
              </div>
            </div>
          </div>
        </section>

       </MobileView>
    <Footer/>

    </>


  )
}

export default Error404