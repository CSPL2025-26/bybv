import React from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

function CancelPayment() {

  return (

    <>
    <Header/>
    <section className="sectionmedium">
          <div className="container">
                <div className="row">
        <img src="/img/oops.png" alt="Oops" />
        <h6 className='text-center'>Your payment has been cancelled. Please try again.</h6>
      </div>
      </div>

      </section>
    <Footer/>
    </>


  )
}

export default CancelPayment